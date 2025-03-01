export interface IntegrationSettings {
  // Payment Integrations
  stripeEnabled: boolean;
  stripeApiKey: string;
  stripeWebhookSecret: string;
  
  // Currency Settings
  currency: 'GBP';
  currencySymbol: '£';
  
  // UK Shipping Providers
  royalMailEnabled: boolean;
  royalMailApiKey: string;
  royalMailAccountNumber: string;
  dpdEnabled: boolean;
  dpdApiKey: string;
  dpdAccountNumber: string;
  hermes: boolean;
  hermesApiKey: string;
  hermesAccountNumber: string;

  // WhatsApp Integration
  whatsappEnabled: boolean;
  whatsappApiKey: string;
  whatsappPhoneNumber: string;
  whatsappTemplateNamespace: string;

  // Email Service Providers
  mailchimpEnabled: boolean;
  mailchimpApiKey: string;
  mailchimpListId: string;
  sendgridEnabled: boolean;
  sendgridApiKey: string;

  // Analytics & Tracking
  googleAnalyticsEnabled: boolean;
  googleAnalyticsId: string;
  facebookPixelEnabled: boolean;
  facebookPixelId: string;
  hotjarEnabled: boolean;
  hotjarSiteId: string;

  // Social Media
  instagramEnabled: boolean;
  instagramAccessToken: string;
  facebookEnabled: boolean;
  facebookAccessToken: string;
  pinterestEnabled: boolean;
  pinterestAccessToken: string;

  // Reviews & Ratings
  judgeEnabled: boolean;
  judgeApiKey: string;
  trustpilotEnabled: boolean;
  trustpilotApiKey: string;

  // Tax Calculation
  vatEnabled: boolean;
  vatNumber: string;
  vatRate: number;
}
