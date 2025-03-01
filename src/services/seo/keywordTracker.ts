import axios from 'axios';
import { keywordTrackingLimiter } from '../../utils/rateLimiter';
import { logger } from '../../server/utils/logger';
import SeoMetrics from '../../server/models/SeoMetrics';

const SERP_API_KEY = process.env.SERP_API_KEY;
const SITE_DOMAIN = process.env.SITE_DOMAIN;

interface KeywordData {
  keyword: string;
  position: number;
  searchVolume: number;
  difficulty: number;
}

export async function trackKeywordRankings(keywords: string[]): Promise<KeywordData[]> {
  if (!SERP_API_KEY) {
    throw new Error('SERP API key not configured');
  }

  const results: KeywordData[] = [];

  for (const keyword of keywords) {
    try {
      await keywordTrackingLimiter.acquire();
      
      const data = await searchKeyword(keyword);
      if (data) {
        results.push(data);
      }
    } catch (error) {
      logger.error(`Error tracking keyword "${keyword}":`, error);
    }
  }

  return results;
}

async function searchKeyword(keyword: string): Promise<KeywordData | null> {
  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        q: keyword,
        api_key: SERP_API_KEY,
        num: 100, // Get top 100 results
      },
      timeout: 30000 // 30 second timeout
    });

    const position = findPosition(response.data.organic_results);
    const searchVolume = await estimateSearchVolume(keyword);
    const difficulty = calculateKeywordDifficulty(response.data.organic_results);

    return {
      keyword,
      position,
      searchVolume,
      difficulty
    };
  } catch (error) {
    logger.error(`Error searching keyword "${keyword}":`, error);
    return null;
  }
}

function findPosition(results: any[]): number {
  if (!results || !Array.isArray(results)) return -1;
  
  const index = results.findIndex(result => 
    result.link && result.link.includes(SITE_DOMAIN)
  );
  
  return index === -1 ? -1 : index + 1;
}

async function estimateSearchVolume(keyword: string): Promise<number> {
  try {
    await keywordTrackingLimiter.acquire();
    
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        q: keyword,
        api_key: SERP_API_KEY,
        num: 1,
      },
      timeout: 30000
    });

    // This is a simplified estimation based on number of results
    // In a production environment, you'd want to use a more sophisticated
    // keyword research API
    const totalResults = parseInt(response.data.search_information?.total_results || '0');
    return Math.min(Math.floor(totalResults / 10000), 1000000);
  } catch (error) {
    logger.error(`Error estimating search volume for "${keyword}":`, error);
    return 0;
  }
}

function calculateKeywordDifficulty(results: any[]): number {
  if (!results || !Array.isArray(results)) return 100;

  // Analyze top 10 results
  const topResults = results.slice(0, 10);
  
  // Factors that increase difficulty:
  // 1. Number of high authority domains (simplified check)
  const highAuthorityDomains = topResults.filter(result => 
    result.link && (
      result.link.includes('.gov') ||
      result.link.includes('.edu') ||
      result.link.includes('wikipedia.org') ||
      result.link.includes('amazon.com')
    )
  ).length;

  // 2. Presence of featured snippets
  const hasSnippets = results.some(result => result.featured_snippet);

  // 3. Number of HTTPS sites (security)
  const httpsCount = topResults.filter(result => 
    result.link && result.link.startsWith('https')
  ).length;

  // Calculate difficulty score (0-100)
  let difficulty = 0;
  difficulty += (highAuthorityDomains * 10); // 0-100
  difficulty += (hasSnippets ? 20 : 0);      // 0 or 20
  difficulty += (httpsCount * 5);            // 0-50

  return Math.min(Math.max(difficulty, 0), 100);
}

export async function updateKeywordMetrics() {
  try {
    const metrics = await SeoMetrics.find();
    
    for (const metric of metrics) {
      if (!metric.keywords || metric.keywords.length === 0) continue;

      const rankings = await trackKeywordRankings(metric.keywords);
      
      // Calculate average position and difficulty
      const validRankings = rankings.filter(r => r.position > 0);
      const avgPosition = validRankings.length > 0
        ? validRankings.reduce((sum, r) => sum + r.position, 0) / validRankings.length
        : -1;
      
      const avgDifficulty = rankings.length > 0
        ? rankings.reduce((sum, r) => sum + r.difficulty, 0) / rankings.length
        : 100;

      // Update metrics
      await SeoMetrics.findByIdAndUpdate(metric._id, {
        $set: {
          keywordScore: calculateKeywordScore(avgPosition, avgDifficulty),
          keywordRankings: rankings,
          lastUpdated: new Date()
        }
      });
    }
  } catch (error) {
    logger.error('Error updating keyword metrics:', error);
    throw error;
  }
}

function calculateKeywordScore(avgPosition: number, avgDifficulty: number): number {
  if (avgPosition === -1) return 0;
  
  // Position score (0-100)
  const positionScore = Math.max(0, 100 - (avgPosition * 2));
  
  // Difficulty adjustment (0-1)
  const difficultyAdjustment = (100 - avgDifficulty) / 100;
  
  // Final score weighted towards position but considering difficulty
  return Math.round((positionScore * 0.7 + (difficultyAdjustment * 100) * 0.3));
}
