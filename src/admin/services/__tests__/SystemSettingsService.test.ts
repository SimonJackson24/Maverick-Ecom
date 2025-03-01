import { SystemSettingsService } from '../SystemSettingsService';
import { apolloClient } from '../../../lib/apollo';
import { SystemSettings } from '../../types/settings';

// Mock Apollo Client
jest.mock('../../../lib/apollo', () => ({
  apolloClient: {
    query: jest.fn(),
    mutate: jest.fn(),
  },
}));

describe('SystemSettingsService', () => {
  const mockSettings: SystemSettings = {
    general: {
      siteName: 'Test Site',
      supportEmail: 'support@test.com',
      phoneNumber: '+1-555-123-4567',
      timezone: 'UTC',
      dateFormat: 'YYYY-MM-DD',
      currency: 'USD',
      language: 'en',
      defaultPageSize: 10,
      maintenanceMode: false,
      maintenanceMessage: '',
    },
    inventory: {
      lowStockThreshold: 5,
      enableAutoReorder: false,
      autoReorderThreshold: 3,
      defaultSupplier: 'Default Supplier',
      stockBufferPercentage: 10,
      enableBatchTracking: false,
      expiryNotificationDays: 30,
      allowBackorders: false,
      backorderLimit: 0,
    },
    notifications: {
      enableEmailNotifications: true,
      enableSmsNotifications: false,
      enablePushNotifications: false,
      lowStockAlerts: true,
      orderStatusUpdates: true,
      customerReviewAlerts: true,
      newsletterFrequency: 'weekly',
      emailTemplate: 'default',
      smsTemplate: 'default',
      notificationDelay: 0,
    },
    security: {
      requireTwoFactor: false,
      passwordExpiryDays: 90,
      sessionTimeoutMinutes: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      passwordRequireSpecialChar: true,
      passwordRequireNumber: true,
      passwordRequireUppercase: true,
      ipWhitelist: [],
      adminIpRestriction: false,
    },
    analytics: {
      enableGoogleAnalytics: true,
      googleAnalyticsId: 'UA-TEST-ID',
      enableHeatmaps: false,
      trackUserBehavior: true,
      anonymizeIp: true,
      enableEcommerce: true,
      trackingDomains: [],
      excludedPaths: [],
      customDimensions: [],
    },
    scents: {
      enableSeasonalRecommendations: true,
      enablePersonalization: true,
      defaultIntensityLevel: 'medium',
      maxScentCombinations: 3,
      enableAiRecommendations: true,
      minimumRatingThreshold: 3.5,
      seasonalTransitionDays: 14,
      popularityThreshold: 100,
      enableCrossSelling: true,
      maxRelatedScents: 5,
    },
    shipping: {
      enableInternationalShipping: true,
      defaultShippingMethod: 'standard',
      freeShippingThreshold: 50,
      restrictedCountries: [],
      handlingFee: 5,
      packagingOptions: [],
      insuranceThreshold: 100,
      calculateByWeight: true,
      weightUnit: 'lb',
    },
    tax: {
      enableAutomaticTax: true,
      defaultTaxRate: 0.1,
      taxByRegion: [],
      enableVAT: false,
      vatNumber: '',
      taxExemptCategories: [],
      digitalGoodsTax: false,
    },
    backup: {
      enableAutoBackup: true,
      backupFrequency: 'daily',
      backupRetentionDays: 30,
      includeMediaFiles: true,
      backupEncryption: true,
      storageProvider: 's3',
      compressionLevel: 3,
      notifyOnFailure: true,
      maxBackupSize: 1000,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSettings', () => {
    it('should fetch settings with network-only policy', async () => {
      (apolloClient.query as jest.Mock).mockResolvedValueOnce({
        data: { systemSettings: mockSettings },
      });

      const settings = await SystemSettingsService.getSettings();

      expect(apolloClient.query).toHaveBeenCalledWith({
        query: expect.any(Object),
        fetchPolicy: 'network-only',
      });
      expect(settings).toEqual(mockSettings);
    });

    it('should handle errors when fetching settings', async () => {
      const error = new Error('Network error');
      (apolloClient.query as jest.Mock).mockRejectedValueOnce(error);

      await expect(SystemSettingsService.getSettings()).rejects.toThrow(error);
    });
  });

  describe('updateSettings', () => {
    it('should update settings successfully', async () => {
      (apolloClient.mutate as jest.Mock).mockResolvedValueOnce({
        data: {
          updateSystemSettings: {
            success: true,
            message: 'Settings updated successfully',
          },
        },
      });

      await SystemSettingsService.updateSettings(mockSettings);

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.any(Object),
        variables: { settings: mockSettings },
      });
    });

    it('should handle validation errors', async () => {
      const validationError = {
        data: {
          updateSystemSettings: {
            success: false,
            message: 'Validation failed',
            validation: {
              'general.siteName': ['Site name is required'],
            },
          },
        },
      };

      (apolloClient.mutate as jest.Mock).mockResolvedValueOnce(validationError);

      await expect(SystemSettingsService.updateSettings(mockSettings)).rejects.toThrow();
    });
  });

  describe('resetSettings', () => {
    it('should reset settings to defaults', async () => {
      (apolloClient.mutate as jest.Mock).mockResolvedValueOnce({
        data: {
          resetSystemSettings: {
            success: true,
            message: 'Settings reset to defaults',
          },
        },
      });

      await SystemSettingsService.resetSettings();

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.any(Object),
      });
    });
  });

  describe('exportSettings', () => {
    it('should return export URL', async () => {
      const exportUrl = 'https://example.com/export.json';
      (apolloClient.mutate as jest.Mock).mockResolvedValueOnce({
        data: {
          exportSystemSettings: {
            url: exportUrl,
            expiresAt: '2025-02-13T00:00:00Z',
          },
        },
      });

      const result = await SystemSettingsService.exportSettings();

      expect(result).toBe(exportUrl);
      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.any(Object),
      });
    });
  });

  describe('importSettings', () => {
    it('should import settings from file', async () => {
      const file = new File(['{}'], 'settings.json', { type: 'application/json' });
      (apolloClient.mutate as jest.Mock).mockResolvedValueOnce({
        data: {
          importSystemSettings: {
            success: true,
            message: 'Settings imported successfully',
          },
        },
      });

      await SystemSettingsService.importSettings(file);

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.any(Object),
        variables: { file },
      });
    });

    it('should handle invalid import file', async () => {
      const file = new File(['invalid'], 'settings.txt', { type: 'text/plain' });
      const error = new Error('Invalid file format');
      (apolloClient.mutate as jest.Mock).mockRejectedValueOnce(error);

      await expect(SystemSettingsService.importSettings(file)).rejects.toThrow();
    });
  });
});
