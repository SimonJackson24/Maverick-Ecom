import axios from 'axios';

const ROYAL_MAIL_API_BASE = 'https://api.royalmail.net/shipping/v3';

interface TrackingEvent {
  eventDateTime: string;
  eventDescription: string;
  location: string;
  status: string;
}

interface TrackingResponse {
  consignmentNumber: string;
  status: string;
  estimatedDelivery?: string;
  events: TrackingEvent[];
}

export class RoyalMailTracking {
  private clientId: string;
  private clientSecret: string;
  private accessToken?: string;
  private tokenExpiry?: Date;

  constructor() {
    // These should be loaded from environment variables
    this.clientId = process.env.ROYAL_MAIL_CLIENT_ID || '';
    this.clientSecret = process.env.ROYAL_MAIL_CLIENT_SECRET || '';
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        `${ROYAL_MAIL_API_BASE}/token`,
        {
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);
      return this.accessToken;
    } catch (error) {
      console.error('Failed to get Royal Mail access token:', error);
      throw new Error('Failed to authenticate with Royal Mail API');
    }
  }

  async trackShipment(trackingNumber: string): Promise<TrackingResponse> {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get(
        `${ROYAL_MAIL_API_BASE}/tracking/${trackingNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }
      );

      return {
        consignmentNumber: trackingNumber,
        status: response.data.status,
        estimatedDelivery: response.data.estimatedDelivery,
        events: response.data.trackingEvents.map((event: any) => ({
          eventDateTime: event.eventDateTime,
          eventDescription: event.eventDescription,
          location: event.location,
          status: event.status,
        })),
      };
    } catch (error) {
      console.error('Failed to track shipment:', error);
      throw new Error('Failed to retrieve tracking information');
    }
  }
}
