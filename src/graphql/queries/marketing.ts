import { gql } from '@apollo/client';

// Coupon Queries and Mutations
export const GET_COUPONS = gql`
  query GetCoupons {
    coupons {
      id
      code
      type
      value
      maxUses
      usageCount
      minPurchaseAmount
      isActive
      expiryDate
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_COUPON = gql`
  mutation CreateCoupon($input: CouponInput!) {
    createCoupon(input: $input) {
      id
      code
      type
      value
      maxUses
      usageCount
      minPurchaseAmount
      isActive
      expiryDate
    }
  }
`;

export const UPDATE_COUPON = gql`
  mutation UpdateCoupon($id: ID!, $input: CouponInput!) {
    updateCoupon(id: $id, input: $input) {
      id
      code
      type
      value
      maxUses
      usageCount
      minPurchaseAmount
      isActive
      expiryDate
    }
  }
`;

export const DELETE_COUPON = gql`
  mutation DeleteCoupon($id: ID!) {
    deleteCoupon(id: $id) {
      id
    }
  }
`;

// Loyalty Program Queries and Mutations
export const GET_LOYALTY_PROGRAM = gql`
  query GetLoyaltyProgram {
    loyaltyProgram {
      id
      isEnabled
      settings {
        pointsPerDollar
        minimumPurchase
        pointsValidity
      }
      rewards {
        id
        name
        description
        pointsCost
        type
        value
        isActive
        maxRedemptions
        expiryDays
      }
      tiers {
        id
        name
        description
        requiredPoints
        benefits
        multiplier
        color
      }
    }
  }
`;

export const UPDATE_LOYALTY_SETTINGS = gql`
  mutation UpdateLoyaltySettings($input: LoyaltySettingsInput!) {
    updateLoyaltySettings(input: $input) {
      id
      isEnabled
      settings {
        pointsPerDollar
        minimumPurchase
        pointsValidity
      }
    }
  }
`;

export const CREATE_REWARD = gql`
  mutation CreateReward($input: RewardInput!) {
    createReward(input: $input) {
      id
      name
      description
      pointsCost
      type
      value
      isActive
      maxRedemptions
      expiryDays
    }
  }
`;

export const UPDATE_REWARD = gql`
  mutation UpdateReward($id: ID!, $input: RewardInput!) {
    updateReward(id: $id, input: $input) {
      id
      name
      description
      pointsCost
      type
      value
      isActive
      maxRedemptions
      expiryDays
    }
  }
`;

export const CREATE_TIER = gql`
  mutation CreateTier($input: TierInput!) {
    createTier(input: $input) {
      id
      name
      description
      requiredPoints
      benefits
      multiplier
      color
    }
  }
`;

export const UPDATE_TIER = gql`
  mutation UpdateTier($id: ID!, $input: TierInput!) {
    updateTier(id: $id, input: $input) {
      id
      name
      description
      requiredPoints
      benefits
      multiplier
      color
    }
  }
`;

// Email Campaign Queries and Mutations
export const GET_EMAIL_CAMPAIGNS = gql`
  query GetEmailCampaigns {
    emailCampaigns {
      id
      name
      subject
      content
      status
      recipientCount
      scheduledDate
      openRate
      clickRate
      segments
      createdAt
      updatedAt
    }
  }
`;

export const GET_CUSTOMER_SEGMENTS = gql`
  query GetCustomerSegments {
    customerSegments {
      id
      name
      description
      customerCount
      criteria
    }
  }
`;

export const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign($input: CampaignInput!) {
    createCampaign(input: $input) {
      id
      name
      subject
      content
      status
      recipientCount
      scheduledDate
      segments
    }
  }
`;

export const UPDATE_CAMPAIGN = gql`
  mutation UpdateCampaign($id: ID!, $input: CampaignInput!) {
    updateCampaign(id: $id, input: $input) {
      id
      name
      subject
      content
      status
      recipientCount
      scheduledDate
      segments
    }
  }
`;

export const DELETE_CAMPAIGN = gql`
  mutation DeleteCampaign($id: ID!) {
    deleteCampaign(id: $id) {
      id
    }
  }
`;
