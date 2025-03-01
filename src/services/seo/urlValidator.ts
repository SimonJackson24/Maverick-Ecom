import SeoMetrics from '../../server/models/SeoMetrics';
import axios from 'axios';
import { urlCheckLimiter } from '../../utils/rateLimiter';
import { logger } from '../../server/utils/logger';

export async function validateUrls() {
  try {
    const metrics = await SeoMetrics.find();
    const results = [];

    for (const metric of metrics) {
      try {
        // Apply rate limiting
        await urlCheckLimiter.acquire();
        
        const status = await checkUrl(metric.url);
        
        // Update URL status and any issues
        const updated = await SeoMetrics.findByIdAndUpdate(
          metric._id,
          {
            $set: {
              urlScore: status === 200 ? 100 : Math.max(0, 100 - (status - 200)),
              lastUpdated: new Date()
            },
            $pull: {
              issues: { category: 'accessibility' }
            }
          },
          { new: true }
        );

        if (updated) {
          results.push(updated);
        }
      } catch (error) {
        logger.error(`Error checking URL "${metric.url}":`, error);
        
        // Update with error status
        const updated = await SeoMetrics.findByIdAndUpdate(
          metric._id,
          {
            $set: {
              urlScore: 0,
              lastUpdated: new Date()
            },
            $push: {
              issues: {
                severity: 'error',
                message: `Failed to access URL: ${error.message}`,
                category: 'accessibility'
              }
            }
          },
          { new: true }
        );

        if (updated) {
          results.push(updated);
        }
      }
    }

    return results;
  } catch (error) {
    logger.error('Error validating URLs:', error);
    throw error;
  }
}

async function checkUrl(url: string): Promise<number> {
  try {
    const response = await axios.head(url, {
      maxRedirects: 5,
      validateStatus: (status) => status < 500, // Accept all status codes less than 500
      timeout: 10000 // 10 second timeout
    });
    return response.status;
  } catch (error: any) {
    if (error.response) {
      return error.response.status;
    }
    throw error;
  }
}

export async function validateCanonicalTags(url: string) {
  try {
    await urlCheckLimiter.acquire();
    
    const response = await axios.get(url, { timeout: 10000 });
    const canonical = response.data.match(/<link[^>]*rel="canonical"[^>]*>/g);
    
    if (!canonical) {
      return {
        status: 'warning',
        message: 'No canonical tag found',
      };
    }

    const href = canonical[0].match(/href="([^"]*)"/);
    if (!href) {
      return {
        status: 'error',
        message: 'Invalid canonical tag format',
      };
    }

    const canonicalUrl = href[1];
    if (canonicalUrl !== url) {
      return {
        status: 'warning',
        message: `Canonical URL differs: ${canonicalUrl}`,
      };
    }

    return {
      status: 'ok',
      message: 'Valid canonical tag',
    };
  } catch (error) {
    logger.error('Error validating canonical tags:', error);
    return {
      status: 'error',
      message: 'Failed to validate canonical tags',
    };
  }
}

export async function checkRedirects(url: string) {
  try {
    await urlCheckLimiter.acquire();
    
    const response = await axios.get(url, {
      maxRedirects: 10,
      validateStatus: (status) => status < 500,
      timeout: 10000
    });

    const redirectChain = response.request._redirectable._redirectCount > 0
      ? response.request._redirectable._redirects.map((r: any) => ({
          from: r.from,
          to: r.to,
          status: r.status,
        }))
      : [];

    return {
      finalUrl: response.config.url,
      status: response.status,
      redirectChain,
    };
  } catch (error: any) {
    logger.error('Error checking redirects:', error);
    return {
      status: error.response?.status || 500,
      error: 'Failed to check redirects',
    };
  }
}
