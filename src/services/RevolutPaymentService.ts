import axios, { AxiosInstance } from 'axios';
import { logger } from '../server/utils/logger';

interface RevolutPaymentOrder {
  amount: number;
  currency: string;
  email: string;
  description?: string;
  capture_mode?: 'AUTOMATIC' | 'MANUAL';
  customer_id?: string;
  order_id?: string;
  metadata?: Record<string, string>;
}

interface RevolutPaymentResponse {
  id: string;
  public_id: string;
  status: 'PENDING' | 'PROCESSING' | 'AUTHORIZED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  payment_method: {
    id: string;
    type: string;
  };
  order_amount: {
    value: number;
    currency: string;
  };
  created_at: string;
  updated_at: string;
  completed_at?: string;
  customer_id?: string;
  order_id?: string;
  metadata?: Record<string, string>;
}

interface RevolutRefundRequest {
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
}

export class RevolutPaymentService {
  private static instance: RevolutPaymentService;
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly merchantId: string;
  private readonly client: AxiosInstance;
  private readonly webhookSecret: string;

  private constructor() {
    this.apiKey = import.meta.env.VITE_REVOLUT_API_KEY || '';
    this.baseUrl = import.meta.env.VITE_REVOLUT_API_URL || 'https://merchant.revolut.com/api/1.0';
    this.merchantId = import.meta.env.VITE_REVOLUT_MERCHANT_ID || '';
    this.webhookSecret = import.meta.env.VITE_REVOLUT_WEBHOOK_SECRET || '';

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Merchant-Id': this.merchantId
      },
      timeout: 10000
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        this.handleApiError(error);
        throw error;
      }
    );
  }

  public static getInstance(): RevolutPaymentService {
    if (!RevolutPaymentService.instance) {
      RevolutPaymentService.instance = new RevolutPaymentService();
    }
    return RevolutPaymentService.instance;
  }

  public async createPaymentOrder(order: RevolutPaymentOrder): Promise<RevolutPaymentResponse> {
    try {
      const response = await this.client.post('/orders', {
        ...order,
        merchant_id: this.merchantId,
        return_url: import.meta.env.VITE_REVOLUT_PAYMENT_RETURN_URL,
        cancel_url: import.meta.env.VITE_REVOLUT_PAYMENT_CANCEL_URL
      });

      logger.info('Payment order created', {
        orderId: response.data.id,
        amount: order.amount,
        currency: order.currency
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to create payment order', {
        error,
        order
      });
      throw error;
    }
  }

  public async getPaymentOrder(orderId: string): Promise<RevolutPaymentResponse> {
    try {
      const response = await this.client.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      logger.error('Failed to get payment order', {
        error,
        orderId
      });
      throw error;
    }
  }

  public async refundPayment(
    paymentId: string,
    refundRequest: RevolutRefundRequest
  ): Promise<RevolutPaymentResponse> {
    try {
      const response = await this.client.post(
        `/payments/${paymentId}/refund`,
        refundRequest
      );

      logger.info('Payment refunded', {
        paymentId,
        amount: refundRequest.amount,
        currency: refundRequest.currency
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to refund payment', {
        error,
        paymentId,
        refundRequest
      });
      throw error;
    }
  }

  public async capturePayment(
    paymentId: string,
    amount?: number
  ): Promise<RevolutPaymentResponse> {
    try {
      const payload = amount ? { amount } : {};
      const response = await this.client.post(
        `/payments/${paymentId}/capture`,
        payload
      );

      logger.info('Payment captured', {
        paymentId,
        amount
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to capture payment', {
        error,
        paymentId,
        amount
      });
      throw error;
    }
  }

  public async cancelPayment(paymentId: string): Promise<RevolutPaymentResponse> {
    try {
      const response = await this.client.post(`/payments/${paymentId}/cancel`);

      logger.info('Payment cancelled', {
        paymentId
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to cancel payment', {
        error,
        paymentId
      });
      throw error;
    }
  }

  public validateWebhookSignature(
    payload: string,
    signature: string
  ): boolean {
    try {
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', this.webhookSecret);
      const expectedSignature = hmac.update(payload).digest('hex');
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      logger.error('Webhook signature validation failed', {
        error
      });
      return false;
    }
  }

  private handleApiError(error: any): void {
    if (error.response) {
      logger.error('Revolut API error', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      logger.error('No response from Revolut API', {
        request: error.request
      });
    } else {
      logger.error('Error setting up request', {
        message: error.message
      });
    }
  }
}
