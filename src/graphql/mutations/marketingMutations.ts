import {
  couponsVar,
  loyaltyProgramVar,
  emailCampaignsVar,
  customerSegmentsVar,
} from '../mocks/marketingMocks';
import type {
  Coupon,
  CouponInput,
  LoyaltySettingsInput,
  RewardInput,
  TierInput,
  CampaignInput,
  EmailCampaign,
} from '../types/marketing';

// Coupon Mutations
export const createCouponMutation = (input: CouponInput): Coupon => {
  const newCoupon: Coupon = {
    id: String(Date.now()),
    ...input,
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const currentCoupons = couponsVar();
  couponsVar([...currentCoupons, newCoupon]);
  
  return newCoupon;
};

export const updateCouponMutation = (id: string, input: CouponInput): Coupon => {
  const currentCoupons = couponsVar();
  const couponIndex = currentCoupons.findIndex(c => c.id === id);
  
  if (couponIndex === -1) {
    throw new Error('Coupon not found');
  }
  
  const updatedCoupon: Coupon = {
    ...currentCoupons[couponIndex],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  
  currentCoupons[couponIndex] = updatedCoupon;
  couponsVar([...currentCoupons]);
  
  return updatedCoupon;
};

export const deleteCouponMutation = (id: string): { id: string } => {
  const currentCoupons = couponsVar();
  const filteredCoupons = currentCoupons.filter(c => c.id !== id);
  couponsVar(filteredCoupons);
  
  return { id };
};

// Loyalty Program Mutations
export const updateLoyaltySettingsMutation = (input: LoyaltySettingsInput) => {
  const currentProgram = loyaltyProgramVar();
  const updatedProgram = {
    ...currentProgram,
    isEnabled: input.isEnabled ?? currentProgram.isEnabled,
    settings: {
      ...currentProgram.settings,
      pointsPerDollar: input.pointsPerDollar ?? currentProgram.settings.pointsPerDollar,
      minimumPurchase: input.minimumPurchase ?? currentProgram.settings.minimumPurchase,
      pointsValidity: input.pointsValidity ?? currentProgram.settings.pointsValidity,
    },
  };
  
  loyaltyProgramVar(updatedProgram);
  return updatedProgram;
};

export const createRewardMutation = (input: RewardInput) => {
  const currentProgram = loyaltyProgramVar();
  const newReward = {
    id: String(Date.now()),
    ...input,
  };
  
  const updatedProgram = {
    ...currentProgram,
    rewards: [...currentProgram.rewards, newReward],
  };
  
  loyaltyProgramVar(updatedProgram);
  return newReward;
};

export const updateRewardMutation = (id: string, input: RewardInput) => {
  const currentProgram = loyaltyProgramVar();
  const rewardIndex = currentProgram.rewards.findIndex(r => r.id === id);
  
  if (rewardIndex === -1) {
    throw new Error('Reward not found');
  }
  
  const updatedReward = {
    ...currentProgram.rewards[rewardIndex],
    ...input,
  };
  
  const updatedProgram = {
    ...currentProgram,
    rewards: [
      ...currentProgram.rewards.slice(0, rewardIndex),
      updatedReward,
      ...currentProgram.rewards.slice(rewardIndex + 1),
    ],
  };
  
  loyaltyProgramVar(updatedProgram);
  return updatedReward;
};

export const createTierMutation = (input: TierInput) => {
  const currentProgram = loyaltyProgramVar();
  const newTier = {
    id: String(Date.now()),
    ...input,
  };
  
  const updatedProgram = {
    ...currentProgram,
    tiers: [...currentProgram.tiers, newTier],
  };
  
  loyaltyProgramVar(updatedProgram);
  return newTier;
};

export const updateTierMutation = (id: string, input: TierInput) => {
  const currentProgram = loyaltyProgramVar();
  const tierIndex = currentProgram.tiers.findIndex(t => t.id === id);
  
  if (tierIndex === -1) {
    throw new Error('Tier not found');
  }
  
  const updatedTier = {
    ...currentProgram.tiers[tierIndex],
    ...input,
  };
  
  const updatedProgram = {
    ...currentProgram,
    tiers: [
      ...currentProgram.tiers.slice(0, tierIndex),
      updatedTier,
      ...currentProgram.tiers.slice(tierIndex + 1),
    ],
  };
  
  loyaltyProgramVar(updatedProgram);
  return updatedTier;
};

// Email Campaign Mutations
export const createCampaignMutation = (input: CampaignInput): EmailCampaign => {
  const newCampaign: EmailCampaign = {
    id: String(Date.now()),
    ...input,
    status: 'draft',
    recipientCount: 0,
    openRate: null,
    clickRate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const currentCampaigns = emailCampaignsVar();
  emailCampaignsVar([...currentCampaigns, newCampaign]);
  
  return newCampaign;
};

export const updateCampaignMutation = (id: string, input: CampaignInput): EmailCampaign => {
  const currentCampaigns = emailCampaignsVar();
  const campaignIndex = currentCampaigns.findIndex(c => c.id === id);
  
  if (campaignIndex === -1) {
    throw new Error('Campaign not found');
  }
  
  const updatedCampaign: EmailCampaign = {
    ...currentCampaigns[campaignIndex],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  
  currentCampaigns[campaignIndex] = updatedCampaign;
  emailCampaignsVar([...currentCampaigns]);
  
  return updatedCampaign;
};

export const deleteCampaignMutation = (id: string): { id: string } => {
  const currentCampaigns = emailCampaignsVar();
  const filteredCampaigns = currentCampaigns.filter(c => c.id !== id);
  emailCampaignsVar(filteredCampaigns);
  
  return { id };
};
