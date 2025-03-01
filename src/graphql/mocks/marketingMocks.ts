import { makeVar } from '@apollo/client';
import type {
  Coupon,
  LoyaltyProgram,
  EmailCampaign,
  CustomerSegment
} from '../types/marketing';

// Mock data for coupons
export const couponsVar = makeVar<Coupon[]>([
  {
    id: '1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    maxUses: 1000,
    usageCount: 150,
    minPurchaseAmount: 0,
    isActive: true,
    expiryDate: '2025-12-31',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  },
  {
    id: '2',
    code: 'SPRING25',
    type: 'percentage',
    value: 25,
    maxUses: 500,
    usageCount: 0,
    minPurchaseAmount: 50,
    isActive: true,
    expiryDate: '2025-05-31',
    createdAt: '2025-02-01',
    updatedAt: '2025-02-01'
  }
]);

// Mock data for loyalty program
export const loyaltyProgramVar = makeVar<LoyaltyProgram>({
  id: '1',
  isEnabled: true,
  settings: {
    pointsPerDollar: 1,
    minimumPurchase: 0,
    pointsValidity: 12
  },
  rewards: [
    {
      id: '1',
      name: '$5 Off Your Next Purchase',
      description: 'Get $5 off your next order',
      pointsCost: 500,
      type: 'discount_fixed',
      value: 5,
      isActive: true,
      maxRedemptions: null,
      expiryDays: 30
    },
    {
      id: '2',
      name: 'Free Shipping',
      description: 'Get free shipping on your next order',
      pointsCost: 1000,
      type: 'free_shipping',
      value: 0,
      isActive: true,
      maxRedemptions: null,
      expiryDays: 30
    }
  ],
  tiers: [
    {
      id: '1',
      name: 'Bronze',
      description: 'Entry level tier',
      requiredPoints: 0,
      benefits: ['Earn 1x points', 'Birthday reward'],
      multiplier: 1,
      color: '#CD7F32'
    },
    {
      id: '2',
      name: 'Silver',
      description: 'Mid level tier',
      requiredPoints: 1000,
      benefits: ['Earn 1.5x points', 'Birthday reward', 'Free shipping on orders over $50'],
      multiplier: 1.5,
      color: '#C0C0C0'
    },
    {
      id: '3',
      name: 'Gold',
      description: 'Top level tier',
      requiredPoints: 5000,
      benefits: ['Earn 2x points', 'Birthday reward', 'Free shipping on all orders', 'Early access to sales'],
      multiplier: 2,
      color: '#FFD700'
    }
  ]
});

// Mock data for email campaigns
export const emailCampaignsVar = makeVar<EmailCampaign[]>([
  {
    id: '1',
    name: 'Welcome Series',
    subject: 'Welcome to Wick & Wax Co!',
    content: 'Thank you for joining our community...',
    status: 'sent',
    recipientCount: 1500,
    scheduledDate: null,
    openRate: 65.4,
    clickRate: 32.1,
    segments: ['new_customers'],
    createdAt: '2025-01-15',
    updatedAt: '2025-01-15'
  },
  {
    id: '2',
    name: 'Spring Collection Launch',
    subject: 'New Spring Scents Have Arrived!',
    content: 'Discover our new spring collection...',
    status: 'scheduled',
    recipientCount: 5000,
    scheduledDate: '2025-03-01',
    openRate: null,
    clickRate: null,
    segments: ['all_customers', 'vip_customers'],
    createdAt: '2025-02-15',
    updatedAt: '2025-02-15'
  }
]);

// Mock data for customer segments
export const customerSegmentsVar = makeVar<CustomerSegment[]>([
  {
    id: '1',
    name: 'All Customers',
    description: 'All active customers',
    customerCount: 10000,
    criteria: {
      type: 'all',
      conditions: [
        {
          field: 'status',
          operator: 'equals',
          value: 'active'
        }
      ]
    }
  },
  {
    id: '2',
    name: 'VIP Customers',
    description: 'Customers who have spent over $500',
    customerCount: 2500,
    criteria: {
      type: 'all',
      conditions: [
        {
          field: 'total_spent',
          operator: 'greater_than',
          value: 500
        }
      ]
    }
  },
  {
    id: '3',
    name: 'New Customers',
    description: 'Customers who joined in the last 30 days',
    customerCount: 750,
    criteria: {
      type: 'all',
      conditions: [
        {
          field: 'created_at',
          operator: 'greater_than',
          value: 'now-30d'
        }
      ]
    }
  }
]);
