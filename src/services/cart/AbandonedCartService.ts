import { analytics } from '../analytics/unifiedAnalytics';
import { emailTemplates } from '../email/EmailTemplateService';
import { campaignTracking } from '../email/CampaignTrackingService';
import { recommendations } from '../recommendations/unifiedRecommendations';

interface AbandonedCart {
  id: string;
  userId: string;
  email: string;
  items: CartItem[];
  total: number;
  abandonedAt: Date;
  lastReminderSent?: Date;
  reminderCount: number;
  recovered: boolean;
  recoveredAt?: Date;
}

interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  scentProfile?: any;
}

interface ReminderConfig {
  delay: number; // hours
  template: string;
  offer?: {
    type: 'DISCOUNT' | 'FREE_SHIPPING';
    value: number;
    code: string;
  };
}

class AbandonedCartService {
  private static instance: AbandonedCartService;
  private abandonedCarts: Map<string, AbandonedCart> = new Map();
  
  private reminderSchedule: ReminderConfig[] = [
    {
      delay: 1,
      template: 'abandoned_cart_1'
    },
    {
      delay: 24,
      template: 'abandoned_cart_2',
      offer: {
        type: 'DISCOUNT',
        value: 10,
        code: 'COMEBACK10'
      }
    },
    {
      delay: 72,
      template: 'abandoned_cart_3',
      offer: {
        type: 'FREE_SHIPPING',
        value: 0,
        code: 'FREESHIP'
      }
    }
  ];

  private constructor() {
    this.startRecoveryProcess();
  }

  public static getInstance(): AbandonedCartService {
    if (!AbandonedCartService.instance) {
      AbandonedCartService.instance = new AbandonedCartService();
    }
    return AbandonedCartService.instance;
  }

  public async trackAbandonedCart(cart: Omit<AbandonedCart, 'reminderCount' | 'recovered'>): Promise<void> {
    const abandonedCart: AbandonedCart = {
      ...cart,
      reminderCount: 0,
      recovered: false
    };

    this.abandonedCarts.set(cart.id, abandonedCart);

    analytics.track('cart_abandoned', {
      cart_id: cart.id,
      user_id: cart.userId,
      email: cart.email,
      total: cart.total,
      items_count: cart.items.length
    });
  }

  public async markCartAsRecovered(cartId: string): Promise<void> {
    const cart = this.abandonedCarts.get(cartId);
    if (!cart || cart.recovered) return;

    cart.recovered = true;
    cart.recoveredAt = new Date();
    this.abandonedCarts.set(cartId, cart);

    analytics.track('cart_recovered', {
      cart_id: cartId,
      user_id: cart.userId,
      email: cart.email,
      total: cart.total,
      reminder_count: cart.reminderCount,
      time_to_recovery: this.getHoursSinceAbandonment(cart)
    });
  }

  private async startRecoveryProcess(): Promise<void> {
    // Check for abandoned carts every hour
    setInterval(async () => {
      for (const cart of this.abandonedCarts.values()) {
        if (cart.recovered) continue;
        await this.processCart(cart);
      }
    }, 60 * 60 * 1000); // 1 hour
  }

  private async processCart(cart: AbandonedCart): Promise<void> {
    const hoursSinceAbandonment = this.getHoursSinceAbandonment(cart);
    const nextReminder = this.reminderSchedule[cart.reminderCount];

    if (!nextReminder || cart.recovered) return;

    // Check if it's time for the next reminder
    if (hoursSinceAbandonment >= nextReminder.delay) {
      await this.sendReminder(cart, nextReminder);
    }
  }

  private async sendReminder(cart: AbandonedCart, config: ReminderConfig): Promise<void> {
    // Create campaign for this reminder
    const campaignId = `abandoned_cart_${cart.id}_${cart.reminderCount + 1}`;
    const campaign = await campaignTracking.createCampaign({
      id: campaignId,
      name: `Abandoned Cart Reminder ${cart.reminderCount + 1}`,
      type: 'ABANDONED_CART',
      templateId: config.template,
      segment: {
        id: 'abandoned_cart',
        name: 'Abandoned Cart Users',
        criteria: []
      },
      startDate: new Date(),
      status: 'ACTIVE'
    });

    // Get personalized recommendations
    const personalizedRecommendations = await recommendations.getRecommendations(
      cart.items[0], // Use first item for recommendations
      ['SCENT_BASED', 'RELATED'],
      3
    );

    // Prepare email data
    const emailData = {
      user: {
        email: cart.email
      },
      cart: {
        items: cart.items,
        total: cart.total,
        abandonedAt: cart.abandonedAt
      },
      recommendations: personalizedRecommendations,
      offer: config.offer
    };

    // Render and send email
    const emailContent = await emailTemplates.renderEmail(
      config.template,
      emailData,
      campaignId
    );

    // Update cart status
    cart.lastReminderSent = new Date();
    cart.reminderCount++;
    this.abandonedCarts.set(cart.id, cart);

    // Track reminder sent
    analytics.track('abandoned_cart_reminder_sent', {
      cart_id: cart.id,
      user_id: cart.userId,
      email: cart.email,
      reminder_number: cart.reminderCount,
      offer: config.offer
    });

    // Track email sent in campaign
    await campaignTracking.trackEmailSent(campaignId, cart.userId);
  }

  private getHoursSinceAbandonment(cart: AbandonedCart): number {
    const now = new Date();
    const abandonedAt = new Date(cart.abandonedAt);
    return Math.floor((now.getTime() - abandonedAt.getTime()) / (1000 * 60 * 60));
  }

  // Analytics methods
  public getRecoveryStats() {
    let total = 0;
    let recovered = 0;
    let totalValue = 0;
    let recoveredValue = 0;

    for (const cart of this.abandonedCarts.values()) {
      total++;
      totalValue += cart.total;

      if (cart.recovered) {
        recovered++;
        recoveredValue += cart.total;
      }
    }

    return {
      totalCarts: total,
      recoveredCarts: recovered,
      recoveryRate: (recovered / total) * 100,
      totalValue,
      recoveredValue,
      recoveryValueRate: (recoveredValue / totalValue) * 100
    };
  }
}

export const abandonedCart = AbandonedCartService.getInstance();
