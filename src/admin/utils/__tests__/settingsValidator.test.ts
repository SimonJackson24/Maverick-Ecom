import { SettingsValidator } from '../settingsValidator';
import { SystemSettings } from '../../types/settings';

describe('SettingsValidator', () => {
  describe('validate', () => {
    it('should validate required fields', () => {
      const errors = SettingsValidator.validate('general.siteName', '');
      expect(errors).toContain('Site name is required');
    });

    it('should validate email format', () => {
      const errors = SettingsValidator.validate('general.supportEmail', 'invalid-email');
      expect(errors).toContain('Invalid email format');

      const validErrors = SettingsValidator.validate('general.supportEmail', 'valid@email.com');
      expect(validErrors).toHaveLength(0);
    });

    it('should validate phone numbers', () => {
      const errors = SettingsValidator.validate('general.phoneNumber', 'abc');
      expect(errors).toContain('Invalid phone number format');

      const validErrors = SettingsValidator.validate('general.phoneNumber', '+1-555-123-4567');
      expect(validErrors).toHaveLength(0);
    });

    it('should validate number ranges', () => {
      const errors = SettingsValidator.validate('inventory.lowStockThreshold', 0);
      expect(errors).toContain('Must be a positive number');

      const validErrors = SettingsValidator.validate('inventory.lowStockThreshold', 5);
      expect(validErrors).toHaveLength(0);
    });

    it('should validate custom rules', () => {
      const errors = SettingsValidator.validate('general.siteName', 'a');
      expect(errors).toContain('Site name must be between 2 and 50 characters');

      const validErrors = SettingsValidator.validate('general.siteName', 'Valid Site Name');
      expect(validErrors).toHaveLength(0);
    });
  });

  describe('validateAll', () => {
    const sampleSettings: Partial<SystemSettings> = {
      general: {
        siteName: '',
        supportEmail: 'invalid-email',
        phoneNumber: 'abc',
        timezone: 'UTC',
        dateFormat: 'YYYY-MM-DD',
        currency: 'USD',
        language: 'en',
        defaultPageSize: 10,
        maintenanceMode: false,
        maintenanceMessage: '',
      },
      inventory: {
        lowStockThreshold: 0,
        enableAutoReorder: false,
        autoReorderThreshold: 5,
        defaultSupplier: '',
        stockBufferPercentage: 10,
        enableBatchTracking: false,
        expiryNotificationDays: 30,
        allowBackorders: false,
        backorderLimit: 0,
      },
    };

    it('should validate all settings recursively', () => {
      const errors = SettingsValidator.validateAll(sampleSettings);
      
      expect(Object.keys(errors)).toContain('general.siteName');
      expect(Object.keys(errors)).toContain('general.supportEmail');
      expect(Object.keys(errors)).toContain('general.phoneNumber');
      expect(Object.keys(errors)).toContain('inventory.lowStockThreshold');
    });

    it('should return empty object for valid settings', () => {
      const validSettings: Partial<SystemSettings> = {
        general: {
          siteName: 'Valid Site Name',
          supportEmail: 'valid@email.com',
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
          autoReorderThreshold: 5,
          defaultSupplier: 'Default Supplier',
          stockBufferPercentage: 10,
          enableBatchTracking: false,
          expiryNotificationDays: 30,
          allowBackorders: false,
          backorderLimit: 0,
        },
      };

      const errors = SettingsValidator.validateAll(validSettings);
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });

  describe('getErrorsForSection', () => {
    const errors = {
      'general.siteName': ['Site name is required'],
      'general.supportEmail': ['Invalid email format'],
      'inventory.lowStockThreshold': ['Must be a positive number'],
    };

    it('should return errors for specific section', () => {
      const generalErrors = SettingsValidator.getErrorsForSection(errors, 'general');
      expect(Object.keys(generalErrors)).toHaveLength(2);
      expect(Object.keys(generalErrors)).toContain('general.siteName');
      expect(Object.keys(generalErrors)).toContain('general.supportEmail');

      const inventoryErrors = SettingsValidator.getErrorsForSection(errors, 'inventory');
      expect(Object.keys(inventoryErrors)).toHaveLength(1);
      expect(Object.keys(inventoryErrors)).toContain('inventory.lowStockThreshold');
    });

    it('should return empty object for section with no errors', () => {
      const securityErrors = SettingsValidator.getErrorsForSection(errors, 'security');
      expect(Object.keys(securityErrors)).toHaveLength(0);
    });
  });
});
