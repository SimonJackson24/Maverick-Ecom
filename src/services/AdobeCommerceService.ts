import axios from 'axios';

export interface AdobeCommerceConfig {
  baseUrl: string;
  accessToken: string;
}

class AdobeCommerceService {
  private static instance: AdobeCommerceService;
  private config: AdobeCommerceConfig;

  private constructor(config: AdobeCommerceConfig) {
    this.config = config;
  }

  static getInstance(config: AdobeCommerceConfig): AdobeCommerceService {
    if (!AdobeCommerceService.instance) {
      AdobeCommerceService.instance = new AdobeCommerceService(config);
    }
    return AdobeCommerceService.instance;
  }

  private get axiosInstance() {
    return axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // Product Management
  async getProducts(params: {
    searchCriteria?: {
      filterGroups?: Array<{
        filters: Array<{
          field: string;
          value: string;
          conditionType?: string;
        }>;
      }>;
      sortOrders?: Array<{
        field: string;
        direction: 'ASC' | 'DESC';
      }>;
      pageSize?: number;
      currentPage?: number;
    };
  }) {
    try {
      const response = await this.axiosInstance.get('/rest/V1/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProduct(sku: string) {
    try {
      const response = await this.axiosInstance.get(`/rest/V1/products/${sku}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async createProduct(productData: {
    product: {
      sku: string;
      name: string;
      attributeSetId: number;
      price: number;
      status: number;
      visibility: number;
      typeId: string;
      weight?: number;
      customAttributes?: Array<{
        attributeCode: string;
        value: string;
      }>;
    };
  }) {
    try {
      const response = await this.axiosInstance.post('/rest/V1/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(sku: string, productData: {
    product: {
      name?: string;
      price?: number;
      status?: number;
      visibility?: number;
      customAttributes?: Array<{
        attributeCode: string;
        value: string;
      }>;
    };
  }) {
    try {
      const response = await this.axiosInstance.put(`/rest/V1/products/${sku}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(sku: string) {
    try {
      const response = await this.axiosInstance.delete(`/rest/V1/products/${sku}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Category Management
  async getCategories(params?: {
    rootCategoryId?: number;
    depth?: number;
  }) {
    try {
      const response = await this.axiosInstance.get('/rest/V1/categories', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Inventory Management
  async getStockItems(skus: string[]) {
    try {
      const response = await this.axiosInstance.post('/rest/V1/inventory/items', {
        skus,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching stock items:', error);
      throw error;
    }
  }

  async updateStockItem(sku: string, stockData: {
    stockItem: {
      qty: number;
      isInStock?: boolean;
    };
  }) {
    try {
      const response = await this.axiosInstance.put(`/rest/V1/products/${sku}/stockItems/1`, stockData);
      return response.data;
    } catch (error) {
      console.error('Error updating stock item:', error);
      throw error;
    }
  }
}

export default AdobeCommerceService;
