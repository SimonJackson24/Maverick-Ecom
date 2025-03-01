import axios from 'axios';
import { WhatsAppSettings } from '../../types/admin';

interface WhatsAppMessage {
  id?: string;
  from?: string;
  to?: string;
  content: string;
  timestamp?: Date;
  status?: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    caption?: string;
  };
}

interface WhatsAppTemplate {
  name: string;
  language: string;
  components: {
    type: 'body' | 'header' | 'button';
    parameters: Array<{
      type: 'text' | 'currency' | 'date_time' | 'image' | 'document';
      text?: string;
      currency?: {
        fallback_value: string;
        code: string;
        amount_1000: number;
      };
      date_time?: {
        fallback_value: string;
      };
      image?: {
        link: string;
      };
      document?: {
        link: string;
        filename: string;
      };
    }>;
  }[];
}

export class WhatsAppService {
  private static instance: WhatsAppService;
  private settings: WhatsAppSettings | null = null;
  private activeSessions: Map<string, { phoneNumber: string; startTime: number }> = new Map();
  private readonly isDev = import.meta.env.MODE === 'development';
  private readonly WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';
  private readonly PHONE_NUMBER_ID = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID;
  private readonly ACCESS_TOKEN = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;

  private constructor() {
    this.loadSettings();
  }

  public static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  private async loadSettings(): Promise<void> {
    try {
      if (this.isDev) {
        this.settings = {
          enabled: true,
          operatingHours: {
            enabled: true,
            schedule: [
              { isOpen: false, start: '00:00', end: '00:00' }, // Sunday
              { isOpen: true, start: '09:00', end: '17:00' },  // Monday
              { isOpen: true, start: '09:00', end: '17:00' },  // Tuesday
              { isOpen: true, start: '09:00', end: '17:00' },  // Wednesday
              { isOpen: true, start: '09:00', end: '17:00' },  // Thursday
              { isOpen: true, start: '09:00', end: '17:00' },  // Friday
              { isOpen: false, start: '00:00', end: '00:00' }, // Saturday
            ],
            timezone: 'Europe/London',
          },
          templates: [
            {
              name: 'order_confirmation',
              language: 'en',
              components: [
                {
                  type: 'header',
                  parameters: [
                    {
                      type: 'text',
                      text: 'Order Confirmation',
                    },
                  ],
                },
                {
                  type: 'body',
                  parameters: [
                    {
                      type: 'text',
                      text: 'Thank you for your order! Your order number is {{1}}.',
                    },
                  ],
                },
              ],
            },
          ],
          autoResponses: {
            enabled: true,
            outOfHours: 'Thanks for your message! We\'re currently closed but will get back to you during our business hours.',
            default: 'Thanks for your message! We\'ll get back to you shortly.',
          },
        };
      } else {
        const response = await axios.get('/api/support/whatsapp/settings');
        this.settings = response.data;
      }
    } catch (error) {
      console.error('Failed to load WhatsApp settings:', error);
    }
  }

  public async sendMessage(message: WhatsAppMessage): Promise<any> {
    if (!this.settings?.enabled) {
      throw new Error('WhatsApp integration is disabled');
    }

    if (this.isDev) {
      // Simulate message sending in development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: Date.now().toString(),
            status: 'sent',
            timestamp: new Date(),
          });
        }, 500);
      });
    }

    try {
      const response = await axios.post(
        `${this.WHATSAPP_API_URL}/${this.PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: message.to,
          type: message.type,
          [message.type]: {
            body: message.content,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error);
      throw error;
    }
  }

  public async sendTemplate(
    to: string,
    template: WhatsAppTemplate,
    language = 'en'
  ): Promise<any> {
    if (!this.settings?.enabled) {
      throw new Error('WhatsApp integration is disabled');
    }

    if (this.isDev) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: Date.now().toString(),
            status: 'sent',
            timestamp: new Date(),
          });
        }, 500);
      });
    }

    try {
      const response = await axios.post(
        `${this.WHATSAPP_API_URL}/${this.PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to,
          type: 'template',
          template: {
            name: template.name,
            language: {
              code: language,
            },
            components: template.components,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to send WhatsApp template:', error);
      throw error;
    }
  }

  public isWithinOperatingHours(): boolean {
    if (!this.settings?.operatingHours.enabled) return true;

    const now = new Date();
    const day = now.getDay();
    const schedule = this.settings.operatingHours.schedule[day];

    if (!schedule.isOpen) return false;

    const [startHour, startMinute] = schedule.start.split(':').map(Number);
    const [endHour, endMinute] = schedule.end.split(':').map(Number);
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return (
      (currentHour > startHour ||
        (currentHour === startHour && currentMinute >= startMinute)) &&
      (currentHour < endHour ||
        (currentHour === endHour && currentMinute <= endMinute))
    );
  }

  public getAutoResponse(): string {
    if (!this.settings?.autoResponses.enabled) return '';

    return this.isWithinOperatingHours()
      ? this.settings.autoResponses.default
      : this.settings.autoResponses.outOfHours;
  }

  public getSettings(): WhatsAppSettings | null {
    return this.settings;
  }
}

// Export singleton instance
export const whatsAppService = WhatsAppService.getInstance();
