import { analytics } from '../analytics/unifiedAnalytics';
import { recommendations } from '../recommendations/unifiedRecommendations';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  category: EmailCategory;
  version: string;
}

type EmailCategory = 
  | 'NEWSLETTER'
  | 'ABANDONED_CART'
  | 'PRODUCT_RECOMMENDATION'
  | 'WELCOME_SERIES'
  | 'SPECIAL_OFFER';

interface PersonalizationData {
  user: {
    firstName?: string;
    lastName?: string;
    email: string;
    scentPreferences?: any;
    lastPurchase?: any;
  };
  cart?: {
    items: any[];
    total: number;
    abandonedAt: Date;
  };
  recommendations?: any[];
  specialOffers?: any[];
}

class EmailTemplateService {
  private static instance: EmailTemplateService;
  private templates: Map<string, EmailTemplate> = new Map();

  private constructor() {
    this.initializeTemplates();
  }

  public static getInstance(): EmailTemplateService {
    if (!EmailTemplateService.instance) {
      EmailTemplateService.instance = new EmailTemplateService();
    }
    return EmailTemplateService.instance;
  }

  private initializeTemplates() {
    // Welcome Series Templates
    this.templates.set('welcome_1', {
      id: 'welcome_1',
      name: 'Welcome Email 1',
      subject: 'Welcome to Wick & Wax Co!',
      content: this.getWelcomeTemplate(),
      variables: ['firstName', 'recommendedProducts'],
      category: 'WELCOME_SERIES',
      version: '1.0'
    });

    // Abandoned Cart Templates
    this.templates.set('abandoned_cart_1', {
      id: 'abandoned_cart_1',
      name: 'Abandoned Cart Reminder 1',
      subject: 'Complete Your Wick & Wax Co Purchase',
      content: this.getAbandonedCartTemplate(),
      variables: ['firstName', 'cartItems', 'cartTotal', 'recommendedProducts'],
      category: 'ABANDONED_CART',
      version: '1.0'
    });

    // Newsletter Templates
    this.templates.set('monthly_newsletter', {
      id: 'monthly_newsletter',
      name: 'Monthly Newsletter',
      subject: '{{monthYear}} Scent Updates & News',
      content: this.getMonthlyNewsletterTemplate(),
      variables: ['firstName', 'featuredProducts', 'scentTrends', 'specialOffers'],
      category: 'NEWSLETTER',
      version: '1.0'
    });
  }

  public async renderEmail(
    templateId: string,
    data: PersonalizationData,
    campaignId?: string
  ): Promise<string> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    // Track template rendering
    analytics.track('email_template_render', {
      template_id: templateId,
      campaign_id: campaignId,
      user_email: data.user.email
    });

    // Get personalized content
    const personalizedContent = await this.personalizeContent(template, data);

    return this.applyTemplate(template, personalizedContent);
  }

  private async personalizeContent(
    template: EmailTemplate,
    data: PersonalizationData
  ): Promise<any> {
    const content: any = {};

    // Basic personalization
    content.firstName = data.user.firstName || 'Valued Customer';
    content.currentDate = new Date().toLocaleDateString();

    // Product recommendations
    if (template.variables.includes('recommendedProducts')) {
      content.recommendedProducts = await this.getPersonalizedRecommendations(data);
    }

    // Abandoned cart content
    if (template.category === 'ABANDONED_CART' && data.cart) {
      content.cartItems = this.formatCartItems(data.cart.items);
      content.cartTotal = this.formatPrice(data.cart.total);
      content.timeAbandonedAgo = this.getTimeAgo(data.cart.abandonedAt);
    }

    // Scent-based personalization
    if (data.user.scentPreferences) {
      content.personalizedScents = await this.getPersonalizedScentContent(data.user.scentPreferences);
    }

    return content;
  }

  private async getPersonalizedRecommendations(data: PersonalizationData) {
    let recommendationTypes = ['TRENDING', 'FEATURED'];
    
    // Add scent-based recommendations if user has preferences
    if (data.user.scentPreferences) {
      recommendationTypes.push('SCENT_BASED');
    }

    // Add seasonal recommendations
    recommendationTypes.push('SEASONAL');

    return await recommendations.getRecommendations(
      data.user.lastPurchase,
      recommendationTypes,
      4
    );
  }

  private async getPersonalizedScentContent(scentPreferences: any) {
    // Implement scent-based content personalization
    return {};
  }

  private formatCartItems(items: any[]) {
    return items.map(item => ({
      ...item,
      formattedPrice: this.formatPrice(item.price)
    }));
  }

  private formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  private getTimeAgo(date: Date): string {
    const hours = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60));
    return `${hours} hours`;
  }

  private getWelcomeTemplate(): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Welcome to Wick & Wax Co</title>
        </head>
        <body>
          <h1>Welcome {{firstName}}!</h1>
          <!-- Welcome email content -->
        </body>
      </html>
    `;
  }

  private getAbandonedCartTemplate(): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Complete Your Purchase</title>
        </head>
        <body>
          <h1>Hello {{firstName}},</h1>
          <!-- Abandoned cart content -->
        </body>
      </html>
    `;
  }

  private getMonthlyNewsletterTemplate(): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Monthly Newsletter</title>
        </head>
        <body>
          <h1>Hi {{firstName}},</h1>
          <!-- Newsletter content -->
        </body>
      </html>
    `;
  }

  private applyTemplate(template: EmailTemplate, content: any): string {
    let rendered = template.content;
    
    // Replace variables in template
    Object.entries(content).forEach(([key, value]) => {
      rendered = rendered.replace(
        new RegExp(`{{${key}}}`, 'g'),
        String(value)
      );
    });

    return rendered;
  }
}

export const emailTemplates = EmailTemplateService.getInstance();
