export interface SetupStep {
  id: string;
  title: string;
  path: string;
  description: string;
  component: string;
  validations?: string[];
}

export interface SetupState {
  currentStep: string;
  completedSteps: string[];
  storeSettings?: StoreSettings;
  adminSettings?: AdminSettings;
  databaseSettings?: DatabaseSettings;
  securitySettings?: SecuritySettings;
}

export interface StoreSettings {
  storeName: string;
  contactEmail: string;
  currency: string;
  timezone: string;
  country: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface AdminSettings {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  twoFactorEnabled: boolean;
}

export interface DatabaseSettings {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  connectionStatus: 'pending' | 'connected' | 'error';
  migrationStatus: 'pending' | 'completed' | 'error';
}

export interface SecuritySettings {
  sslEnabled: boolean;
  firewallEnabled: boolean;
  rateLimitEnabled: boolean;
  corsOrigins: string[];
  authType: 'jwt' | 'session';
  sessionSecret?: string;
  jwtSecret?: string;
}
