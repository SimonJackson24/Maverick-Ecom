import { prisma } from '../../lib/prisma';
import { getMetaData } from './contentAnalyzer';

interface MetaValidationResult {
  id: string;
  url: string;
  title: string;
  description: string | null;
  keywords: string[];
  status: 'ok' | 'warning' | 'error';
  issues: string[];
}

export async function validateMetaTags(url?: string): Promise<MetaValidationResult[]> {
  try {
    // Get all pages to validate
    const pages = await prisma.seoMetrics.findMany({
      where: url ? { page_url: { contains: url } } : undefined,
    });

    const results: MetaValidationResult[] = [];

    for (const page of pages) {
      const meta = await getMetaData(page.page_url);
      if (!meta) continue;

      const issues: string[] = [];
      let status: 'ok' | 'warning' | 'error' = 'ok';

      // Validate title
      if (!meta.title) {
        issues.push('Missing page title');
        status = 'error';
      } else {
        if (meta.title.length < 30) {
          issues.push('Title is too short (recommended: 30-60 characters)');
          status = 'warning';
        } else if (meta.title.length > 60) {
          issues.push('Title is too long (recommended: 30-60 characters)');
          status = 'warning';
        }
      }

      // Validate description
      if (!meta.description) {
        issues.push('Missing meta description');
        status = 'error';
      } else {
        if (meta.description.length < 120) {
          issues.push('Description is too short (recommended: 120-160 characters)');
          status = 'warning';
        } else if (meta.description.length > 160) {
          issues.push('Description is too long (recommended: 120-160 characters)');
          status = 'warning';
        }
      }

      // Validate keywords
      if (!meta.keywords || meta.keywords.length === 0) {
        issues.push('Missing meta keywords');
        status = 'warning';
      } else if (meta.keywords.length > 10) {
        issues.push('Too many keywords (recommended: max 10)');
        status = 'warning';
      }

      // Validate Open Graph tags
      if (!meta.ogTitle) {
        issues.push('Missing Open Graph title');
        status = 'warning';
      }
      if (!meta.ogDescription) {
        issues.push('Missing Open Graph description');
        status = 'warning';
      }
      if (!meta.ogImage) {
        issues.push('Missing Open Graph image');
        status = 'warning';
      }

      results.push({
        id: page.id,
        url: page.page_url,
        title: meta.title || '',
        description: meta.description,
        keywords: meta.keywords || [],
        status,
        issues,
      });
    }

    return results;
  } catch (error) {
    console.error('Error validating meta tags:', error);
    throw error;
  }
}
