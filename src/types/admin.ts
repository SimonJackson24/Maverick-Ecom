// Permission type for admin access control
import type { Permission } from './permissions';

export interface GeneralSettings {
  siteName: string;
  siteUrl: string;
  supportEmail: string;
  supportPhone: string;
  timezone: string;
  currency: string;
  defaultLanguage: string;
}

export interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxAge: number; // days
  };
  sessionTimeout: number; // minutes
  maxLoginAttempts: number;
  lockoutDuration: number; // minutes
  twoFactorAuth: {
    enabled: boolean;
    required: boolean;
    methods: ('email' | 'authenticator' | 'sms')[];
  };
}

export interface EmailSettings {
  provider: 'smtp' | 'sendgrid' | 'mailgun';
  from: {
    name: string;
    email: string;
  };
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  sendgrid?: {
    apiKey: string;
  };
  mailgun?: {
    apiKey: string;
    domain: string;
  };
  templates: {
    orderConfirmation: string;
    passwordReset: string;
    welcomeEmail: string;
    abandonedCart: string;
    newsletterConfirmation: string;
  };
}

export interface AnalyticsSettings {
  googleAnalytics: {
    enabled: boolean;
    trackingId: string;
    anonymizeIp: boolean;
    ecommerceTracking: boolean;
  };
  hotjar: {
    enabled: boolean;
    siteId: string;
  };
  facebookPixel: {
    enabled: boolean;
    pixelId: string;
  };
  abTesting: {
    enabled: boolean;
    maxConcurrentTests: number;
    minimumTrafficPerVariant: number;
  };
}

export interface ScentSettings {
  recommendations: {
    enabled: boolean;
    algorithm: 'collaborative' | 'content-based' | 'hybrid';
    minConfidenceScore: number;
    maxSuggestions: number;
  };
  attributes: {
    categories: string[];
    intensityLevels: string[];
    notes: string[];
  };
  personalization: {
    enabled: boolean;
    learningRate: number;
    userHistoryWeight: number;
  };
}

export interface ProductSettings {
  inventory: {
    trackInventory: boolean;
    lowStockThreshold: number;
    outOfStockBehavior: 'hide' | 'show' | 'backorder';
    backorderLimit: number;
  };
  pricing: {
    taxIncluded: boolean;
    defaultTaxRate: number;
    roundingMethod: 'none' | 'up' | 'down' | 'nearest';
    decimalPlaces: number;
  };
  reviews: {
    enabled: boolean;
    requirePurchase: boolean;
    moderationRequired: boolean;
    allowPhotos: boolean;
    minimumRating: number;
  };
  images: {
    maxSize: number; // bytes
    formats: ('jpg' | 'png' | 'webp')[];
    sizes: {
      thumbnail: { width: number; height: number };
      small: { width: number; height: number };
      medium: { width: number; height: number };
      large: { width: number; height: number };
    };
    optimization: {
      quality: number;
      compression: 'lossy' | 'lossless';
    };
  };
}

export interface ShippingSettings {
  methods: Array<{
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    price: number;
    freeThreshold?: number;
    restrictions?: {
      countries: string[];
      minWeight?: number;
      maxWeight?: number;
      minTotal?: number;
      maxTotal?: number;
    };
  }>;
  packaging: {
    types: Array<{
      id: string;
      name: string;
      dimensions: {
        length: number;
        width: number;
        height: number;
      };
      maxWeight: number;
    }>;
  };
  warehouse: {
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    pickupEnabled: boolean;
    pickupInstructions: string;
  };
}

export interface MarketingSettings {
  newsletter: {
    enabled: boolean;
    doubleOptIn: boolean;
    welcomeEmail: boolean;
    provider: string;
    listId: string;
  };
  abandonedCart: {
    enabled: boolean;
    delay: number; // hours
    maxReminders: number;
    discountEnabled: boolean;
    discountAmount: number;
    discountType: 'percentage' | 'fixed';
  };
  promotions: {
    stackable: boolean;
    maxDiscount: number;
    excludedProducts: string[];
    excludedCategories: string[];
  };
  seo: {
    titleTemplate: string;
    defaultMetaDescription: string;
    defaultOgImage: string;
    structuredData: boolean;
    sitemapEnabled: boolean;
    robotsTxt: string;
  };
}

