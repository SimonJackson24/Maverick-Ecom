import { analytics } from '../analytics/unifiedAnalytics';
import { abTesting } from '../testing/abTesting';

interface EmailVariant {
  id: string;
  templateId: string;
  subject: string;
  content: string;
  personalization: PersonalizationConfig;
}

interface PersonalizationConfig {
  recommendationCount: number;
  showScentProfile: boolean;
  includeSeasonalContent: boolean;
  showRelatedProducts: boolean;
  contentStyle: 'minimal' | 'detailed' | 'visual';
}

interface TestResult {
  variantId: string;
  metrics: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
    revenue: number;
  };
}

class EmailABTestingService {
  private static instance: EmailABTestingService;
  private activeTests: Map<string, EmailVariant[]> = new Map();
  private testResults: Map<string, TestResult[]> = new Map();

  private constructor() {}

  public static getInstance(): EmailABTestingService {
    if (!EmailABTestingService.instance) {
      EmailABTestingService.instance = new EmailABTestingService();
    }
    return EmailABTestingService.instance;
  }

  public async createTest(
    testId: string,
    variants: EmailVariant[]
  ): Promise<void> {
    this.activeTests.set(testId, variants);
    this.testResults.set(testId, variants.map(v => ({
      variantId: v.id,
      metrics: {
        sent: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        revenue: 0
      }
    })));

    // Register with A/B testing framework
    await abTesting.initialize();
    
    analytics.track('email_ab_test_created', {
      test_id: testId,
      variant_count: variants.length
    });
  }

  public async getVariantForUser(
    testId: string,
    userId: string
  ): Promise<EmailVariant | null> {
    const variants = this.activeTests.get(testId);
    if (!variants) return null;

    const { variant } = abTesting.getExperimentVariant(testId);
    const selectedVariant = variants.find(v => v.id === variant);

    if (selectedVariant) {
      analytics.track('email_variant_assigned', {
        test_id: testId,
        variant_id: selectedVariant.id,
        user_id: userId
      });
    }

    return selectedVariant || null;
  }

  public async trackMetric(
    testId: string,
    variantId: string,
    metric: keyof TestResult['metrics'],
    value: number = 1
  ): Promise<void> {
    const results = this.testResults.get(testId);
    if (!results) return;

    const variantResult = results.find(r => r.variantId === variantId);
    if (!variantResult) return;

    variantResult.metrics[metric] += value;
    this.testResults.set(testId, results);

    analytics.track('email_test_metric', {
      test_id: testId,
      variant_id: variantId,
      metric,
      value
    });
  }

  public getTestResults(testId: string): TestResult[] | null {
    return this.testResults.get(testId) || null;
  }

  public async determineWinner(testId: string): Promise<string | null> {
    const results = this.testResults.get(testId);
    if (!results) return null;

    // Calculate conversion rates and revenue per user for each variant
    const variantPerformance = results.map(result => {
      const sent = result.metrics.sent || 1; // Prevent division by zero
      return {
        variantId: result.variantId,
        conversionRate: (result.metrics.converted / sent) * 100,
        revenuePerUser: result.metrics.revenue / sent,
        score: 0
      };
    });

    // Calculate composite score (50% conversion rate, 50% revenue per user)
    const maxConversionRate = Math.max(...variantPerformance.map(v => v.conversionRate));
    const maxRevenuePerUser = Math.max(...variantPerformance.map(v => v.revenuePerUser));

    variantPerformance.forEach(variant => {
      variant.score = (
        (variant.conversionRate / maxConversionRate) * 50 +
        (variant.revenuePerUser / maxRevenuePerUser) * 50
      );
    });

    // Find winner
    const winner = variantPerformance.reduce((prev, current) => 
      current.score > prev.score ? current : prev
    );

    analytics.track('email_test_winner_determined', {
      test_id: testId,
      winner_id: winner.variantId,
      performance: variantPerformance
    });

    return winner.variantId;
  }
}

export const emailABTesting = EmailABTestingService.getInstance();
