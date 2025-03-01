import { MonitoringService } from '../monitoring/MonitoringService';

export interface NewsletterPreferences {
  productUpdates: boolean;
  promotions: boolean;
  scentNews: boolean;
  seasonalOffers: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
}

export interface NewsletterSubscriber {
  email: string;
  firstName?: string;
  lastName?: string;
  preferences: NewsletterPreferences;
  subscriptionDate: Date;
  unsubscribeToken: string;
  isVerified: boolean;
}

export class NewsletterService {
  private static instance: NewsletterService;
  private monitoring: MonitoringService;

  private constructor() {
    this.monitoring = MonitoringService.getInstance();
  }

  public static getInstance(): NewsletterService {
    if (!NewsletterService.instance) {
      NewsletterService.instance = new NewsletterService();
    }
    return NewsletterService.instance;
  }

  public async subscribe(
    email: string,
    preferences: Partial<NewsletterPreferences> = {},
    firstName?: string,
    lastName?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          preferences: {
            productUpdates: true,
            promotions: true,
            scentNews: true,
            seasonalOffers: true,
            frequency: 'weekly',
            ...preferences,
          },
          firstName,
          lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe');
      }

      this.monitoring.logEvent('newsletter_subscription', {
        email,
        preferences,
        success: true,
      });

      return {
        success: true,
        message: 'Successfully subscribed! Please check your email to confirm your subscription.',
      };
    } catch (error) {
      this.monitoring.logError('newsletter_subscription_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        email,
      });

      return {
        success: false,
        message: 'Failed to subscribe. Please try again later.',
      };
    }
  }

  public async unsubscribe(
    email: string,
    token: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to unsubscribe');
      }

      this.monitoring.logEvent('newsletter_unsubscription', {
        email,
        success: true,
      });

      return {
        success: true,
        message: 'Successfully unsubscribed from our newsletter.',
      };
    } catch (error) {
      this.monitoring.logError('newsletter_unsubscription_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        email,
      });

      return {
        success: false,
        message: 'Failed to unsubscribe. Please try again later.',
      };
    }
  }

  public async updatePreferences(
    email: string,
    preferences: Partial<NewsletterPreferences>
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('/api/newsletter/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          preferences,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update preferences');
      }

      this.monitoring.logEvent('newsletter_preferences_updated', {
        email,
        preferences,
        success: true,
      });

      return {
        success: true,
        message: 'Successfully updated your newsletter preferences.',
      };
    } catch (error) {
      this.monitoring.logError('newsletter_preferences_update_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        email,
      });

      return {
        success: false,
        message: 'Failed to update preferences. Please try again later.',
      };
    }
  }

  public async verifyEmail(
    email: string,
    token: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('/api/newsletter/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify email');
      }

      this.monitoring.logEvent('newsletter_email_verified', {
        email,
        success: true,
      });

      return {
        success: true,
        message: 'Your email has been successfully verified.',
      };
    } catch (error) {
      this.monitoring.logError('newsletter_email_verification_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        email,
      });

      return {
        success: false,
        message: 'Failed to verify email. Please try again later.',
      };
    }
  }
}
