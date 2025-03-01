export interface GeneralSettings {
  siteName: string;
  supportEmail: string;
  phoneNumber: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  language: string;
  defaultPageSize: number;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  logoUrl: string;
  faviconUrl: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    pinterest?: string;
  };
  footerText: string;
  copyrightText: string;
  siteUrl: string;
  adminEmail: string;
  companyDetails: {
    name: string;
    address: string;
    registrationNumber: string;
    vatNumber: string;
  };
  errorPages: {
    404: string;
    500: string;
    maintenance: string;
  };
}

export interface ProductSettings {
  defaultImagePlaceholder: string;
  enableProductReviews: boolean;
  reviewModeration: boolean;
  minimumReviewLength: number;
  maximumReviewLength: number;
  allowAnonymousReviews: boolean;
  showOutOfStockProducts: boolean;
  outOfStockLabel: string;
  enableWishlist: boolean;
  maxWishlistsPerUser: number;
  enableProductComparison: boolean;
  maxCompareProducts: number;
  productImageSizes: {
    thumbnail: { width: number; height: number };
    small: { width: number; height: number };
    medium: { width: number; height: number };
    large: { width: number; height: number };
  };
  enableBulkOperations: boolean;
  bulkOperationLimit: number;
}

export interface InventorySettings {
  lowStockThreshold: number;
  enableAutoReorder: boolean;
  autoReorderThreshold: number;
  defaultSupplier: string;
  stockBufferPercentage: number;
  enableBatchTracking: boolean;
  expiryNotificationDays: number;
  allowBackorders: boolean;
  backorderLimit: number;
  enableInventoryHistory: boolean;
  inventoryHistoryRetentionDays: number;
  enableLocationTracking: boolean;
  defaultWarehouse: string;
  enableSupplierIntegration: boolean;
  supplierApiEndpoints: Record<string, string>;
  reservations: {
    enabled: boolean;
    duration: number;
    allowPartial: boolean;
    releaseStrategy: 'immediate' | 'scheduled';
    notifyLowStock: boolean;
  };
  suppliers: {
    multipleSuppliers: boolean;
    autoReorderRules: {
      enabled: boolean;
      threshold: number;
      quantity: number;
      preferredSupplier: string;
    };
    leadTimes: Record<string, number>;
  };
}

export interface CartSettings {
  minimumOrderAmount: number;
  maximumOrderAmount: number;
  cartExpiryHours: number;
  enableCartMerging: boolean;
  enableSavedCarts: boolean;
  maxSavedCarts: number;
  enableGuestCart: boolean;
  guestCartExpiryHours: number;
  enableCartNotes: boolean;
  maxCartItems: number;
  enableUpsells: boolean;
  maxUpsellItems: number;
  abandonedCartThresholdHours: number;
  enableAbandonedCartRecovery: boolean;
}

export interface CheckoutSettings {
  enableGuestCheckout: boolean;
  requirePhoneNumber: boolean;
  enableAddressValidation: boolean;
  addressValidationProvider: string;
  enableMultipleAddresses: boolean;
  maxShippingAddresses: number;
  maxBillingAddresses: number;
  enableOrderNotes: boolean;
  enableGiftMessages: boolean;
  requireTermsAcceptance: boolean;
  termsAndConditionsUrl: string;
  enableOrderTracking: boolean;
  orderTrackingProvider: string;
  minimumPasswordStrength: number;
}

export interface PaymentSettings {
  enabledPaymentMethods: string[];
  stripePublicKey: string;
  stripeSecretKey: string;
  paypalClientId: string;
  paypalSecretKey: string;
  enableTestMode: boolean;
  testCardNumbers: string[];
  enablePartialPayments: boolean;
  enableRefunds: boolean;
  autoRefundThresholdDays: number;
  refundProcessingFee: number;
  enablePaymentPlans: boolean;
  defaultCurrency: string;
  supportedCurrencies: string[];
  fraudPrevention: {
    enabled: boolean;
    riskScoring: boolean;
    maxRiskScore: number;
    blockHighRisk: boolean;
    requireVerification: boolean;
    suspiciousPatterns: string[];
  };
  subscriptions: {
    enabled: boolean;
    trialDays: number;
    gracePeriod: number;
    allowPause: boolean;
    maxPauseDuration: number;
    cancelationTerms: string;
  };
}

