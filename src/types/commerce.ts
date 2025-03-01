export interface Price {
  value: number;
  currency: string;
}

export interface Image {
  url: string;
  label: string;
}

export interface ScentProfile {
  primary_scent: string;
  scent_family: string;
  scent_notes: string[];
  intensity: 'light' | 'medium' | 'strong';
}

export interface RelatedProducts {
  items: Product[];
}

export interface CustomAttribute {
  attribute_code: string;
  value: string | number | boolean | string[];
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  url_key: string;
  price: {
    regularPrice: {
      amount: {
        value: number;
        currency: string;
      };
    };
    minimalPrice?: {
      amount: {
        value: number;
        currency: string;
      };
    };
  };
  image: {
    url: string;
    label: string;
  };
  description: {
    html: string;
  };
  meta_description?: string;
  media_gallery: Image[];
  eco_friendly_features?: string[];
  sustainable_materials?: string[];
  stock_status: 'IN_STOCK' | 'OUT_OF_STOCK' | 'PREORDER';
  categories: Array<{
    id: string;
    name: string;
    url_path: string;
  }>;
  rating_summary?: number;
  review_count?: number;
  scent_profile?: ScentProfile;
  custom_attributes?: Record<string, string | number | boolean | string[]>;
  related_products?: RelatedProducts;
}

export interface CartItemPrices {
  row_total: Price;
  row_total_including_tax: Price;
  total_item_discount?: Price;
}

export interface CartItem {
  id: string;
  quantity: number;
  product: Product;
  prices: CartItemPrices;
}

export interface CartPrices {
  subtotal_excluding_tax: Price;
  subtotal_including_tax: Price;
  shipping_estimate?: Price;
  tax_estimate?: Price;
  discounts?: Array<{
    amount: Price;
    label: string;
  }>;
  total: Price;
}

export interface Cart {
  id: string;
  items: CartItem[];
  prices: CartPrices;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  region: string;
  postcode: string;
  telephone: string;
  email: string;
}

export interface PaymentMethod {
  code: string;
  title: string;
}

export interface ShippingMethod {
  carrier_code: string;
  carrier_title: string;
  method_code: string;
  method_title: string;
  amount: Price;
}

export interface Order {
  order_number: string;
  order_id: string;
  items: CartItem[];
  shipping_address: ShippingAddress;
  billing_address: ShippingAddress;
  payment_method: PaymentMethod;
  shipping_method: ShippingMethod;
  prices: {
    subtotal: Price;
    shipping: Price;
    tax: Price;
    discounts?: Array<{
      amount: Price;
      label: string;
    }>;
    total: Price;
  };
  status: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  url_path: string;
  image?: string;
  products: {
    items: Product[];
    total_count: number;
    page_info: {
      current_page: number;
      page_size: number;
      total_pages: number;
    };
  };
}

export interface CustomerAddress {
  id: string;
  firstname: string;
  lastname: string;
  street: string[];
  city: string;
  region: {
    region_code: string;
    region: string;
  };
  postcode: string;
  country_code: string;
  telephone: string;
  default_shipping?: boolean;
  default_billing?: boolean;
}

export interface Customer {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  addresses: CustomerAddress[];
  orders?: Order[];
}
