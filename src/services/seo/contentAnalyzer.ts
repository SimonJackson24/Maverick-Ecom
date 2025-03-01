import axios from 'axios';
import { JSDOM } from 'jsdom';
import { removeStopWords, calculateFleschReadability } from '../../utils/text';
import { contentAnalysisLimiter } from '../../utils/rateLimiter';
import { logger } from '../../server/utils/logger';

export async function calculateReadabilityScore(url: string): Promise<number> {
  try {
    await contentAnalysisLimiter.acquire();
    
    const response = await axios.get(url, { timeout: 10000 });
    const dom = new JSDOM(response.data);
    const content = dom.window.document.body.textContent || '';
    
    return calculateFleschReadability(content);
  } catch (error) {
    logger.error('Error calculating readability score:', error);
    return 0;
  }
}

export async function analyzeKeywordDensity(url: string): Promise<Record<string, number>> {
  try {
    await contentAnalysisLimiter.acquire();
    
    const response = await axios.get(url, { timeout: 10000 });
    const dom = new JSDOM(response.data);
    const content = dom.window.document.body.textContent || '';
    
    // Remove stop words and split into words
    const words = removeStopWords(content.toLowerCase()).split(/\s+/);
    const totalWords = words.length;
    
    // Calculate word frequency
    const wordFrequency: Record<string, number> = {};
    words.forEach(word => {
      if (word.length > 2) { // Ignore very short words
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });
    
    // Convert to percentages
    const density: Record<string, number> = {};
    Object.entries(wordFrequency).forEach(([word, count]) => {
      density[word] = (count / totalWords) * 100;
    });
    
    // Sort by density and return top 20 keywords
    return Object.fromEntries(
      Object.entries(density)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 20)
    );
  } catch (error) {
    logger.error('Error analyzing keyword density:', error);
    return {};
  }
}

export async function getMetaData(url: string) {
  try {
    await contentAnalysisLimiter.acquire();
    
    const response = await axios.get(url, { timeout: 10000 });
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    
    return {
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
      keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content')?.split(',').map(k => k.trim()) || [],
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
      ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
    };
  } catch (error) {
    logger.error('Error getting meta data:', error);
    return null;
  }
}

export async function analyzeHeadings(url: string) {
  try {
    await contentAnalysisLimiter.acquire();
    
    const response = await axios.get(url, { timeout: 10000 });
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    
    const headings = {
      h1: Array.from(document.querySelectorAll('h1')).map(h => h.textContent?.trim()).filter(Boolean),
      h2: Array.from(document.querySelectorAll('h2')).map(h => h.textContent?.trim()).filter(Boolean),
      h3: Array.from(document.querySelectorAll('h3')).map(h => h.textContent?.trim()).filter(Boolean),
    };
    
    return headings;
  } catch (error) {
    logger.error('Error analyzing headings:', error);
    return null;
  }
}

export async function getWordCount(url: string): Promise<number> {
  try {
    await contentAnalysisLimiter.acquire();
    
    const response = await axios.get(url, { timeout: 10000 });
    const dom = new JSDOM(response.data);
    const content = dom.window.document.body.textContent || '';
    
    return content.split(/\s+/).filter(Boolean).length;
  } catch (error) {
    logger.error('Error getting word count:', error);
    return 0;
  }
}