export interface NotificationSettings {
  enableEmailNotifications: boolean;
  enableSmsNotifications: boolean;
  enablePushNotifications: boolean;
  lowStockAlerts: boolean;
  orderStatusUpdates: boolean;
  customerReviewAlerts: boolean;
  newsletterFrequency: 'daily' | 'weekly' | 'monthly';
  emailTemplate: string;
  smsTemplate: string;
  notificationDelay: number;
  emailProvider: string;
  emailFromAddress: string;
  emailFromName: string;
  smsProvider: string;
  smsFromNumber: string;
  pushNotificationProvider: string;
  enableNotificationHistory: boolean;
  notificationRetentionDays: number;
  enableNotificationPreferences: boolean;
  defaultNotificationPreferences: Record<string, boolean>;
}

export interface SecuritySettings {
  requireTwoFactor: boolean;
  passwordExpiryDays: number;
  sessionTimeoutMinutes: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  passwordRequireSpecialChar: boolean;
  passwordRequireNumber: boolean;
  passwordRequireUppercase: boolean;
  ipWhitelist: string[];
  adminIpRestriction: boolean;
  enableSecurityLog: boolean;
  securityLogRetentionDays: number;
  enableDeviceTracking: boolean;
  maxDevicesPerUser: number;
  enableLoginNotifications: boolean;
  enableSuspiciousActivityDetection: boolean;
  suspiciousActivityThreshold: number;
  enableAccountRecovery: boolean;
  accountRecoveryMethod: 'email' | 'phone' | 'both';
  recoveryCodeExpiryMinutes: number;
  bruteForceProtection: {
    enabled: boolean;
    maxAttempts: number;
    blockDuration: number;
    notifyAdmin: boolean;
  };
  passwordPolicy: {
    minLength: number;
    requireSpecialChar: boolean;
    requireNumber: boolean;
    requireUppercase: boolean;
    preventPasswordReuse: number;
    expiryDays: number;
  };
  mfaSettings: {
    required: boolean;
    allowedMethods: ('authenticator' | 'sms' | 'email')[];
    backupCodes: boolean;
    graceLoginCount: number;
  };
}

export interface AnalyticsSettings {
  enableGoogleAnalytics: boolean;
  googleAnalyticsId: string;
  enableHeatmaps: boolean;
  trackUserBehavior: boolean;
  anonymizeIp: boolean;
  enableEcommerce: boolean;
  trackingDomains: string[];
  excludedPaths: string[];
  customDimensions: Array<{
    name: string;
    value: string;
  }>;
  enableConversionTracking: boolean;
  conversionGoals: Array<{
    name: string;
    value: number;
    type: string;
  }>;
  enableABTesting: boolean;
  maxConcurrentTests: number;
  testingCookieLifetime: number;
  enableCustomEvents: boolean;
  customEventCategories: string[];
  dataRetention: {
    enabled: boolean;
    userDataDays: number;
    analyticsDataDays: number;
    anonymizeData: boolean;
  };
  reporting: {
    scheduledReports: boolean;
    recipients: string[];
    frequency: 'daily' | 'weekly' | 'monthly';
    formats: ('pdf' | 'csv' | 'excel')[];
  };
}

export interface ScentSettings {
  enableSeasonalRecommendations: boolean;
  enablePersonalization: boolean;
  defaultIntensityLevel: 'low' | 'medium' | 'high';
  maxScentCombinations: number;
  enableAiRecommendations: boolean;
  minimumRatingThreshold: number;
  seasonalTransitionDays: number;
  popularityThreshold: number;
  enableCrossSelling: boolean;
  maxRelatedScents: number;
  enableScentProfiles: boolean;
  maxProfilesPerUser: number;
  enableScentHistory: boolean;
  scentHistoryRetentionDays: number;
  enableScentPreferences: boolean;
  defaultScentCategories: string[];
  enableScentStrengthControl: boolean;
  strengthLevels: string[];
  enableScentBlending: boolean;
  maxBlendComponents: number;
}

