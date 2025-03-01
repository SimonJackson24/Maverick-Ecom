export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  totalAmount: Money;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
  shippingMethod: string;
}

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: Money;
}

export interface Money {
  value: number;
  currency: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export interface OrderFiltersInput {
  status?: OrderStatus;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}
