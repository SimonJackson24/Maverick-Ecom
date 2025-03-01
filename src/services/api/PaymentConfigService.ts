import { RevolutPaymentConfig } from '../../types/payment';

class PaymentConfigService {
  private static instance: PaymentConfigService;
  private readonly API_BASE = '/api/payment-config';

  private constructor() {}

  static getInstance(): PaymentConfigService {
    if (!PaymentConfigService.instance) {
      PaymentConfigService.instance = new PaymentConfigService();
    }
    return PaymentConfigService.instance;
  }

  async getConfig(): Promise<RevolutPaymentConfig> {
    try {
      const response = await fetch(this.API_BASE);
      if (!response.ok) {
        throw new Error('Failed to fetch payment configuration');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching payment config:', error);
      throw error;
    }
  }

  async updateConfig(config: RevolutPaymentConfig): Promise<RevolutPaymentConfig> {
    try {
      const response = await fetch(this.API_BASE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment configuration');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating payment config:', error);
      throw error;
    }
  }

  async validateConfig(config: Partial<RevolutPaymentConfig>): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Config validation failed');
      }

      const { valid } = await response.json();
      return valid;
    } catch (error) {
      console.error('Error validating payment config:', error);
      throw error;
    }
  }
}

export default PaymentConfigService;