export interface ShippingSettings {
  enableInternationalShipping: boolean;
  defaultShippingMethod: string;
  freeShippingThreshold: number;
  restrictedCountries: string[];
  handlingFee: number;
  packagingOptions: Array<{
    name: string;
    price: number;
  }>;
  insuranceThreshold: number;
  calculateByWeight: boolean;
  weightUnit: 'kg' | 'lb';
  dimensionUnit: 'cm' | 'inch';
  shippingZones: Array<{
    name: string;
    countries: string[];
    rates: Array<{
      method: string;
      price: number;
    }>;
  }>;
  enableLocalPickup: boolean;
  localPickupLocations: Array<{
    name: string;
    address: string;
    hours: string;
  }>;
  enableShippingEstimates: boolean;
  estimateProvider: string;
}

export interface TaxSettings {
  enableAutomaticTax: boolean;
  defaultTaxRate: number;
  taxByRegion: Array<{
    region: string;
    rate: number;
  }>;
  enableVAT: boolean;
  vatNumber: string;
  taxExemptCategories: string[];
  digitalGoodsTax: boolean;
  taxProvider: string;
  taxCalculationMethod: 'inclusive' | 'exclusive';
  enableTaxExemptions: boolean;
  exemptionValidationRequired: boolean;
  enableAutomaticTaxFiling: boolean;
  taxFilingFrequency: 'monthly' | 'quarterly' | 'annually';
}

export interface CustomerSettings {
  enableCustomerAccounts: boolean;
  requireEmailVerification: boolean;
  enableSocialLogin: boolean;
  enabledSocialProviders: string[];
  customerGroupsEnabled: boolean;
  defaultCustomerGroup: string;
  enableCustomerRewards: boolean;
  rewardPointsRatio: number;
  minimumRedeemPoints: number;
  enableCustomerNotes: boolean;
  enableCustomerTags: boolean;
  maxCustomerTags: number;
  enableCustomerSegmentation: boolean;
  segmentationRules: Array<{
    name: string;
    conditions: any[];
  }>;
}

export interface ContentSettings {
  enableBlog: boolean;
  postsPerPage: number;
  enableComments: boolean;
  requireCommentApproval: boolean;
  enableFeaturedImages: boolean;
  imageSizes: {
    thumbnail: { width: number; height: number };
    featured: { width: number; height: number };
  };
  enableCategories: boolean;
  enableTags: boolean;
  maxTagsPerPost: number;
  enableSocialSharing: boolean;
  enableNewsletterIntegration: boolean;
  enableSEO: boolean;
  defaultMetaDescription: string;
  defaultOgImage: string;
}

export interface BackupSettings {
  enableAutoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  backupRetentionDays: number;
  includeMediaFiles: boolean;
  backupEncryption: boolean;
  storageProvider: 's3' | 'local' | 'google';
  compressionLevel: 1 | 2 | 3 | 4 | 5;
  notifyOnFailure: boolean;
  maxBackupSize: number;
  backupSchedule: string;
  excludedTables: string[];
  backupNameTemplate: string;
  enableVersioning: boolean;
  maxVersions: number;
  monitoring: {
    enabled: boolean;
    healthCheck: boolean;
    alertOnFailure: boolean;
    maxConsecutiveFailures: number;
    autoRetry: boolean;
    maxRetries: number;
  };
  pruning: {
    enabled: boolean;
    strategy: 'size' | 'age' | 'count';
    maxTotalSize: number;
    minBackupsToKeep: number;
    deleteIncomplete: boolean;
  };
}

