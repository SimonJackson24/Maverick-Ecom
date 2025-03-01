export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED'
}

export enum SubscriptionInterval {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY'
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  interval: SubscriptionInterval;
  price: number;
  trialDays?: number;
  features: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: Date;
  pausedAt?: Date;
  resumeAt?: Date;
  trialEnd?: Date;
  nextDeliveryDate?: Date;
  billingDetails: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionDelivery {
  id: string;
  subscriptionId: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'FAILED';
  scheduledDate: Date;
  actualDeliveryDate?: Date;
  trackingNumber?: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
