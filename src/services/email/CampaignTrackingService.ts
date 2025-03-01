import { analytics } from '../analytics/unifiedAnalytics';

interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  templateId: string;
  segment: UserSegment;
  startDate: Date;
  endDate?: Date;
  status: CampaignStatus;
  metrics: CampaignMetrics;
}

type CampaignType = 
  | 'NEWSLETTER'
  | 'ABANDONED_CART'
  | 'WELCOME_SERIES'
  | 'PRODUCT_LAUNCH'
  | 'SPECIAL_OFFER'
  | 'REENGAGEMENT';

type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';

interface UserSegment {
  id: string;
  name: string;
  criteria: SegmentCriteria[];
}

interface SegmentCriteria {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

interface CampaignMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  unsubscribed: number;
  bounced: number;
  revenue: number;
}

class CampaignTrackingService {
  private static instance: CampaignTrackingService;
  private campaigns: Map<string, Campaign> = new Map();
  private clickTracking: Map<string, Set<string>> = new Map(); // campaignId -> Set of userIds

  private constructor() {}

  public static getInstance(): CampaignTrackingService {
    if (!CampaignTrackingService.instance) {
      CampaignTrackingService.instance = new CampaignTrackingService();
    }
    return CampaignTrackingService.instance;
  }

  public async createCampaign(campaign: Omit<Campaign, 'metrics'>): Promise<Campaign> {
    const newCampaign: Campaign = {
      ...campaign,
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        unsubscribed: 0,
        bounced: 0,
        revenue: 0
      }
    };

    this.campaigns.set(campaign.id, newCampaign);

    analytics.track('campaign_created', {
      campaign_id: campaign.id,
      campaign_type: campaign.type,
      segment: campaign.segment.name
    });

    return newCampaign;
  }

  public async trackEmailSent(campaignId: string, userId: string): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return;

    campaign.metrics.sent++;
    this.campaigns.set(campaignId, campaign);

    analytics.track('email_sent', {
      campaign_id: campaignId,
      campaign_type: campaign.type,
      user_id: userId
    });
  }

  public async trackEmailDelivered(campaignId: string, userId: string): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return;

    campaign.metrics.delivered++;
    this.campaigns.set(campaignId, campaign);

    analytics.track('email_delivered', {
      campaign_id: campaignId,
      campaign_type: campaign.type,
      user_id: userId
    });
  }

  public async trackEmailOpened(campaignId: string, userId: string): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return;

    campaign.metrics.opened++;
    this.campaigns.set(campaignId, campaign);

    analytics.track('email_opened', {
      campaign_id: campaignId,
      campaign_type: campaign.type,
      user_id: userId
    });
  }

  public async trackEmailClicked(
    campaignId: string,
    userId: string,
    linkId: string
  ): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return;

    // Track unique clicks per campaign
    const campaignClicks = this.clickTracking.get(campaignId) || new Set();
    if (!campaignClicks.has(userId)) {
      campaign.metrics.clicked++;
      campaignClicks.add(userId);
      this.clickTracking.set(campaignId, campaignClicks);
    }

    this.campaigns.set(campaignId, campaign);

    analytics.track('email_clicked', {
      campaign_id: campaignId,
      campaign_type: campaign.type,
      user_id: userId,
      link_id: linkId
    });
  }

  public async trackConversion(
    campaignId: string,
    userId: string,
    revenue: number
  ): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return;

    campaign.metrics.converted++;
    campaign.metrics.revenue += revenue;
    this.campaigns.set(campaignId, campaign);

    analytics.track('campaign_conversion', {
      campaign_id: campaignId,
      campaign_type: campaign.type,
      user_id: userId,
      revenue
    });
  }

  public async trackUnsubscribe(campaignId: string, userId: string): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return;

    campaign.metrics.unsubscribed++;
    this.campaigns.set(campaignId, campaign);

    analytics.track('email_unsubscribed', {
      campaign_id: campaignId,
      campaign_type: campaign.type,
      user_id: userId
    });
  }

  public async trackBounce(campaignId: string, userId: string): Promise<void> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return;

    campaign.metrics.bounced++;
    this.campaigns.set(campaignId, campaign);

    analytics.track('email_bounced', {
      campaign_id: campaignId,
      campaign_type: campaign.type,
      user_id: userId
    });
  }

  public getCampaignMetrics(campaignId: string): CampaignMetrics | null {
    const campaign = this.campaigns.get(campaignId);
    return campaign ? campaign.metrics : null;
  }

  public getCampaignPerformance(campaignId: string) {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return null;

    const { metrics } = campaign;
    const delivered = metrics.delivered || 1; // Prevent division by zero

    return {
      deliveryRate: (metrics.delivered / metrics.sent) * 100,
      openRate: (metrics.opened / delivered) * 100,
      clickRate: (metrics.clicked / delivered) * 100,
      conversionRate: (metrics.converted / delivered) * 100,
      unsubscribeRate: (metrics.unsubscribed / delivered) * 100,
      bounceRate: (metrics.bounced / metrics.sent) * 100,
      revenuePerEmail: metrics.revenue / delivered,
      roi: this.calculateROI(campaign)
    };
  }

  private calculateROI(campaign: Campaign): number {
    // Implement ROI calculation based on campaign costs and revenue
    return 0;
  }
}

export const campaignTracking = CampaignTrackingService.getInstance();