export interface EmailSettings {
  templateSettings: {
    defaultTemplate: string;
    customTemplates: boolean;
    enableDynamicContent: boolean;
    previewBeforeSend: boolean;
  };
  campaignSettings: {
    enableCampaigns: boolean;
    maxCampaignsPerMonth: number;
    requireDoubleOptIn: boolean;
    unsubscribeMethod: 'one-click' | 'confirmation';
  };
  analyticsSettings: {
    trackOpens: boolean;
    trackClicks: boolean;
    enableHeatmap: boolean;
    retentionDays: number;
  };
  deliverySettings: {
    maxRecipientsPerHour: number;
    retryAttempts: number;
    retryDelay: number;
    blacklistDomains: string[];
  };
  spamProtection: {
    enabled: boolean;
    spamScore: number;
    blockHighRiskEmails: boolean;
    allowlist: string[];
    blocklist: string[];
  };
  throttling: {
    enabled: boolean;
    maxPerMinute: number;
    maxPerHour: number;
    maxPerDay: number;
    cooldownMinutes: number;
  };
}

export interface SubscriptionSettings {
  enableSubscriptions: boolean;
  subscriptionPlans: Array<{
    id: string;
    name: string;
    interval: 'weekly' | 'monthly' | 'quarterly';
    price: number;
  }>;
  trialPeriodDays: number;
  enablePauseResume: boolean;
  maxPauseDuration: number;
  enableEarlyDelivery: boolean;
  enableSkipDelivery: boolean;
  maxSkipsPerYear: number;
  cancellationPolicy: {
    requireReason: boolean;
    offerDiscount: boolean;
    discountPercentage: number;
    gracePeriodDays: number;
  };
}

export interface LoyaltySettings {
  enableLoyaltyProgram: boolean;
  pointsName: string;
  pointsPerDollar: number;
  minimumPointsToRedeem: number;
  pointsExpiryMonths: number;
  tiers: Array<{
    name: string;
    requiredPoints: number;
    benefits: string[];
    multiplier: number;
  }>;
  specialEvents: {
    enableBirthday: boolean;
    birthdayPoints: number;
    enableAnniversary: boolean;
    anniversaryPoints: number;
  };
  referralProgram: {
    enabled: boolean;
    referrerPoints: number;
    refereeDiscount: number;
    maxReferralsPerMonth: number;
  };
}

export interface SupportSettings {
  enableLiveChat: boolean;
  chatProvider: string;
  chatSettings: {
    operatingHours: {
      start: string;
      end: string;
      timezone: string;
    };
    offlineMessage: string;
    initialResponseTime: number;
  };
  ticketSystem: {
    enabled: boolean;
    categories: string[];
    priorityLevels: string[];
    autoAssignment: boolean;
    slaTimeouts: Record<string, number>;
  };
  knowledgeBase: {
    enabled: boolean;
    categoriesEnabled: boolean;
    searchEnabled: boolean;
    feedbackEnabled: boolean;
    articlesPerPage: number;
  };
  faq: {
    enabled: boolean;
    categoriesEnabled: boolean;
    displayOrder: 'manual' | 'popularity' | 'alphabetical';
    showPopular: boolean;
  };
  escalation: {
    enabled: boolean;
    rules: Array<{
      condition: string;
      action: string;
      priority: number;
      notifyUsers: string[];
    }>;
    autoEscalateAfter: number;
    maxEscalationLevel: number;
  };
  satisfaction: {
    enabled: boolean;
    surveyTrigger: 'afterChat' | 'afterResolution' | 'manual';
    questions: string[];
    followUpEnabled: boolean;
    followUpDelay: number;
  };
}

export interface SearchSettings {
  engine: 'elasticsearch' | 'algolia' | 'custom';
  enableInstantSearch: boolean;
  minCharacters: number;
  maxResults: number;
  enableSpellcheck: boolean;
  enableAutocomplete: boolean;
  enableVoiceSearch: boolean;
  searchableAttributes: string[];
  customRanking: Array<{
    attribute: string;
    order: 'asc' | 'desc';
  }>;
  facets: Array<{
    attribute: string;
    type: 'list' | 'range' | 'hierarchical';
    label: string;
  }>;
  scentFiltering: {
    enabled: boolean;
    attributes: string[];
    combinations: boolean;
    maxCombinations: number;
  };
  analytics: {
    trackSearches: boolean;
    trackNoResults: boolean;
    trackFilterUsage: boolean;
    popularTermsCount: number;
  };
}

