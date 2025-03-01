import { seoResolvers } from '../../../graphql/resolvers/seoResolvers';
import SeoMetrics from '../../../server/models/SeoMetrics';
import { calculateReadabilityScore, analyzeKeywordDensity } from '../../../services/seo/contentAnalyzer';
import { validateMetaTags } from '../../../services/seo/metaValidator';
import { validateUrls } from '../../../services/seo/urlValidator';
import { checkKeywordRankings } from '../../../services/seo/keywordTracker';

jest.mock('../../../server/models/SeoMetrics');
jest.mock('../../../services/seo/contentAnalyzer');
jest.mock('../../../services/seo/metaValidator');
jest.mock('../../../services/seo/urlValidator');
jest.mock('../../../services/seo/keywordTracker');

const mockedSeoMetrics = SeoMetrics as jest.Mocked<any>;

describe('SEO Resolvers', () => {
  const mockContext = {
    user: {
      permissions: ['MANAGE_MARKETING']
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Query.seoMetrics', () => {
    it('should return SEO metrics', async () => {
      const mockMetrics = [{
        contentScore: 85,
        metaScore: 90,
        urlScore: 95,
        readabilityScore: 80,
        issues: [],
        keywordPerformance: [],
        contentHealth: [],
        lastUpdated: new Date()
      }];

      mockedSeoMetrics.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockMetrics)
        })
      });

      const result = await seoResolvers.Query.seoMetrics(null, {}, mockContext);

      expect(result.overallScore).toBe(90); // (85 + 90 + 95) / 3
      expect(result.contentHealthScore).toBe(85);
      expect(result.metaTagScore).toBe(90);
      expect(result.urlScore).toBe(95);
    });

    it('should handle empty metrics', async () => {
      mockedSeoMetrics.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([])
        })
      });

      const result = await seoResolvers.Query.seoMetrics(null, {}, mockContext);

      expect(result.overallScore).toBe(0);
      expect(result.contentHealthScore).toBe(0);
      expect(result.metaTagScore).toBe(0);
      expect(result.urlScore).toBe(0);
    });

    it('should require authorization', async () => {
      const contextWithoutPermission = { user: { permissions: [] } };

      await expect(
        seoResolvers.Query.seoMetrics(null, {}, contextWithoutPermission)
      ).rejects.toThrow('Not authorized');
    });
  });

  describe('Mutation.runSeoAnalysis', () => {
    it('should run SEO analysis successfully', async () => {
      const url = 'http://test.com';
      const mockReadabilityScore = 85;
      const mockMetaTags = [{ status: 'ok' }];
      const mockUrlStatus = [{ status: 200 }];

      (calculateReadabilityScore as jest.Mock).mockResolvedValue(mockReadabilityScore);
      (validateMetaTags as jest.Mock).mockResolvedValue(mockMetaTags);
      (validateUrls as jest.Mock).mockResolvedValue(mockUrlStatus);

      const mockUpdatedMetrics = {
        contentScore: mockReadabilityScore,
        metaScore: 100,
        urlScore: 100,
        readabilityScore: mockReadabilityScore,
        lastUpdated: expect.any(Date)
      };

      mockedSeoMetrics.findOneAndUpdate.mockResolvedValue(mockUpdatedMetrics);

      const result = await seoResolvers.Mutation.runSeoAnalysis(
        null,
        { url },
        mockContext
      );

      expect(result).toEqual(mockUpdatedMetrics);
      expect(calculateReadabilityScore).toHaveBeenCalledWith(url);
      expect(validateMetaTags).toHaveBeenCalledWith(url);
      expect(validateUrls).toHaveBeenCalled();
    });

    it('should handle analysis errors', async () => {
      (calculateReadabilityScore as jest.Mock).mockRejectedValue(new Error('Analysis failed'));

      await expect(
        seoResolvers.Mutation.runSeoAnalysis(
          null,
          { url: 'http://test.com' },
          mockContext
        )
      ).rejects.toThrow('Failed to run SEO analysis');
    });
  });

  describe('Mutation.checkKeywordRankings', () => {
    it('should check keyword rankings successfully', async () => {
      const mockRankings = [
        { keyword: 'test', position: 1 },
        { keyword: 'example', position: 5 }
      ];

      (checkKeywordRankings as jest.Mock).mockResolvedValue(mockRankings);

      const result = await seoResolvers.Mutation.checkKeywordRankings(
        null,
        {},
        mockContext
      );

      expect(result).toEqual(mockRankings);
      expect(checkKeywordRankings).toHaveBeenCalled();
    });

    it('should require authorization', async () => {
      const contextWithoutPermission = { user: { permissions: [] } };

      await expect(
        seoResolvers.Mutation.checkKeywordRankings(null, {}, contextWithoutPermission)
      ).rejects.toThrow('Not authorized');
    });
  });
});
