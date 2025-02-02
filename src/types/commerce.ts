export interface Price {
  value: number;
  currency: string;
}

export interface Image {
  url: string;
  label: string;
}

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
  description: {
    html: string;
  };
  meta_description?: string;
  image: Image;
  media_gallery: Image[];
  eco_friendly_features?: string[];
  sustainable_materials?: string[];
  stock_status: 'IN_STOCK' | 'OUT_OF_STOCK';
  categories: Array<{
    id: string;
    name: string;
    url_path: string;
  }>;
}

export interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
  prices: {
    subtotal_excluding_tax: Price;
    subtotal_including_tax: Price;
    discounts?: Array<{
      amount: Price;
      label: string;
    }>;
  };
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
  id: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  nameOnCard: string;
}

export interface Order {
  order_number: string;
  order_id: string;
  items: CartItem[];
  shipping_address: ShippingAddress;
  billing_address: ShippingAddress;
  payment_method: {
    code: string;
    title: string;
  };
  shipping_method: {
    carrier_code: string;
    carrier_title: string;
    method_code: string;
    method_title: string;
    amount: Price;
  };
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
}
