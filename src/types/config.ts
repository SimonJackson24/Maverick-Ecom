export interface AppConfig {
  env: Environment;
  version: string;
  api: ApiConfig;
  auth: AuthConfig;
  cache: CacheConfig;
  database: DatabaseConfig;
  monitoring: MonitoringConfig;
  email: EmailConfig;
  storage: StorageConfig;
  payment: PaymentConfig;
  features: FeatureFlags;
  seo: SeoConfig;
  i18n: I18nConfig;
  security: SecurityConfig;
}

export type Environment = 'development' | 'staging' | 'production';

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  rateLimits: {
    windowMs: number;
    maxRequests: number;
  };
  cors: {
    origin: string[];
    methods: string[];
    allowedHeaders: string[];
    exposedHeaders: string[];
    credentials: boolean;
    maxAge: number;
  };
}

export interface AuthConfig {
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  session: {
    name: string;
    secret: string;
    maxAge: number;
    secure: boolean;
    sameSite: boolean | 'lax' | 'strict' | 'none';
  };
  passwordPolicy: {
    minLength: number;
    requireNumbers: boolean;
    requireSymbols: boolean;
    requireUppercase: boolean;
    requireLowercase: boolean;
  };
}

export interface CacheConfig {
  driver: 'redis' | 'memcached' | 'memory';
  prefix: string;
  ttl: number;
  redis?: {
    host: string;
    port: number;
    password?: string;
    db: number;
  };
  memcached?: {
    servers: string[];
  };
}

export interface DatabaseConfig {
  client: 'postgresql';
  connection: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    ssl: boolean;
  };
  pool: {
    min: number;
    max: number;
  };
  migrations: {
    directory: string;
    tableName: string;
  };
  seeds: {
    directory: string;
  };
}

export interface MonitoringConfig {
  enabled: boolean;
  level: 'debug' | 'info' | 'warn' | 'error';
  sentry?: {
    dsn: string;
    environment: string;
    tracesSampleRate: number;
  };
  datadog?: {
    apiKey: string;
    appKey: string;
    service: string;
  };
  metrics: {
    enabled: boolean;
    interval: number;
    prefix: string;
  };
  profiler: {
    enabled: boolean;
    sampleRate: number;
  };
}

export interface EmailConfig {
  driver: 'smtp' | 'sendgrid' | 'ses';
  from: {
    name: string;
    address: string;
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
  ses?: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  };
  templates: {
    [key: string]: {
      subject: string;
      template: string;
    };
  };
}

export interface StorageConfig {
  driver: 's3' | 'gcs' | 'local';
  public: {
    bucket: string;
    region?: string;
    baseUrl: string;
  };
  private: {
    bucket: string;
    region?: string;
  };
  local?: {
    directory: string;
  };
  s3?: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  };
  gcs?: {
    projectId: string;
    keyFilename: string;
  };
}

export interface PaymentConfig {
  driver: 'stripe' | 'paypal';
  test: boolean;
  stripe?: {
    secretKey: string;
    publicKey: string;
    webhookSecret: string;
  };
  paypal?: {
    clientId: string;
    clientSecret: string;
    mode: 'sandbox' | 'live';
  };
  currencies: string[];
  minimumAmount: number;
  maximumAmount: number;
}

export interface FeatureFlags {
  auth: {
    emailVerification: boolean;
    twoFactorAuth: boolean;
    socialLogin: boolean;
    passwordlessLogin: boolean;
  };
  products: {
    reviews: boolean;
    ratings: boolean;
    recommendations: boolean;
    inventory: boolean;
  };
  orders: {
    guestCheckout: boolean;
    multipleAddresses: boolean;
    tracking: boolean;
    returns: boolean;
  };
  users: {
    wishlists: boolean;
    addresses: boolean;
    preferences: boolean;
    history: boolean;
  };
  marketing: {
    newsletter: boolean;
    coupons: boolean;
    rewards: boolean;
    referrals: boolean;
  };
}

export interface SeoConfig {
  siteName: string;
  titleTemplate: string;
  defaultDescription: string;
  defaultImage: string;
  baseUrl: string;
  robotsTxt: string;
  sitemapXml: string;
  structuredData: {
    organization: Record<string, any>;
    website: Record<string, any>;
  };
}

export interface I18nConfig {
  defaultLocale: string;
  supportedLocales: string[];
  fallbackLocale: string;
  loadPath: string;
  debug: boolean;
}

export interface SecurityConfig {
  csrf: {
    enabled: boolean;
    secret: string;
    cookie: {
      key: string;
      options: Record<string, any>;
    };
  };
  helmet: {
    contentSecurityPolicy: boolean;
    dnsPrefetchControl: boolean;
    expectCt: boolean;
    frameguard: boolean;
    hidePoweredBy: boolean;
    hsts: boolean;
    ieNoOpen: boolean;
    noSniff: boolean;
    permittedCrossDomainPolicies: boolean;
    referrerPolicy: boolean;
    xssFilter: boolean;
  };
  rateLimit: {
    enabled: boolean;
    windowMs: number;
    max: number;
  };
}
