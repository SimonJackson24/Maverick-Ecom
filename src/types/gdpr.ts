export interface GDPRConfig {
  retentionPeriods: {
    userAccounts: number; // days
    orderHistory: number;
    activityLogs: number;
    marketingData: number;
  };
  dataProtection: {
    encryptionEnabled: boolean;
    dataBackupEnabled: boolean;
    backupFrequency: number; // days
    backupRetention: number; // days
  };
  cookies: {
    consentRequired: boolean;
    consentValidityPeriod: number; // days
    defaultPreferences: {
      necessary: boolean;
      analytics: boolean;
      marketing: boolean;
      preferences: boolean;
    };
  };
  privacyNotices: {
    privacyPolicyLastUpdated: string;
    cookiePolicyLastUpdated: string;
    termsLastUpdated: string;
  };
  thirdPartyProcessors: Array<{
    id: string;
    name: string;
    purpose: string;
    enabled: boolean;
    dataShared: string[];
  }>;
  dpo: {
    name: string;
    email: string;
    phone: string;
  };
  breach: {
    notificationEmail: string;
    notificationPhone: string;
    escalationThreshold: 'low' | 'medium' | 'high';
  };
}