export interface IntegrationSettings {
  payment: {
    stripe: {
      enabled: boolean;
      publicKey: string;
      secretKey: string;
      webhookSecret: string;
    };
    paypal: {
      enabled: boolean;
      clientId: string;
      clientSecret: string;
      sandbox: boolean;
    };
  };
  shipping: {
    usps: {
      enabled: boolean;
      username: string;
      password: string;
    };
    fedex: {
      enabled: boolean;
      accountNumber: string;
      meterNumber: string;
      key: string;
      password: string;
    };
  };
  tax: {
    provider: 'manual' | 'avalara' | 'taxjar';
    avalara?: {
      accountId: string;
      licenseKey: string;
      companyCode: string;
    };
    taxjar?: {
      apiKey: string;
    };
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'support';
  permissions: Permission[];
  lastLogin?: string;
  twoFactorEnabled?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
  totalOrders: number;
  percentageChange?: number;
}

export interface DashboardStats {
  customers: {
    total: number;
    new: number;
    returning: number;
    percentageChange: number;
    recentCustomers: Array<{
      id: string;
      name: string;
      email: string;
      orderCount: number;
      totalSpent: number;
      lastOrderDate: string;
      totalOrders: number;
    }>;
  };
  revenue: {
    total: number;
    previousPeriod: number;
    percentageChange: number;
    breakdown: Array<{
      period: string;
      amount: number;
    }>;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    percentageChange: number;
    recentOrders: Array<{
      id: string;
      orderNumber: string;
      customer: {
        name: string;
        email: string;
      };
      status: string;
      total: number;
      createdAt: string;
    }>;
  };
  products: {
    total: number;
    outOfStock: number;
    lowStock: number;
    topSellers: Array<{
      id: string;
      name: string;
      sku: string;
      price: number;
      quantitySold: number;
      revenue: number;
    }>;
  };
  inventory: {
    totalValue: number;
    totalItems: number;
    lowStockItems: Array<{
      id: string;
      name: string;
      sku: string;
      quantity: number;
      reorderPoint: number;
    }>;
    outOfStockItems: Array<{
      id: string;
      name: string;
      sku: string;
      lastInStock: string;
    }>;
  };
  marketing: {
    activePromotions: number;
    emailSubscribers: number;
    campaignPerformance: Array<{
      id: string;
      name: string;
      type: string;
      status: string;
      startDate: string;
      endDate: string;
      metrics: {
        impressions: number;
        clicks: number;
        conversions: number;
        revenue: number;
      };
    }>;
  };
  systemHealth: {
    status: string;
    uptime: number;
    lastBackup: string;
    pendingUpdates: number;
    errors: {
      count: number;
      recent: Array<{
        id: string;
        message: string;
        timestamp: string;
        severity: string;
      }>;
    };
  };
}

export type ComparisonPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface DashboardFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  comparison: ComparisonPeriod;
}

export interface PeriodOption {
  value: ComparisonPeriod;
  label: string;
  description: string;
}

export interface DashboardSettings {
  defaultView: 'overview' | 'detailed';
  refreshInterval: number;
  visibleMetrics: string[];
  chartPreferences: {
    type: 'line' | 'bar' | 'pie';
    showLegend: boolean;
    colors: string[];
  };
}

export interface WhatsAppSettings {
  enabled: boolean;
  apiUrl: string;
  accessToken: string;
  businessPhoneNumber: string;
  businessName: string;
  welcomeMessage: string;
  groupId: string;
  notifyNewCustomer: boolean;
  webhook: {
    enabled: boolean;
    verifyToken: string;
    notificationUrl: string;
  };
  operatingHours: {
    enabled: boolean;
    schedule: Array<{
      isOpen: boolean;
      start: string;
      end: string;
    }>;
  };
  autoReply: {
    enabled: boolean;
    message: string;
  };
}

export interface WhatsAppMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    caption?: string;
  };
}

export interface CommunicationSettings {
  whatsapp: WhatsAppSettings;
  email: EmailSettings;
  notifications: {
    desktop: boolean;
    email: boolean;
    slack: boolean;
    teams: boolean;
  };
  chatWidget: {
    enabled: boolean;
    position: 'left' | 'right';
    theme: 'light' | 'dark';
    customCss?: string;
  };
}
