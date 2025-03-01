import { Price, Image, ScentProfile } from './commerce';

export interface Product {
  id: string;
  sku: string;
  name: string;
  url_key: string;
  price: {
    regularPrice: {
      amount: Price;
    };
    minimalPrice?: {
      amount: Price;
    };
  };
  image: Image;
  description: {
    html: string;
  };
  meta_description?: string;
  media_gallery: Image[];
  scent_profile?: ScentProfile;
  eco_friendly_features?: string[];
  sustainable_materials?: string[];
  stock_status: 'IN_STOCK' | 'OUT_OF_STOCK' | 'PREORDER';
  categories: {
    id: string;
    name: string;
    url_path: string;
  }[];
  reviews?: {
    average_rating: number;
    total_reviews: number;
  };
  created_at: string;
  updated_at: string;
}

// This is used for admin/management purposes and contains additional fields
export interface CategoryDetail {
  id: string;
  name: string;
  description?: string;
  url_path: string;
  parent_id?: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  customer_id: string;
  order_id: string;
  rating: number;
  title?: string;
  content?: string;
  is_verified_purchase: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  updated_at: string;
}

export interface ProductPerformance extends Omit<Product, 'reviews'> {
  total_orders: number;
  total_units_sold: number;
  total_revenue: number;
  reviews: {
    average_rating: number;
    total_reviews: number;
  };
}

export interface ProductFilter {
  categories?: string[];
  price?: {
    min?: number;
    max?: number;
  };
  scent_profiles?: string[];
  stock_status?: Product['stock_status'][];
  sort?: {
    field: 'price' | 'rating' | 'created_at' | 'popularity';
    direction: 'ASC' | 'DESC';
  };
  pagination?: {
    page: number;
    per_page: number;
  };
}

export interface ProductSearchResult {
  items: Product[];
  total_count: number;
  page_info: {
    current_page: number;
    page_size: number;
    total_pages: number;
  };
}
