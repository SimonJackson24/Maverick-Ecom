export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT'
}

export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK'
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  position: number;
  isMain: boolean;
}

export interface ScentProfile {
  category?: string;
  primaryNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  intensity: number;
  season?: string[];
  mood?: string[];
}

export interface ProductSeo {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: string;
}

export interface ProductDimensions {
  weight: number;
  height: number;
  width: number;
  length: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  stockQuantity: number;
  attributes: Record<string, string>;
}

export interface ProductMetaData {
  ingredients?: string[];
  burnTime?: string;
  fragrance?: string;
  scentStrength?: 'light' | 'medium' | 'strong';
  sustainabilityInfo?: string;
  careInstructions?: string;
  warnings?: string[];
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  slug: string;
  price: {
    regularPrice: {
      amount: {
        value: number;
        currency: string;
      };
    };
    salePrice?: {
      amount: {
        value: number;
        currency: string;
      };
      startDate?: string;
      endDate?: string;
    };
  };
  description: string;
  shortDescription: string;
  status: ProductStatus;
  stockStatus: StockStatus;
  stockQuantity: number;
  lowStockThreshold?: number;
  
  // Media
  images: ProductImage[];
  videos?: string[];
  
  // Scent Profile
  scentProfile: ScentProfile;
  
  // SEO
  seo: ProductSeo;
  
  // Physical attributes
  dimensions: ProductDimensions;
  
  // Categories and organization
  categories: string[];
  tags: string[];
  collections: string[];
  
  // Variants
  hasVariants: boolean;
  variants?: ProductVariant[];
  
  // Inventory settings
  backorderable: boolean;
  preorderable: boolean;
  expectedRestockDate?: string;
  
  // Marketing flags
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  
  // Metadata
  metaData?: ProductMetaData;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ProductInput extends Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'averageRating' | 'reviewCount'> {
  // Additional fields specific to product creation
  generateSlug?: boolean;
}

export interface BulkOperationResult {
  success: boolean;
  message: string;
  failedItems?: string[];
}
