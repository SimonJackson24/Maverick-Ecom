import { validateUrls, validateCanonicalTags, checkRedirects } from '../../../services/seo/urlValidator';
import SeoMetrics from '../../../server/models/SeoMetrics';
import axios from 'axios';

jest.mock('axios');
jest.mock('../../../server/models/SeoMetrics');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedSeoMetrics = SeoMetrics as jest.Mocked<any>;

describe('URL Validator Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUrls', () => {
    it('should validate URLs correctly', async () => {
      // Mock database response
      mockedSeoMetrics.find.mockResolvedValueOnce([
        { _id: '1', url: 'http://test1.com' },
        { _id: '2', url: 'http://test2.com' },
      ]);

      // Mock axios responses
      mockedAxios.head
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ status: 404 });

      // Mock database updates
      mockedSeoMetrics.findByIdAndUpdate
        .mockResolvedValueOnce({ _id: '1', url: 'http://test1.com', urlScore: 100 })
        .mockResolvedValueOnce({ _id: '2', url: 'http://test2.com', urlScore: 0 });

      const results = await validateUrls();

      expect(results).toHaveLength(2);
      expect(results[0].urlScore).toBe(100);
      expect(results[1].urlScore).toBe(0);
    });

    it('should handle network errors', async () => {
      mockedSeoMetrics.find.mockResolvedValueOnce([
        { _id: '1', url: 'http://test.com' },
      ]);

      mockedAxios.head.mockRejectedValueOnce(new Error('Network error'));

      mockedSeoMetrics.findByIdAndUpdate.mockResolvedValueOnce({
        _id: '1',
        url: 'http://test.com',
        urlScore: 0,
        issues: [{
          severity: 'error',
          message: 'Failed to access URL: Network error',
          category: 'accessibility'
        }]
      });

      const results = await validateUrls();

      expect(results).toHaveLength(1);
      expect(results[0].urlScore).toBe(0);
      expect(results[0].issues[0].severity).toBe('error');
    });
  });

  describe('validateCanonicalTags', () => {
    it('should validate canonical tags correctly', async () => {
      const mockHtml = `
        <html>
          <head>
            <link rel="canonical" href="http://test.com" />
          </head>
        </html>
      `;

      mockedAxios.get.mockResolvedValueOnce({ data: mockHtml });

      const result = await validateCanonicalTags('http://test.com');

      expect(result.status).toBe('ok');
      expect(result.message).toBe('Valid canonical tag');
    });

    it('should detect missing canonical tags', async () => {
      const mockHtml = '<html><head></head></html>';

      mockedAxios.get.mockResolvedValueOnce({ data: mockHtml });

      const result = await validateCanonicalTags('http://test.com');

      expect(result.status).toBe('warning');
      expect(result.message).toBe('No canonical tag found');
    });

    it('should detect mismatched canonical URLs', async () => {
      const mockHtml = `
        <html>
          <head>
            <link rel="canonical" href="http://different.com" />
          </head>
        </html>
      `;

      mockedAxios.get.mockResolvedValueOnce({ data: mockHtml });

      const result = await validateCanonicalTags('http://test.com');

      expect(result.status).toBe('warning');
      expect(result.message).toBe('Canonical URL differs: http://different.com');
    });
  });

  describe('checkRedirects', () => {
    it('should track redirect chains correctly', async () => {
      const mockRedirectChain = {
        request: {
          _redirectable: {
            _redirectCount: 2,
            _redirects: [
              { from: 'http://old.com', to: 'http://new.com', status: 301 },
              { from: 'http://new.com', to: 'http://final.com', status: 301 }
            ]
          }
        },
        config: { url: 'http://final.com' },
        status: 200
      };

      mockedAxios.get.mockResolvedValueOnce(mockRedirectChain);

      const result = await checkRedirects('http://old.com');

      expect(result.status).toBe(200);
      expect(result.finalUrl).toBe('http://final.com');
      expect(result.redirectChain).toHaveLength(2);
      expect(result.redirectChain[0].status).toBe(301);
    });

    it('should handle no redirects', async () => {
      const mockResponse = {
        request: {
          _redirectable: {
            _redirectCount: 0,
            _redirects: []
          }
        },
        config: { url: 'http://test.com' },
        status: 200
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await checkRedirects('http://test.com');

      expect(result.status).toBe(200);
      expect(result.finalUrl).toBe('http://test.com');
      expect(result.redirectChain).toHaveLength(0);
    });

    it('should handle errors', async () => {
      mockedAxios.get.mockRejectedValueOnce({ response: { status: 404 } });

      const result = await checkRedirects('http://test.com');

      expect(result.status).toBe(404);
      expect(result.error).toBe('Failed to check redirects');
    });
  });
});
