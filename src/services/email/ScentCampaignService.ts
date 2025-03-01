import { campaignTracking } from './CampaignTrackingService';
import { analytics } from '../analytics/unifiedAnalytics';
import { ScentRecommendationService } from '../recommendations/ScentRecommendationService';
import { Product } from '../../types/product';
import { UserPreferences } from '../../types/user';

interface ScentCampaign {
  id: string;
  name: string;
  scentProfile: string[];
  seasonality: string;
  occasion?: string;
  products: Product[];
  targetPreferences: Partial<UserPreferences>;
}

interface ScentEmailTemplate {
  id: string;
  name: string;
  subject: string;
  preheader: string;
  content: string;
  scentProfile: string[];
}

export class ScentCampaignService {
  private static instance: ScentCampaignService;
  private scentRecommendations: ScentRecommendationService;
  private campaigns: Map<string, ScentCampaign>;
  private templates: Map<string, ScentEmailTemplate>;

  private constructor() {
    this.scentRecommendations = ScentRecommendationService.getInstance();
    this.campaigns = new Map();
    this.templates = new Map();
  }

  public static getInstance(): ScentCampaignService {
    if (!ScentCampaignService.instance) {
      ScentCampaignService.instance = new ScentCampaignService();
    }
    return ScentCampaignService.instance;
  }

  public async createScentCampaign(campaign: ScentCampaign): Promise<void> {
    // Create campaign
    await campaignTracking.createCampaign({
      id: campaign.id,
      name: campaign.name,
      type: 'PRODUCT_LAUNCH',
      templateId: this.findBestTemplate(campaign.scentProfile),
      segment: {
        id: `scent_${campaign.id}`,
        name: `Scent Campaign - ${campaign.name}`,
        criteria: this.buildScentCriteria(campaign),
      },
      startDate: new Date(),
      status: 'ACTIVE',
    });

    this.campaigns.set(campaign.id, campaign);

    analytics.track('scent_campaign_created', {
      campaign_id: campaign.id,
      scent_profile: campaign.scentProfile,
      seasonality: campaign.seasonality,
      occasion: campaign.occasion,
    });
  }

  private buildScentCriteria(campaign: ScentCampaign) {
    const criteria = [
      {
        field: 'scentPreferences',
        operator: 'contains' as const,
        value: campaign.scentProfile,
      },
    ];

    if (campaign.targetPreferences.preferredIntensity) {
      criteria.push({
        field: 'preferredIntensity',
        operator: 'equals' as const,
        value: campaign.targetPreferences.preferredIntensity,
      });
    }

    if (campaign.seasonality) {
      criteria.push({
        field: 'seasonalPreferences',
        operator: 'contains' as const,
        value: campaign.seasonality,
      });
    }

    return criteria;
  }

  private findBestTemplate(scentProfile: string[]): string {
    let bestMatch: { templateId: string; matchCount: number } = {
      templateId: '',
      matchCount: 0,
    };

    for (const [id, template] of this.templates) {
      const matchCount = template.scentProfile.filter(scent => 
        scentProfile.includes(scent)
      ).length;

      if (matchCount > bestMatch.matchCount) {
        bestMatch = { templateId: id, matchCount };
      }
    }

    return bestMatch.templateId || 'default_template';
  }

  public async addTemplate(template: ScentEmailTemplate): Promise<void> {
    this.templates.set(template.id, template);

    analytics.track('scent_template_added', {
      template_id: template.id,
      scent_profile: template.scentProfile,
    });
  }

  public async getRecommendedProducts(
    userId: string,
    campaignId: string
  ): Promise<Product[]> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      return [];
    }

    const recommendations = await this.scentRecommendations
      .getPersonalizedRecommendations(userId);

    return recommendations.filter(product => 
      product.scentProfile?.some(scent => campaign.scentProfile.includes(scent))
    );
  }

  public async trackScentInteraction(
    userId: string,
    campaignId: string,
    interaction: {
      scentProfile: string[];
      action: 'view' | 'click' | 'purchase';
      productId?: string;
    }
  ): Promise<void> {
    analytics.track('scent_interaction', {
      user_id: userId,
      campaign_id: campaignId,
      ...interaction,
    });

    if (interaction.action === 'purchase' && interaction.productId) {
      await this.scentRecommendations.updateUserPreferences(userId, {
        productId: interaction.productId,
        action: 'purchase',
      });
    }
  }

  public async analyzeCampaignPerformance(campaignId: string): Promise<{
    scentPerformance: Record<string, {
      impressions: number;
      clicks: number;
      conversions: number;
      revenue: number;
    }>;
    topPerformingScents: string[];
    recommendations: string[];
  }> {
    // Implementation would analyze campaign metrics by scent profile
    // and provide recommendations for future campaigns
    return {
      scentPerformance: {},
      topPerformingScents: [],
      recommendations: [],
    };
  }

  public clearCampaigns(): void {
    this.campaigns.clear();
  }
}
