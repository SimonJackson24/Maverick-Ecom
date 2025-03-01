export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  maxUses: number | null;
  usageCount: number;
  minPurchaseAmount: number;
  isActive: boolean;
  expiryDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CouponInput {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  maxUses?: number | null;
  minPurchaseAmount: number;
  isActive: boolean;
  expiryDate?: string | null;
}

export interface LoyaltyProgram {
  id: string;
  isEnabled: boolean;
  settings: LoyaltySettings;
  rewards: Reward[];
  tiers: Tier[];
}

export interface LoyaltySettings {
  pointsPerDollar: number;
  minimumPurchase: number;
  pointsValidity: number;
}

export interface LoyaltySettingsInput {
  isEnabled?: boolean;
  pointsPerDollar?: number;
  minimumPurchase?: number;
  pointsValidity?: number;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount_percentage' | 'discount_fixed' | 'free_shipping' | 'free_product';
  value: number;
  isActive: boolean;
  maxRedemptions: number | null;
  expiryDays: number | null;
}

export interface RewardInput {
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount_percentage' | 'discount_fixed' | 'free_shipping' | 'free_product';
  value: number;
  isActive: boolean;
  maxRedemptions?: number | null;
  expiryDays?: number | null;
}

export interface Tier {
  id: string;
  name: string;
  description: string;
  requiredPoints: number;
  benefits: string[];
  multiplier: number;
  color: string;
}

export interface TierInput {
  name: string;
  description: string;
  requiredPoints: number;
  benefits: string[];
  multiplier: number;
  color: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  recipientCount: number;
  scheduledDate: string | null;
  openRate: number | null;
  clickRate: number | null;
  segments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CampaignInput {
  name: string;
  subject: string;
  content: string;
  segments: string[];
  scheduledDate?: string | null;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  customerCount: number;
  criteria: SegmentCriteria;
}

export interface SegmentCriteria {
  type: 'all' | 'any';
  conditions: SegmentCondition[];
}

export interface SegmentCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains';
  value: string | number | boolean;
}
