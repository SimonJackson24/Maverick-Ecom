import { gql } from '@apollo/client';
import { client } from '../apollo/client';
import { checkoutAnalytics } from '../analytics/checkoutAnalytics';

export interface AbandonedCartData {
  cartId: string;
  email: string;
  items: Array<{
    sku: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  lastActiveTimestamp: string;
  totalValue: number;
  currency: string;
  checkoutStep: string;
  recoveryUrl: string;
}

const SEND_ABANDONED_CART_EMAIL = gql`
  mutation SendAbandonedCartEmail($input: AbandonedCartEmailInput!) {
    sendAbandonedCartEmail(input: $input) {
      success
      message
    }
  }
`;

const SCHEDULE_ABANDONED_CART_RECOVERY = gql`
  mutation ScheduleAbandonedCartRecovery($input: AbandonedCartRecoveryInput!) {
    scheduleAbandonedCartRecovery(input: $input) {
      success
      message
      scheduledEmails {
        id
        scheduledTime
        emailType
      }
    }
  }
`;

export class AbandonedCartService {
  private static readonly ABANDONMENT_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes
  private static readonly RECOVERY_EMAIL_DELAYS = [
    1 * 60 * 60 * 1000,  // 1 hour
    24 * 60 * 60 * 1000, // 24 hours
    72 * 60 * 60 * 1000  // 72 hours
  ];

  private lastActivity: Map<string, number> = new Map();
  private recoveryScheduled: Set<string> = new Set();

  constructor() {
    // Start monitoring cart activity
    setInterval(() => this.checkForAbandonment(), 5 * 60 * 1000); // Check every 5 minutes
  }

  public trackActivity(cartId: string): void {
    this.lastActivity.set(cartId, Date.now());
  }

  private async checkForAbandonment(): Promise<void> {
    const now = Date.now();
    
    for (const [cartId, lastActiveTime] of this.lastActivity.entries()) {
      const timeSinceActivity = now - lastActiveTime;
      
      if (timeSinceActivity >= AbandonedCartService.ABANDONMENT_THRESHOLD_MS && 
          !this.recoveryScheduled.has(cartId)) {
        await this.handleAbandonment(cartId);
      }
    }
  }

  private async handleAbandonment(cartId: string): Promise<void> {
    try {
      // Get cart data
      const cartData = await this.getCartData(cartId);
      if (!cartData || !cartData.email) return;

      // Track abandonment in analytics
      checkoutAnalytics.abandonedCart({
        cartId,
        step: cartData.checkoutStep,
        value: cartData.totalValue,
        currency: cartData.currency,
      });

      // Schedule recovery emails
      await this.scheduleRecoveryEmails(cartData);
      
      this.recoveryScheduled.add(cartId);
    } catch (error) {
      console.error('Error handling cart abandonment:', error);
    }
  }

  private async getCartData(cartId: string): Promise<AbandonedCartData | null> {
    // Implementation would fetch cart data from your GraphQL API
    return null; // Placeholder
  }

  private async scheduleRecoveryEmails(cartData: AbandonedCartData): Promise<void> {
    const now = Date.now();
    const scheduledTimes = AbandonedCartService.RECOVERY_EMAIL_DELAYS.map(
      delay => new Date(now + delay).toISOString()
    );

    try {
      const { data } = await client.mutate({
        mutation: SCHEDULE_ABANDONED_CART_RECOVERY,
        variables: {
          input: {
            cartId: cartData.cartId,
            email: cartData.email,
            scheduledTimes,
            recoveryUrl: cartData.recoveryUrl,
            cartData: {
              items: cartData.items,
              totalValue: cartData.totalValue,
              currency: cartData.currency,
            },
          },
        },
      });

      if (data?.scheduleAbandonedCartRecovery?.success) {
        console.log('Recovery emails scheduled successfully');
      }
    } catch (error) {
      console.error('Error scheduling recovery emails:', error);
    }
  }

  public async sendRecoveryEmail(cartData: AbandonedCartData): Promise<boolean> {
    try {
      const { data } = await client.mutate({
        mutation: SEND_ABANDONED_CART_EMAIL,
        variables: {
          input: {
            email: cartData.email,
            cartId: cartData.cartId,
            items: cartData.items,
            totalValue: cartData.totalValue,
            currency: cartData.currency,
            recoveryUrl: cartData.recoveryUrl,
          },
        },
      });

      return data?.sendAbandonedCartEmail?.success || false;
    } catch (error) {
      console.error('Error sending recovery email:', error);
      return false;
    }
  }

  public clearCartTracking(cartId: string): void {
    this.lastActivity.delete(cartId);
    this.recoveryScheduled.delete(cartId);
  }
}

export const abandonedCartService = new AbandonedCartService();
