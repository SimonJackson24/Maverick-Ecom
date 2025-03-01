import { Request, Response } from 'express';
import { RevolutPaymentService } from '../../services/RevolutPaymentService';
import { logger } from '../utils/logger';
import { OrderService } from '../services/OrderService';

export class RevolutWebhookController {
  private static instance: RevolutWebhookController;
  private readonly paymentService: RevolutPaymentService;
  private readonly orderService: OrderService;

  private constructor() {
    this.paymentService = RevolutPaymentService.getInstance();
    this.orderService = OrderService.getInstance();
  }

  public static getInstance(): RevolutWebhookController {
    if (!RevolutWebhookController.instance) {
      RevolutWebhookController.instance = new RevolutWebhookController();
    }
    return RevolutWebhookController.instance;
  }

  public async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const signature = req.headers['revolut-signature'] as string;
      const payload = JSON.stringify(req.body);

      // Validate webhook signature
      if (!signature || !this.paymentService.validateWebhookSignature(payload, signature)) {
        logger.warn('Invalid webhook signature received', {
          signature,
          payload
        });
        res.status(401).json({ error: 'Invalid signature' });
        return;
      }

      const event = req.body;
      logger.info('Received Revolut webhook', { event });

      switch (event.type) {
        case 'ORDER.COMPLETED':
          await this.handleOrderCompleted(event.data);
          break;

        case 'ORDER.FAILED':
          await this.handleOrderFailed(event.data);
          break;

        case 'ORDER.CANCELLED':
          await this.handleOrderCancelled(event.data);
          break;

        case 'REFUND.COMPLETED':
          await this.handleRefundCompleted(event.data);
          break;

        default:
          logger.info('Unhandled webhook event type', { type: event.type });
      }

      res.status(200).json({ received: true });
    } catch (error) {
      logger.error('Error processing webhook', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  private async handleOrderCompleted(data: any): Promise<void> {
    try {
      const { order_id, metadata } = data;
      
      // Update order status
      await this.orderService.updateOrderStatus(order_id, 'PAID');
      
      // Additional business logic (e.g., send confirmation email, update inventory)
      logger.info('Order completed successfully', {
        orderId: order_id,
        metadata
      });
    } catch (error) {
      logger.error('Error handling completed order', {
        error,
        data
      });
      throw error;
    }
  }

  private async handleOrderFailed(data: any): Promise<void> {
    try {
      const { order_id, error } = data;
      
      // Update order status
      await this.orderService.updateOrderStatus(order_id, 'FAILED');
      
      logger.error('Order failed', {
        orderId: order_id,
        error
      });
    } catch (error) {
      logger.error('Error handling failed order', {
        error,
        data
      });
      throw error;
    }
  }

  private async handleOrderCancelled(data: any): Promise<void> {
    try {
      const { order_id } = data;
      
      // Update order status
      await this.orderService.updateOrderStatus(order_id, 'CANCELLED');
      
      logger.info('Order cancelled', {
        orderId: order_id
      });
    } catch (error) {
      logger.error('Error handling cancelled order', {
        error,
        data
      });
      throw error;
    }
  }

  private async handleRefundCompleted(data: any): Promise<void> {
    try {
      const { order_id, refund_amount } = data;
      
      // Update order status and refund information
      await this.orderService.updateOrderRefund(order_id, refund_amount);
      
      logger.info('Refund completed', {
        orderId: order_id,
        refundAmount: refund_amount
      });
    } catch (error) {
      logger.error('Error handling completed refund', {
        error,
        data
      });
      throw error;
    }
  }
}
