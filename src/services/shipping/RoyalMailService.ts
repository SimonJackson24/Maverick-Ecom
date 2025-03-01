import axios from 'axios';

interface RoyalMailConfig {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
  environment: 'test' | 'production';
}

interface ShipmentDetails {
  recipientDetails: {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    county?: string;
    postcode: string;
    country: string;
    phoneNumber?: string;
    email?: string;
  };
  packageDetails: {
    weight: number; // in kg
    length: number; // in cm
    width: number;  // in cm
    height: number; // in cm
    contents: string;
    value: number;
  };
  serviceCode: string; // e.g., 'CRL24', 'CRL48', 'CRL1'
  serviceOptions?: {
    tracked: boolean;
    signature: boolean;
    insurance: boolean;
    safePlace?: string;
  };
}

interface ShipmentResponse {
  shipmentId: string;
  trackingNumber: string;
  labelUrl: string;
  cost: {
    amount: number;
    currency: string;
  };
  estimatedDelivery: {
    from: string;
    to: string;
  };
}

class RoyalMailService {
  private config: RoyalMailConfig;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(config: RoyalMailConfig) {
    this.config = config;
  }

  private async authenticate(): Promise<void> {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/oauth/token`,
        {
          grant_type: 'client_credentials',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      const expiresIn = response.data.expires_in;
      this.tokenExpiry = new Date(Date.now() + expiresIn * 1000);
    } catch (error) {
      console.error('Failed to authenticate with Royal Mail API:', error);
      throw new Error('Authentication failed');
    }
  }

  private async ensureAuthenticated(): Promise<void> {
    if (!this.accessToken || !this.tokenExpiry || this.tokenExpiry < new Date()) {
      await this.authenticate();
    }
  }

  private getServiceEndpoint(path: string): string {
    return `${this.config.baseUrl}/shipping/v1/${path}`;
  }

  async createShipment(details: ShipmentDetails): Promise<ShipmentResponse> {
    await this.ensureAuthenticated();

    try {
      const response = await axios.post(
        this.getServiceEndpoint('shipments'),
        {
          shipper: {
            tradingName: 'Wick & Wax Co',
            addressLine1: process.env.REACT_APP_SHIPPING_ADDRESS_LINE1,
            city: process.env.REACT_APP_SHIPPING_CITY,
            postcode: process.env.REACT_APP_SHIPPING_POSTCODE,
            country: 'GB',
          },
          recipient: details.recipientDetails,
          package: {
            ...details.packageDetails,
            packageType: 'PARCEL',
          },
          service: {
            code: details.serviceCode,
            ...details.serviceOptions,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        shipmentId: response.data.shipmentId,
        trackingNumber: response.data.trackingNumber,
        labelUrl: response.data.label.url,
        cost: response.data.cost,
        estimatedDelivery: response.data.estimatedDelivery,
      };
    } catch (error) {
      console.error('Failed to create shipment:', error);
      throw new Error('Shipment creation failed');
    }
  }

  async getShipmentTracking(trackingNumber: string): Promise<any> {
    await this.ensureAuthenticated();

    try {
      const response = await axios.get(
        this.getServiceEndpoint(`tracking/${trackingNumber}`),
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to get tracking information:', error);
      throw new Error('Tracking lookup failed');
    }
  }

  async getShippingRates(details: Omit<ShipmentDetails, 'serviceCode'>): Promise<any> {
    await this.ensureAuthenticated();

    try {
      const response = await axios.post(
        this.getServiceEndpoint('rates'),
        {
          origin: {
            postcode: process.env.REACT_APP_SHIPPING_POSTCODE,
            country: 'GB',
          },
          destination: {
            postcode: details.recipientDetails.postcode,
            country: details.recipientDetails.country,
          },
          package: details.packageDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return response.data.services;
    } catch (error) {
      console.error('Failed to get shipping rates:', error);
      throw new Error('Rate calculation failed');
    }
  }

  async cancelShipment(shipmentId: string): Promise<void> {
    await this.ensureAuthenticated();

    try {
      await axios.delete(
        this.getServiceEndpoint(`shipments/${shipmentId}`),
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error('Failed to cancel shipment:', error);
      throw new Error('Shipment cancellation failed');
    }
  }

  async createManifest(): Promise<string> {
    await this.ensureAuthenticated();

    try {
      const response = await axios.post(
        this.getServiceEndpoint('manifests'),
        {},
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return response.data.manifestUrl;
    } catch (error) {
      console.error('Failed to create manifest:', error);
      throw new Error('Manifest creation failed');
    }
  }

  async createBulkShipments(shipments: ShipmentDetails[]): Promise<ShipmentResponse[]> {
    await this.ensureAuthenticated();

    try {
      const response = await axios.post(
        this.getServiceEndpoint('shipments/bulk'),
        {
          shipments: shipments.map(shipment => ({
            shipper: {
              tradingName: 'Wick & Wax Co',
              addressLine1: process.env.REACT_APP_SHIPPING_ADDRESS_LINE1,
              city: process.env.REACT_APP_SHIPPING_CITY,
              postcode: process.env.REACT_APP_SHIPPING_POSTCODE,
              country: 'GB',
            },
            recipient: shipment.recipientDetails,
            package: {
              ...shipment.packageDetails,
              packageType: 'PARCEL',
            },
            service: {
              code: shipment.serviceCode,
              ...shipment.serviceOptions,
            },
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.shipments.map((shipment: any) => ({
        shipmentId: shipment.shipmentId,
        trackingNumber: shipment.trackingNumber,
        labelUrl: shipment.label.url,
        cost: shipment.cost,
        estimatedDelivery: shipment.estimatedDelivery,
      }));
    } catch (error) {
      console.error('Failed to create bulk shipments:', error);
      throw new Error('Bulk shipment creation failed');
    }
  }

  async downloadBulkLabels(labelUrls: string[]): Promise<Blob[]> {
    await this.ensureAuthenticated();

    try {
      const labelPromises = labelUrls.map(async (url) => {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
          responseType: 'blob',
        });
        return response.data;
      });

      return Promise.all(labelPromises);
    } catch (error) {
      console.error('Failed to download bulk labels:', error);
      throw new Error('Label download failed');
    }
  }

  async createBulkManifest(shipmentIds: string[]): Promise<string> {
    await this.ensureAuthenticated();

    try {
      const response = await axios.post(
        this.getServiceEndpoint('manifests/bulk'),
        {
          shipmentIds,
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return response.data.manifestUrl;
    } catch (error) {
      console.error('Failed to create bulk manifest:', error);
      throw new Error('Bulk manifest creation failed');
    }
  }
}

export default RoyalMailService;
