import axios from 'axios';
import { JSDOM } from 'jsdom';

export const seoResolvers = {
  Query: {
    getSEOMetrics: async (_: any, { url }: { url: string }) => {
      try {
        const response = await axios.get(url);
        const dom = new JSDOM(response.data);
        const document = dom.window.document;

        // Get meta tags
        const metaTags = {
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
          keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
        };

        // Get headings
        const headings = [];
        for (let i = 1; i <= 6; i++) {
          const elements = document.querySelectorAll(`h${i}`);
          elements.forEach(el => {
            headings.push({
              level: i,
              text: el.textContent || '',
            });
          });
        }

        // Get word count
        const content = document.body.textContent || '';
        const wordCount = content.trim().split(/\s+/).length;

        // Calculate readability (simple implementation)
        const sentences = content.split(/[.!?]+/).length;
        const readabilityScore = sentences > 0 ? (wordCount / sentences) : 0;

        // Calculate keyword density
        const words = content.toLowerCase().split(/\s+/);
        const wordFreq = {};
        words.forEach(word => {
          if (word.length > 3) { // Ignore very short words
            wordFreq[word] = (wordFreq[word] || 0) + 1;
          }
        });

        const keywordDensity = Object.entries(wordFreq)
          .map(([keyword, count]) => ({
            keyword,
            density: (Number(count) / wordCount) * 100,
          }))
          .sort((a, b) => b.density - a.density)
          .slice(0, 20);

        return {
          readabilityScore,
          keywordDensity,
          wordCount,
          metaTags,
          headings,
        };
      } catch (error) {
        console.error('Error fetching SEO metrics:', error);
        throw new Error('Error loading SEO metrics. Please try again later.');
      }
    },
  },
};
