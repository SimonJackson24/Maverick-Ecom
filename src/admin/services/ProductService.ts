import AdobeCommerceService from '../../services/AdobeCommerceService';
import { Product, ProductInput, BulkOperationResult } from '../types/product';
import { PaginationInput, SortInput } from '../types/common';

export class ProductService {
  private static commerceService = AdobeCommerceService.getInstance({
    baseUrl: import.meta.env.VITE_ADOBE_COMMERCE_URL || '',
    accessToken: import.meta.env.VITE_ADOBE_COMMERCE_ACCESS_TOKEN || '',
  });

  static async getProducts(
    pagination: PaginationInput,
    sort: SortInput,
    filters?: Record<string, any>
  ) {
    try {
      const response = await this.commerceService.getProducts({
        searchCriteria: {
          filterGroups: this.buildFilterGroups(filters),
          sortOrders: [{
            field: sort.field,
            direction: sort.direction
          }],
          pageSize: pagination.perPage,
          currentPage: pagination.page
        }
      });

      return {
        items: response.items.map(this.mapCommerceProduct),
        total: response.total_count,
        pageInfo: {
          hasNextPage: (pagination.page * pagination.perPage) < response.total_count,
          hasPreviousPage: pagination.page > 1
        }
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        items: [],
        total: 0,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false
        }
      };
    }
  }

  static async getProduct(id: string) {
    try {
      const response = await this.commerceService.getProduct(id);
      return this.mapCommerceProduct(response);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  static async createProduct(input: ProductInput) {
    try {
      const commerceProduct = this.mapToCommerceProduct(input);
      const response = await this.commerceService.createProduct({
        product: commerceProduct
      });
      return this.mapCommerceProduct(response);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  static async updateProduct(id: string, input: Partial<ProductInput>) {
    try {
      const commerceProduct = this.mapToCommerceProduct(input);
      const response = await this.commerceService.updateProduct(id, {
        product: commerceProduct
      });
      return this.mapCommerceProduct(response);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  static async deleteProduct(id: string) {
    try {
      await this.commerceService.deleteProduct(id);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  static async updateStock(id: string, quantity: number, isInStock?: boolean) {
    try {
      await this.commerceService.updateStockItem(id, {
        stockItem: {
          qty: quantity,
          isInStock: isInStock ?? quantity > 0
        }
      });
      return true;
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }

  private static buildFilterGroups(filters?: Record<string, any>) {
    if (!filters) return [];

    const filterGroups = [];

    if (filters.status && filters.status !== 'all') {
      filterGroups.push({
        filters: [{
          field: 'status',
          value: filters.status,
          conditionType: 'eq'
        }]
      });
    }

    if (filters.stockStatus && filters.stockStatus !== 'all') {
      filterGroups.push({
        filters: [{
          field: 'quantity_and_stock_status',
          value: filters.stockStatus,
          conditionType: 'eq'
        }]
      });
    }

    if (filters.search) {
      filterGroups.push({
        filters: [{
          field: 'name',
          value: `%${filters.search}%`,
          conditionType: 'like'
        }]
      });
    }

    return filterGroups;
  }

  private static mapCommerceProduct(commerceProduct: any): Product {
    return {
      id: commerceProduct.id,
      name: commerceProduct.name,
      sku: commerceProduct.sku,
      price: {
        regularPrice: {
          amount: {
            value: commerceProduct.price,
            currency: 'USD' // Get from store config in production
          }
        }
      },
      status: commerceProduct.status === 1 ? 'ACTIVE' : 'INACTIVE',
      stockStatus: this.mapStockStatus(commerceProduct.extension_attributes?.stock_item),
      scentProfile: this.extractScentProfile(commerceProduct.custom_attributes),
      description: commerceProduct.description || '',
      shortDescription: commerceProduct.short_description || '',
      images: commerceProduct.media_gallery_entries || [],
      categories: commerceProduct.extension_attributes?.category_links || [],
      attributes: commerceProduct.custom_attributes || []
    };
  }

  private static mapToCommerceProduct(input: Partial<ProductInput>) {
    return {
      sku: input.sku,
      name: input.name,
      price: input.price?.regularPrice.amount.value,
      status: input.status === 'ACTIVE' ? 1 : 2,
      visibility: 4, // Visible in Catalog, Search
      typeId: 'simple',
      attributeSetId: 4, // Default attribute set
      weight: input.weight || 0,
      customAttributes: this.mapScentProfile(input.scentProfile)
    };
  }

  private static mapStockStatus(stockItem?: any) {
    if (!stockItem) return 'OUT_OF_STOCK';
    
    if (stockItem.is_in_stock) {
      return stockItem.qty > stockItem.min_qty ? 'IN_STOCK' : 'LOW_STOCK';
    }
    
    return 'OUT_OF_STOCK';
  }

  private static extractScentProfile(customAttributes?: any[]) {
    if (!customAttributes) return null;

    const profile: any = {};
    const scentAttributes = [
      'primary_notes',
      'middle_notes',
      'base_notes',
      'intensity',
      'mood',
      'season'
    ];

    customAttributes.forEach(attr => {
      if (scentAttributes.includes(attr.attribute_code)) {
        profile[attr.attribute_code] = attr.value;
      }
    });

    return Object.keys(profile).length > 0 ? profile : null;
  }

  private static mapScentProfile(profile: any) {
    if (!profile) return [];

    return Object.entries(profile).map(([key, value]) => ({
      attribute_code: key,
      value: value
    }));
  }
}
