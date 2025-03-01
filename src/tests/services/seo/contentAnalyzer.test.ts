import { calculateReadabilityScore, analyzeKeywordDensity, getMetaData, analyzeHeadings } from '../../../services/seo/contentAnalyzer';
import axios from 'axios';
import { JSDOM } from 'jsdom';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Content Analyzer Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateReadabilityScore', () => {
    it('should calculate readability score correctly', async () => {
      const mockHtml = `
        <html>
          <body>
            <p>This is a simple test paragraph. It contains multiple sentences. 
            The sentences are of varying length to test readability scoring.</p>
          </body>
        </html>
      `;

      mockedAxios.get.mockResolvedValueOnce({ data: mockHtml });

      const score = await calculateReadabilityScore('http://test.com');
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should handle errors gracefully', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      const score = await calculateReadabilityScore('http://test.com');
      expect(score).toBe(0);
    });
  });

  describe('analyzeKeywordDensity', () => {
    it('should calculate keyword density correctly', async () => {
      const mockHtml = `
        <html>
          <body>
            <p>SEO is important for websites. SEO helps improve visibility.
            Good SEO practices are essential for success.</p>
          </body>
        </html>
      `;

      mockedAxios.get.mockResolvedValueOnce({ data: mockHtml });

      const density = await analyzeKeywordDensity('http://test.com');
      expect(density).toHaveProperty('seo');
      expect(density.seo).toBeGreaterThan(0);
    });

    it('should handle errors gracefully', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      const density = await analyzeKeywordDensity('http://test.com');
      expect(density).toEqual({});
    });
  });

  describe('getMetaData', () => {
    it('should extract meta data correctly', async () => {
      const mockHtml = `
        <html>
          <head>
            <title>Test Page</title>
            <meta name="description" content="Test description">
            <meta name="keywords" content="test,seo,keywords">
            <meta property="og:title" content="OG Title">
            <meta property="og:description" content="OG Description">
            <meta property="og:image" content="http://test.com/image.jpg">
          </head>
        </html>
      `;

      mockedAxios.get.mockResolvedValueOnce({ data: mockHtml });

      const meta = await getMetaData('http://test.com');
      expect(meta).toMatchObject({
        title: 'Test Page',
        description: 'Test description',
        keywords: ['test', 'seo', 'keywords'],
        ogTitle: 'OG Title',
        ogDescription: 'OG Description',
        ogImage: 'http://test.com/image.jpg',
      });
    });

    it('should handle missing meta data', async () => {
      const mockHtml = '<html><head><title>Test</title></head></html>';
      mockedAxios.get.mockResolvedValueOnce({ data: mockHtml });

      const meta = await getMetaData('http://test.com');
      expect(meta).toMatchObject({
        title: 'Test',
        keywords: [],
      });
    });
  });

  describe('analyzeHeadings', () => {
    it('should analyze heading structure correctly', async () => {
      const mockHtml = `
        <html>
          <body>
            <h1>Main Title</h1>
            <h2>Section 1</h2>
            <h3>Subsection 1.1</h3>
            <h2>Section 2</h2>
            <h3>Subsection 2.1</h3>
          </body>
        </html>
      `;

      mockedAxios.get.mockResolvedValueOnce({ data: mockHtml });

      const headings = await analyzeHeadings('http://test.com');
      expect(headings).toMatchObject({
        h1: ['Main Title'],
        h2: ['Section 1', 'Section 2'],
        h3: ['Subsection 1.1', 'Subsection 2.1'],
      });
    });

    it('should handle missing headings', async () => {
      const mockHtml = '<html><body><p>No headings</p></body></html>';
      mockedAxios.get.mockResolvedValueOnce({ data: mockHtml });

      const headings = await analyzeHeadings('http://test.com');
      expect(headings).toMatchObject({
        h1: [],
        h2: [],
        h3: [],
      });
    });
  });
});