export interface PerformanceSettings {
  caching: {
    enabled: boolean;
    provider: 'redis' | 'memcached' | 'custom';
    ttl: number;
    prefetch: boolean;
  };
  images: {
    optimization: boolean;
    quality: number;
    maxWidth: number;
    maxHeight: number;
    formats: ('jpeg' | 'webp' | 'avif')[];
    lazyLoading: boolean;
  };
  cdn: {
    enabled: boolean;
    provider: string;
    domains: string[];
  };
  api: {
    rateLimit: number;
    timeout: number;
    cacheControl: string;
  };
}

export interface WhatsAppSettings {
  enabled: boolean;
  apiUrl: string;
  accessToken: string;
  businessPhoneNumber: string;
  businessName: string;
  welcomeMessage: string;
  
  // Support Group Settings
  supportGroup: {
    groupId: string;
    notifyNewCustomer: boolean;
    maxAgents: number;
    messageCleanupDelay: number;
  };

  // Webhook Configuration
  webhook: {
    enabled: boolean;
    verifyToken: string;
    notificationUrl: string;
  };

  // Message Templates
  templates: {
    welcome: string;
    agentResponse: string;
    outOfHours: string;
    sessionEnd: string;
    error: string;
  };

  // Chat Widget Settings
  widget: {
    enabled: boolean;
    position: 'bottom-right' | 'bottom-left';
    theme: {
      primaryColor: string;
      textColor: string;
      backgroundColor: string;
    };
    initialMessage: string;
    placeholder: string;
    requireName: boolean;
  };

  // Operating Hours
  operatingHours: {
    enabled: boolean;
    timezone: string;
    schedule: Array<{
      day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
      start: string;
      end: string;
    }>;
  };

  // Auto Response
  autoResponse: {
    enabled: boolean;
    outOfHoursMessage: string;
    queueMessage: string;
    maxQueueSize: number;
  };

  // Analytics
  analytics: {
    enabled: boolean;
    trackMetrics: {
      responseTime: boolean;
      resolutionRate: boolean;
      customerSatisfaction: boolean;
      agentPerformance: boolean;
    };
    retentionDays: number;
  };

  // Rate Limiting
  rateLimit: {
    enabled: boolean;
    maxMessagesPerMinute: number;
    maxSessionsPerDay: number;
  };

  // Security
  security: {
    encryptMessages: boolean;
    allowedCountryCodes: string[];
    blockWords: string[];
    maxFileSize: number;
    allowedFileTypes: string[];
  };
}

export interface PaymentProviderConfig {
  id: string;
  name: string;
  isEnabled: boolean;
  apiKeys: {
    test: string;
    live: string;
  };
  supportedMethods: string[];
}

export interface CurrencyConfig {
  code: string;
  rate: number;
  isDefault: boolean;
}

export interface ShippingMethodConfig {
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
}

export interface ShippingZoneConfig {
  id: string;
  name: string;
  countries: string[];
  methods: string[];
}

export interface ShippingRestrictions {
  minOrderValue: number;
  maxWeight: number;
  restrictedItems: string[];
}

export interface SecurityEventConfig {
  retention: {
    enabled: boolean;
    days: number;
  };
  monitoring: {
    enableRealTimeAlerts: boolean;
    suspiciousActivityThreshold: number;
    notifyAdmins: boolean;
  };
  ipBlocking: {
    enabled: boolean;
    maxFailedAttempts: number;
    blockDuration: number;
    whitelist: string[];
    blacklist: string[];
  };
  deviceTracking: {
    enabled: boolean;
    trustNewDevices: boolean;
    requireVerification: boolean;
    maxDevicesPerUser: number;
  };
  backupCodes: {
    enabled: boolean;
    count: number;
    length: number;
  };
  sessionManagement: {
    maxConcurrentSessions: number;
    forceLogoutOnPasswordChange: boolean;
    rememberMeDuration: number;
  };
  exportSettings: {
    enabled: boolean;
    includeIpAddresses: boolean;
    includeUserAgents: boolean;
    maxExportSize: number;
  };
}

