export interface RevolutPaymentConfig {
  merchantId: string;
  currency: string;
  minimumOrderAmount: number;
  maximumOrderAmount: number;
  enableFraudProtection: boolean;
  enable3DS: boolean;
  sessionTimeout: number;
  testMode: boolean;
}

export interface PaymentError {
  code: string;
  message: string;
  timestamp: Date;
  orderId?: string;
  details?: Record<string, any>;
}

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'suspicious';
