import { CronJob } from 'cron';
import SeoMetrics from '../models/SeoMetrics';
import { checkKeywordRankings } from '../../services/seo/keywordTracker';
import { validateMetaTags } from '../../services/seo/metaValidator';
import { validateUrls } from '../../services/seo/urlValidator';
import { calculateReadabilityScore, analyzeKeywordDensity } from '../../services/seo/contentAnalyzer';
import { logger } from '../utils/logger';

// Run full SEO analysis daily at 2 AM
export const dailySeoAnalysis = new CronJob('0 2 * * *', async () => {
  try {
    logger.info('Starting daily SEO analysis');

    const metrics = await SeoMetrics.find();
    
    for (const metric of metrics) {
      try {
        // Run comprehensive analysis
        const readabilityScore = await calculateReadabilityScore(metric.url);
        const keywordDensity = await analyzeKeywordDensity(metric.url);
        const metaTags = await validateMetaTags(metric.url);
        const urlStatus = await validateUrls();

        // Calculate scores
        const contentScore = readabilityScore;
        const metaScore = metaTags.length > 0 ? metaTags[0].status === 'ok' ? 100 : 50 : 0;
        const urlScore = urlStatus.length > 0 ? urlStatus[0].status === 200 ? 100 : 50 : 0;

        // Update metrics
        await SeoMetrics.findByIdAndUpdate(metric._id, {
          $set: {
            contentScore,
            metaScore,
            urlScore,
            readabilityScore,
            lastUpdated: new Date(),
          }
        });

        logger.info(`Completed analysis for ${metric.url}`);
      } catch (error) {
        logger.error(`Error analyzing ${metric.url}:`, error);
      }

      // Wait between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    logger.info('Completed daily SEO analysis');
  } catch (error) {
    logger.error('Error in daily SEO analysis:', error);
  }
});

// Check keyword rankings every 6 hours
export const keywordRankingCheck = new CronJob('0 */6 * * *', async () => {
  try {
    logger.info('Starting keyword ranking check');
    await checkKeywordRankings();
    logger.info('Completed keyword ranking check');
  } catch (error) {
    logger.error('Error checking keyword rankings:', error);
  }
});

// Validate URLs every hour
export const urlValidation = new CronJob('0 * * * *', async () => {
  try {
    logger.info('Starting URL validation');
    await validateUrls();
    logger.info('Completed URL validation');
  } catch (error) {
    logger.error('Error validating URLs:', error);
  }
});

// Start all jobs
export function startSeoJobs() {
  dailySeoAnalysis.start();
  keywordRankingCheck.start();
  urlValidation.start();
  logger.info('Started all SEO jobs');
}

// Stop all jobs
export function stopSeoJobs() {
  dailySeoAnalysis.stop();
  keywordRankingCheck.stop();
  urlValidation.stop();
  logger.info('Stopped all SEO jobs');
}
