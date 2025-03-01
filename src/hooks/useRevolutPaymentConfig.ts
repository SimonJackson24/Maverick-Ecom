import { useState, useEffect } from 'react';
import { RevolutPaymentConfig } from '../types/payment';
import PaymentConfigService from '../services/api/PaymentConfigService';
import PaymentMonitoringService from '../services/monitoring/PaymentMonitoringService';

export const useRevolutPaymentConfig = () => {
  const [config, setConfig] = useState<RevolutPaymentConfig>({
    merchantId: import.meta.env.VITE_REVOLUT_MERCHANT_ID || '',
    currency: 'GBP',
    minimumOrderAmount: 10,
    maximumOrderAmount: 1000,
    enableFraudProtection: true,
    enable3DS: true,
    sessionTimeout: 30,
    testMode: import.meta.env.MODE !== 'production',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const configService = PaymentConfigService.getInstance();
  const monitoringService = PaymentMonitoringService.getInstance();

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setIsLoading(true);
        const loadedConfig = await configService.getConfig();
        setConfig(loadedConfig);
        setError(null);
      } catch (err) {
        const errorMessage = 'Failed to load payment configuration';
        setError(errorMessage);
        monitoringService.logPaymentAttempt({
          id: crypto.randomUUID(),
          userId: 'system',
          amount: 0,
          currency: 'GBP',
          timestamp: new Date(),
          status: 'failure',
          errorMessage,
          ipAddress: 'system',
          deviceInfo: 'system',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  const updateConfig = async (newConfig: RevolutPaymentConfig) => {
    try {
      setIsLoading(true);
      
      // Validate config before updating
      const isValid = await configService.validateConfig(newConfig);
      if (!isValid) {
        throw new Error('Invalid configuration');
      }

      // Update config
      const updatedConfig = await configService.updateConfig(newConfig);
      setConfig(updatedConfig);
      setError(null);

      // Log successful update
      await monitoringService.logPaymentAttempt({
        id: crypto.randomUUID(),
        userId: 'system',
        amount: 0,
        currency: updatedConfig.currency,
        timestamp: new Date(),
        status: 'success',
        ipAddress: 'system',
        deviceInfo: 'system',
      });
    } catch (err) {
      const errorMessage = 'Failed to update payment configuration';
      setError(errorMessage);
      
      // Log error
      await monitoringService.logPaymentAttempt({
        id: crypto.randomUUID(),
        userId: 'system',
        amount: 0,
        currency: newConfig.currency,
        timestamp: new Date(),
        status: 'failure',
        errorMessage,
        ipAddress: 'system',
        deviceInfo: 'system',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    config,
    updateConfig,
    isLoading,
    error,
  };
};
