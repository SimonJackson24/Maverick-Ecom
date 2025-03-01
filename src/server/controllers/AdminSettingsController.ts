import { Request, Response } from 'express';
import AdminSettings from '../models/AdminSettings';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';

export class AdminSettingsController {
  // Get all settings
  static async getSettings(req: Request, res: Response) {
    try {
      const settings = await AdminSettings.findOne();
      if (!settings) {
        return res.status(404).json({
          status: 'error',
          message: 'Settings not found'
        });
      }

      res.json({
        status: 'success',
        data: settings
      });
    } catch (error) {
      logger.error('Error fetching admin settings:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch admin settings'
      });
    }
  }

  // Update settings
  static async updateSettings(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      const updates = {
        ...req.body,
        updatedBy: userId,
        lastUpdated: new Date()
      };

      const settings = await AdminSettings.findOneAndUpdate(
        {},
        { $set: updates },
        { 
          new: true,
          upsert: true,
          runValidators: true
        }
      );

      // Log the change
      logger.info('Admin settings updated', {
        userId,
        changes: Object.keys(req.body)
      });

      res.json({
        status: 'success',
        data: settings
      });
    } catch (error) {
      logger.error('Error updating admin settings:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update admin settings'
      });
    }
  }

  // Update specific section
  static async updateSection(req: Request, res: Response) {
    try {
      const { section } = req.params;
      const userId = req.user?._id;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      const update = {
        [`${section}`]: req.body,
        updatedBy: userId,
        lastUpdated: new Date()
      };

      const settings = await AdminSettings.findOneAndUpdate(
        {},
        { $set: update },
        { 
          new: true,
          upsert: true,
          runValidators: true
        }
      );

      logger.info(`Admin settings section '${section}' updated`, {
        userId,
        section
      });

      res.json({
        status: 'success',
        data: settings
      });
    } catch (error) {
      logger.error('Error updating admin settings section:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update admin settings section'
      });
    }
  }

  // Get settings history
  static async getSettingsHistory(req: Request, res: Response) {
    try {
      const settings = await AdminSettings.findOne();
      if (!settings) {
        return res.status(404).json({
          status: 'error',
          message: 'Settings not found'
        });
      }

      const versions = await (settings as any).getVersions();

      res.json({
        status: 'success',
        data: versions
      });
    } catch (error) {
      logger.error('Error fetching admin settings history:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch admin settings history'
      });
    }
  }

  // Initialize default settings
  static async initializeSettings(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      const existingSettings = await AdminSettings.findOne();
      if (existingSettings) {
        return res.status(400).json({
          status: 'error',
          message: 'Settings already initialized'
        });
      }

      const defaultSettings = {
        store: {
          name: 'Wick & Wax Co',
          description: 'Premium Handcrafted Candles',
          currency: 'GBP',
          timezone: 'Europe/London',
          languages: ['en'],
          defaultLanguage: 'en'
        },
        payment: {
          methods: [{
            name: 'Revolut',
            provider: 'revolut',
            isActive: true,
            config: {
              mode: 'test'
            }
          }],
          taxRate: 20,
          currencies: ['GBP']
        },
        security: {
          passwordPolicy: {
            minLength: 8,
            requireNumbers: true,
            requireSpecialChars: true,
            requireUppercase: true,
            maxAttempts: 5
          },
          sessionTimeout: 3600,
          twoFactorAuth: false
        },
        inventory: {
          lowStockThreshold: 5,
          outOfStockBehavior: 'show_disabled',
          allowBackorders: false,
          autoReorderPoint: 3
        },
        updatedBy: userId
      };

      const settings = await AdminSettings.create(defaultSettings);

      logger.info('Admin settings initialized', { userId });

      res.json({
        status: 'success',
        data: settings
      });
    } catch (error) {
      logger.error('Error initializing admin settings:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to initialize admin settings'
      });
    }
  }

  // Validate settings
  static async validateSettings(req: Request, res: Response) {
    try {
      const settings = req.body;
      const adminSettings = new AdminSettings(settings);
      await adminSettings.validate();

      res.json({
        status: 'success',
        message: 'Settings are valid'
      });
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors: Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      logger.error('Error validating admin settings:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to validate admin settings'
      });
    }
  }
}

export default AdminSettingsController;
