import { Collection, CollectionFormData } from '../admin/types/Collection';
import AdobeCommerceService from './AdobeCommerceService';

export class CollectionService {
  private static instance: CollectionService;
  private adobeCommerceService: AdobeCommerceService;

  private constructor() {
    this.adobeCommerceService = AdobeCommerceService.getInstance({
      baseUrl: import.meta.env.VITE_ADOBE_COMMERCE_URL,
      accessToken: import.meta.env.VITE_ADOBE_COMMERCE_ACCESS_TOKEN
    });
  }

  public static getInstance(): CollectionService {
    if (!CollectionService.instance) {
      CollectionService.instance = new CollectionService();
    }
    return CollectionService.instance;
  }

  async getCollections(): Promise<Collection[]> {
    return this.adobeCommerceService.get('/collections');
  }

  async getCollection(id: string): Promise<Collection> {
    return this.adobeCommerceService.get(`/collections/${id}`);
  }

  async createCollection(collection: CollectionFormData): Promise<Collection> {
    return this.adobeCommerceService.post('/collections', collection);
  }

  async updateCollection(id: string, collection: Partial<CollectionFormData>): Promise<Collection> {
    return this.adobeCommerceService.put(`/collections/${id}`, collection);
  }

  async deleteCollection(id: string): Promise<void> {
    return this.adobeCommerceService.delete(`/collections/${id}`);
  }

  async updateCollectionPositions(positions: { id: string; position: number }[]): Promise<void> {
    return this.adobeCommerceService.put('/collections/positions', { positions });
  }

  async getCollectionProducts(id: string): Promise<any[]> {
    return this.adobeCommerceService.get(`/collections/${id}/products`);
  }

  async updateCollectionProducts(id: string, productIds: string[]): Promise<void> {
    return this.adobeCommerceService.put(`/collections/${id}/products`, { productIds });
  }
}
