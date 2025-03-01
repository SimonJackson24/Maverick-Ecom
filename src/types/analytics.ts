import { Product } from './product';
import { Order, OrderStatus } from './order';
import { User } from './user';

export interface AnalyticsEvent {
  id: string;
  type: EventType;
  userId?: string;
  sessionId: string;
  timestamp: string;
  data: Record<string, any>;
}

export type EventType =
  | 'page_view'
  | 'product_view'
  | 'product_click'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'add_to_wishlist'
  | 'remove_from_wishlist'
  | 'begin_checkout'
  | 'add_shipping_info'
  | 'add_payment_info'
  | 'purchase'
  | 'refund'
  | 'apply_coupon'
  | 'remove_coupon'
  | 'search'
  | 'filter'
  | 'sort'
  | 'error';

export interface PerformanceMetrics {
  // Page Load Metrics
  timeToFirstByte: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  domInteractive: number;
  domComplete: number;
  
  // API Metrics
  apiResponseTime: Record<string, number>;
  apiErrorRate: Record<string, number>;
  apiRequestCount: Record<string, number>;
  
  // Resource Metrics
  resourceLoadTime: Record<string, number>;
  resourceSize: Record<string, number>;
  resourceErrors: Record<string, number>;
  
  // Custom Metrics
  componentRenderTime: Record<string, number>;
  interactionTime: Record<string, number>;
  customEvents: Record<string, number>;
}

export interface SalesAnalytics {
  // Revenue Metrics
  totalRevenue: number;
  averageOrderValue: number;
  revenueByDay: DailyMetric[];
  revenueByProduct: ProductMetric[];
  revenueByCategory: CategoryMetric[];
  
  // Order Metrics
  totalOrders: number;
  ordersByStatus: Record<OrderStatus, number>;
  ordersByDay: DailyMetric[];
  conversionRate: number;
  
  // Product Metrics
  topProducts: ProductMetric[];
  lowStockProducts: Product[];
  productViews: Record<string, number>;
  
  // Customer Metrics
  newCustomers: number;
  repeatCustomers: number;
  customerLifetimeValue: number;
  churnRate: number;
}

export interface UserAnalytics {
  // User Behavior
  activeUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  sessionDuration: {
    average: number;
    byDevice: Record<string, number>;
    byUserType: Record<string, number>;
  };
  userFlow: {
    entryPages: Record<string, number>;
    exitPages: Record<string, number>;
    pathAnalysis: PathAnalysis[];
  };
  
  // User Segments
  segments: UserSegment[];
  deviceDistribution: Record<string, number>;
  geographicDistribution: Record<string, number>;
  
  // Engagement Metrics
  engagementScore: number;
  featureUsage: Record<string, number>;
  contentEngagement: Record<string, number>;
}

export interface ABTestMetrics {
  testId: string;
  name: string;
  startDate: string;
  endDate?: string;
  variants: {
    id: string;
    name: string;
    traffic: number;
    conversions: number;
    conversionRate: number;
    revenue: number;
    metrics: Record<string, number>;
  }[];
  winner?: string;
  confidence: number;
}

interface DailyMetric {
  date: string;
  value: number;
  change: number;
}

interface ProductMetric {
  product: Product;
  value: number;
  change: number;
}

interface CategoryMetric {
  category: string;
  value: number;
  change: number;
}

interface PathAnalysis {
  path: string[];
  frequency: number;
  conversionRate: number;
  dropoffRate: number;
}

interface UserSegment {
  id: string;
  name: string;
  criteria: Record<string, any>;
  size: number;
  value: number;
  engagement: number;
}

export interface AnalyticsFilter {
  startDate: string;
  endDate: string;
  granularity: 'hour' | 'day' | 'week' | 'month';
  segments?: string[];
  devices?: string[];
  countries?: string[];
  categories?: string[];
  products?: string[];
  events?: EventType[];
}

export interface AnalyticsConfig {
  enabled: boolean;
  sampleRate: number;
  excludePaths: string[];
  customMetrics: string[];
  eventFilters: Record<string, boolean>;
  storageOptions: {
    type: 'local' | 'session' | 'memory';
    expiry: number;
  };
}
