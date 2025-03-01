// Common Types
export interface PaginationInput {
  page: number;
  perPage: number;
}

export interface SortInput {
  field: string;
  direction: 'ASC' | 'DESC';
}

export interface DateRangeInput {
  start: Date;
  end: Date;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  sku: string;
  price: {
    regularPrice: {
      amount: {
        value: number;
        currency: string;
      };
    };
  };
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK';
  scentProfile: ScentProfile;
}

export interface ProductInput {
  name: string;
  sku: string;
  price: number;
  status: string;
  scentProfile: ScentProfileInput;
}

export interface BulkOperationResult {
  success: boolean;
  message: string;
  successCount: number;
  failureCount: number;
  errors: Array<{
    id: string;
    message: string;
  }>;
}

// Scent Types
export interface ScentProfile {
  primary_notes: ScentNote[];
  middle_notes: ScentNote[];
  base_notes: ScentNote[];
  intensity: 'LIGHT' | 'MODERATE' | 'STRONG';
  mood: string[];
  season: string[];
}

export interface ScentNote {
  name: string;
  intensity: number;
}

export interface ScentProfileInput {
  primary_notes: ScentNoteInput[];
  middle_notes: ScentNoteInput[];
  base_notes: ScentNoteInput[];
  intensity: string;
  mood: string[];
  season: string[];
}

export interface ScentNoteInput {
  name: string;
  intensity: number;
}

export interface ScentAttribute {
  id: string;
  name: string;
  type: string;
  intensity: number;
  category: string;
  description: string;
  relatedNotes: string[];
}

export interface ScentRule {
  id: string;
  name: string;
  description: string;
  conditions: ScentRuleCondition[];
  priority: number;
  isActive: boolean;
}

export interface ScentRuleCondition {
  attribute: string;
  operator: string;
  value: any;
}

// Analytics Types
export interface SalesAnalytics {
  revenue: {
    total: number;
    byDay: Array<{
      date: string;
      amount: number;
    }>;
  };
  orders: {
    total: number;
    average: number;
    byStatus: Array<{
      status: string;
      count: number;
    }>;
  };
  products: {
    topSelling: Array<{
      id: string;
      name: string;
      quantity: number;
      revenue: number;
    }>;
    lowStock: Array<{
      id: string;
      name: string;
      quantity: number;
      threshold: number;
    }>;
  };
  conversion: {
    rate: number;
    funnelStages: Array<{
      stage: string;
      count: number;
      dropoff: number;
    }>;
  };
}

export interface ScentAnalytics {
  popularScents: Array<{
    note: string;
    purchaseCount: number;
    revenue: number;
    rating: number;
  }>;
  combinations: Array<{
    notes: string[];
    purchaseCount: number;
    successRate: number;
  }>;
  seasonalTrends: Array<{
    season: string;
    topScents: string[];
    averageIntensity: number;
  }>;
  customerPreferences: Array<{
    segment: string;
    preferredNotes: string[];
    averageIntensity: number;
  }>;
}

// Configuration Types
export interface PaymentConfig {
  providers: Array<{
    id: string;
    name: string;
    isEnabled: boolean;
    apiKeys: {
      test: string;
      live: string;
    };
    supportedMethods: string[];
  }>;
  currencies: Array<{
    code: string;
    rate: number;
    isDefault: boolean;
  }>;
  taxSettings: {
    includesTax: boolean;
    calculateTaxBasedOn: string;
  };
}

export interface ShippingConfig {
  methods: Array<{
    id: string;
    name: string;
    isEnabled: boolean;
    pricing: {
      type: string;
      baseRate: number;
      conditions: Array<{
        type: string;
        value: number;
        adjustment: number;
      }>;
    };
  }>;
  zones: Array<{
    id: string;
    name: string;
    countries: string[];
    methods: string[];
  }>;
  restrictions: {
    minOrderValue: number;
    maxWeight: number;
    restrictedItems: string[];
  };
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  isActive: boolean;
}

export interface APIConfig {
  keys: Array<{
    id: string;
    name: string;
    permissions: string[];
    lastUsed: Date;
  }>;
  webhooks: Array<{
    id: string;
    url: string;
    events: string[];
    isActive: boolean;
  }>;
  rateLimits: Array<{
    endpoint: string;
    limit: number;
    window: number;
  }>;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  permissions: Permission[];
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  SUPPORT = 'SUPPORT',
  EDITOR = 'EDITOR'
}

export enum Permission {
  // Order Permissions
  VIEW_ORDERS = 'VIEW_ORDERS',
  MANAGE_ORDERS = 'MANAGE_ORDERS',
  PROCESS_REFUNDS = 'PROCESS_REFUNDS',
  
  // Product Permissions
  VIEW_PRODUCTS = 'VIEW_PRODUCTS',
  MANAGE_PRODUCTS = 'MANAGE_PRODUCTS',
  MANAGE_INVENTORY = 'MANAGE_INVENTORY',
  
  // Customer Permissions
  VIEW_CUSTOMERS = 'VIEW_CUSTOMERS',
  MANAGE_CUSTOMERS = 'MANAGE_CUSTOMERS',
  
  // Content Permissions
  MANAGE_CONTENT = 'MANAGE_CONTENT',
  PUBLISH_CONTENT = 'PUBLISH_CONTENT',
  
  // Analytics Permissions
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  EXPORT_REPORTS = 'EXPORT_REPORTS',
  
  // Settings Permissions
  MANAGE_SETTINGS = 'MANAGE_SETTINGS',
  MANAGE_USERS = 'MANAGE_USERS'
}

export interface AdminMenuItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  permissions: Permission[];
  children?: AdminMenuItem[];
}
