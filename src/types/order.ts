import { Product } from './product';

export interface Order {
  id: string;
  userId?: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  orderId: string;
  product: Product;
  quantity: number;
  priceAtTime: number;
  createdAt: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email?: string;
  isDefault?: boolean;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
  total: number;
}

export interface OrderFilter {
  userId?: string;
  status?: OrderStatus[];
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: 'date' | 'amount' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface OrderSearchResult {
  items: Order[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface OrderTracking {
  orderId: string;
  trackingNumber: string;
  carrier: string;
  status: OrderStatus;
  estimatedDeliveryDate?: string;
  events: OrderTrackingEvent[];
}

export interface OrderTrackingEvent {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

export interface OrderAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<OrderStatus, number>;
  topProducts: {
    product: Product;
    quantity: number;
    revenue: number;
  }[];
  ordersByDay: {
    date: string;
    orders: number;
    revenue: number;
  }[];
}