export interface BackupSettings {
  enabled: boolean;
  schedule: {
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
    time: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
  };
  storage: {
    provider: 'local' | 's3' | 'google';
    path: string;
    credentials?: {
      accessKey?: string;
      secretKey?: string;
      bucket?: string;
      region?: string;
    };
  };
  retention: {
    keepDays: number;
    maxSize: number;
    minBackups: number;
  };
  notification: {
    onSuccess: boolean;
    onFailure: boolean;
    emails: string[];
  };
  encryption: {
    enabled: boolean;
    algorithm: string;
    keyRotation: boolean;
    keyRotationDays: number;
  };
  compression: {
    enabled: boolean;
    level: number;
  };
  validation: {
    validateAfterBackup: boolean;
    validateBeforeRestore: boolean;
  };
}

export interface SystemSettings {
  general: GeneralSettings;
  products: ProductSettings;
  inventory: InventorySettings;
  cart: CartSettings;
  checkout: CheckoutSettings;
  payment: PaymentSettings & {
    providers: PaymentProviderConfig[];
    currencies: CurrencyConfig[];
  };
  notifications: NotificationSettings;
  security: SecuritySettings & SecurityEventConfig;
  analytics: AnalyticsSettings;
  scents: ScentSettings;
  shipping: ShippingSettings & {
    methods: ShippingMethodConfig[];
    zones: ShippingZoneConfig[];
    restrictions: ShippingRestrictions;
  };
  tax: TaxSettings;
  customers: CustomerSettings;
  content: ContentSettings;
  backup: BackupSettings;
  email: EmailSettings;
  subscription: SubscriptionSettings;
  loyalty: LoyaltySettings;
  support: SupportSettings;
  search: SearchSettings;
  performance: PerformanceSettings;
  whatsapp: WhatsAppSettings;
}

export interface ValidationRule {
  field: string;
  type: 'required' | 'email' | 'phone' | 'number' | 'url' | 'custom';
  message: string;
  min?: number;
  max?: number;
  pattern?: string;
  customValidator?: (value: any) => boolean;
}

export interface SettingsValidation {
  [key: string]: ValidationRule[];
}

export const SETTINGS_VALIDATION: SettingsValidation = {
  'general.siteName': [
    { field: 'siteName', type: 'required', message: 'Site name is required' },
    { field: 'siteName', type: 'custom', message: 'Site name must be between 2 and 50 characters', min: 2, max: 50 },
  ],
  'general.supportEmail': [
    { field: 'supportEmail', type: 'required', message: 'Support email is required' },
    { field: 'supportEmail', type: 'email', message: 'Invalid email format' },
  ],
  'general.phoneNumber': [
    { field: 'phoneNumber', type: 'phone', message: 'Invalid phone number format' },
  ],
  'inventory.lowStockThreshold': [
    { field: 'lowStockThreshold', type: 'number', message: 'Must be a positive number', min: 1 },
  ],
  'security.passwordMinLength': [
    { field: 'passwordMinLength', type: 'number', message: 'Must be between 8 and 32', min: 8, max: 32 },
  ],
  'scents.minimumRatingThreshold': [
    { field: 'minimumRatingThreshold', type: 'number', message: 'Must be between 1 and 5', min: 1, max: 5 },
  ],
};

export interface SystemSettingsResponse {
  success: boolean;
  message: string;
  validation?: {
    [key: string]: string[];
  };
}

export interface ExportSettingsResponse {
  url: string;
  expiresAt: string;
  format: 'json' | 'yaml';
  encryptionKey?: string;
}

export interface BackupMetadata {
  id: string;
  timestamp: string;
  size: number;
  type: 'auto' | 'manual';
  status: 'success' | 'failed' | 'in_progress';
  contents: string[];
}

export interface RestoreResponse {
  success: boolean;
  message: string;
  restoredSettings: string[];
  skippedSettings: string[];
  errors?: string[];
}
