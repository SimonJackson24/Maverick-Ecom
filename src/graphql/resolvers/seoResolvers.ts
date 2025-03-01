import SeoMetrics from '../../server/models/SeoMetrics';
import { calculateReadabilityScore, analyzeKeywordDensity, getMetaData, analyzeHeadings, getWordCount } from '../../services/seo/contentAnalyzer';
import { trackKeywordRankings } from '../../services/seo/keywordTracker';
import { validateMetaTags } from '../../services/seo/metaValidator';
import { validateUrls, validateCanonicalTags, checkRedirects } from '../../services/seo/urlValidator';
import { calculateTrend } from '../../utils/metrics';
import type { Context } from '../context';

export const seoResolvers = {
  Query: {
    seoMetrics: async (_parent: any, _args: any, ctx: Context) => {
      try {
        // Ensure user has permission
        if (!ctx.user?.permissions?.includes('MANAGE_MARKETING')) {
          throw new Error('Not authorized');
        }

        // Get latest metrics
        const metrics = await SeoMetrics.find()
          .sort({ lastUpdated: -1 })
          .limit(1);

        // Get historical data for trends
        const historicalMetrics = await SeoMetrics.find()
          .sort({ lastUpdated: -1 })
          .limit(30); // Last 30 days

        // Calculate trends
        const scoreTrend = calculateTrend(historicalMetrics.map(m => m.contentScore));
        const contentHealthTrend = calculateTrend(historicalMetrics.map(m => m.contentScore));
        const metaTagTrend = calculateTrend(historicalMetrics.map(m => m.metaScore));
        const urlTrend = calculateTrend(historicalMetrics.map(m => m.urlScore));

        // Get current metrics or default values
        const currentMetrics = metrics[0] || {
          contentScore: 0,
          metaScore: 0,
          urlScore: 0,
          readabilityScore: 0,
          issues: [],
          keywordRankings: [],
          contentHealth: [],
          metaTags: [],
          urls: []
        };

        return {
          overallScore: (currentMetrics.contentScore + currentMetrics.metaScore + currentMetrics.urlScore) / 3,
          scoreTrend,
          contentHealthScore: currentMetrics.contentScore,
          contentHealthTrend,
          metaTagScore: currentMetrics.metaScore,
          metaTagTrend,
          urlScore: currentMetrics.urlScore,
          urlTrend,
          keywordRankings: currentMetrics.keywordRankings || [],
          contentHealth: currentMetrics.contentHealth || [],
          metaTags: currentMetrics.metaTags || [],
          urls: currentMetrics.urls || [],
          issues: currentMetrics.issues || []
        };
      } catch (error) {
        console.error('Error in seoMetrics resolver:', error);
        throw error;
      }
    },

    keywordPerformance: async (_parent: any, args: { keyword?: string }, ctx: Context) => {
      if (!ctx.user?.permissions?.includes('MANAGE_MARKETING')) {
        throw new Error('Not authorized');
      }

      const metrics = await SeoMetrics.findOne();
      if (!metrics) return [];

      if (args.keyword) {
        return metrics.keywordPerformance.filter(kp => 
          kp.keyword.toLowerCase().includes(args.keyword!.toLowerCase())
        );
      }

      return metrics.keywordPerformance;
    },

    contentHealth: async (_parent: any, args: { url?: string }, ctx: Context) => {
      if (!ctx.user?.permissions?.includes('MANAGE_MARKETING')) {
        throw new Error('Not authorized');
      }

      const metrics = await SeoMetrics.findOne();
      if (!metrics) return [];

      if (args.url) {
        return metrics.contentHealth.filter(ch => 
          ch.url.includes(args.url!)
        );
      }

      return metrics.contentHealth;
    },

    metaTags: async (_parent: any, args: { url?: string }, ctx: Context) => {
      if (!ctx.user?.permissions?.includes('MANAGE_MARKETING')) {
        throw new Error('Not authorized');
      }

      return validateMetaTags(args.url);
    },

    urlManagement: async (_parent: any, args: { url?: string }, ctx: Context) => {
      if (!ctx.user?.permissions?.includes('MANAGE_MARKETING')) {
        throw new Error('Not authorized');
      }

      return validateUrls();
    },

    seoIssues: async (_parent: any, args: { type?: string }, ctx: Context) => {
      if (!ctx.user?.permissions?.includes('MANAGE_MARKETING')) {
        throw new Error('Not authorized');
      }

      const metrics = await SeoMetrics.findOne();
      if (!metrics) return [];

      if (args.type) {
        return metrics.issues.filter(issue => 
          issue.severity === args.type
        );
      }

      return metrics.issues;
    },
  },

  Mutation: {
    updateMetaTag: async (_parent: any, { input }: { input: any }, ctx: Context) => {
      if (!ctx.user?.permissions?.includes('MANAGE_MARKETING')) {
        throw new Error('Not authorized');
      }

      const metrics = await SeoMetrics.findOne({ url: input.url });
      if (!metrics) {
        throw new Error('URL not found');
      }

      // Update meta information
      metrics.title = input.title;
      metrics.description = input.description;
      metrics.keywords = input.keywords;
      metrics.lastUpdated = new Date();

      await metrics.save();

      return validateMetaTags(input.url);
    },

    runSeoAnalysis: async (_parent: any, { url }: { url: string }, ctx: Context) => {
      try {
        // Ensure user has permission
        if (!ctx.user?.permissions?.includes('MANAGE_MARKETING')) {
          throw new Error('Not authorized');
        }

        // Run all analyses in parallel
        const [
          readabilityScore,
          keywordDensity,
          metaData,
          headings,
          wordCount,
          urlValidation,
          canonicalCheck,
          redirects
        ] = await Promise.all([
          calculateReadabilityScore(url),
          analyzeKeywordDensity(url),
          getMetaData(url),
          analyzeHeadings(url),
          getWordCount(url),
          validateUrls(),
          validateCanonicalTags(url),
          checkRedirects(url)
        ]);

        // Collect all issues
        const issues = [];

        // Add readability issues
        if (readabilityScore < 60) {
          issues.push({
            severity: 'warning',
            message: 'Content readability score is low',
            category: 'content'
          });
        }

        // Add meta tag issues
        if (!metaData?.title || !metaData?.description) {
          issues.push({
            severity: 'error',
            message: 'Missing required meta tags',
            category: 'meta'
          });
        }

        // Add canonical issues
        if (canonicalCheck.status !== 'ok') {
          issues.push({
            severity: canonicalCheck.status,
            message: canonicalCheck.message,
            category: 'url'
          });
        }

        // Add URL issues
        if (redirects.status >= 400) {
          issues.push({
            severity: 'error',
            message: `URL returned status ${redirects.status}`,
            category: 'url'
          });
        }

        // Save analysis results
        const seoMetrics = new SeoMetrics({
          url,
          contentScore: readabilityScore,
          metaScore: metaData ? 100 : 0,
          urlScore: redirects.status === 200 ? 100 : Math.max(0, 100 - (redirects.status - 200)),
          readabilityScore,
          keywordDensity,
          metaTags: metaData,
          headings,
          wordCount,
          issues,
          lastUpdated: new Date()
        });

        await seoMetrics.save();

        return {
          url,
          readabilityScore,
          wordCount,
          keywordDensity: Object.entries(keywordDensity).map(([keyword, density]) => ({
            keyword,
            density
          })),
          headings,
          metaTags: metaData,
          issues
        };
      } catch (error) {
        console.error('Error in runSeoAnalysis:', error);
        throw error;
      }
    },

    checkKeywordRankings: async (_parent: any, _args: any, ctx: Context) => {
      if (!ctx.user?.permissions?.includes('MANAGE_MARKETING')) {
        throw new Error('Not authorized');
      }

      return trackKeywordRankings();
    },
  },
};
