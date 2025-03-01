import { Request, Response } from 'express';
import { PaymentConfig } from '../models/PaymentConfig';
import { validatePaymentConfig } from '../validators/paymentConfigValidator';

export class PaymentConfigController {
  static async getConfig(req: Request, res: Response) {
    try {
      const config = await PaymentConfig.findOne().sort({ updatedAt: -1 });
      
      if (!config) {
        return res.status(404).json({ error: 'Payment configuration not found' });
      }

      res.json(config);
    } catch (error) {
      console.error('Error fetching payment config:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateConfig(req: Request, res: Response) {
    try {
      const { error } = validatePaymentConfig(req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const config = await PaymentConfig.findOneAndUpdate(
        {},
        {
          ...req.body,
          updatedAt: new Date(),
          updatedBy: req.user?.id || 'system',
        },
        { new: true, upsert: true }
      );

      res.json(config);
    } catch (error) {
      console.error('Error updating payment config:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async validateConfig(req: Request, res: Response) {
    try {
      const { error } = validatePaymentConfig(req.body);
      res.json({ valid: !error, error: error?.message });
    } catch (error) {
      console.error('Error validating payment config:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
