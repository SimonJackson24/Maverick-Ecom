export type FulfillmentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'PICKED'
  | 'PACKED'
  | 'READY_FOR_SHIPPING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'ON_HOLD';

export interface FulfillmentItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  pickedQuantity: number;
  location?: string;
  notes?: string;
}

export interface Fulfillment {
  id: string;
  orderId: string;
  status: FulfillmentStatus;
  items: FulfillmentItem[];
  pickedBy?: string;
  packedBy?: string;
  shippingLabel?: {
    provider: string;
    trackingNumber: string;
    url: string;
    createdAt: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FulfillmentStep {
  id: string;
  fulfillmentId: string;
  status: FulfillmentStatus;
  completedBy?: string;
  completedAt?: string;
  notes?: string;
}

export interface PickList {
  id: string;
  fulfillmentIds: string[];
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  assignedTo?: string;
  items: Array<{
    productId: string;
    productName: string;
    sku: string;
    location?: string;
    totalQuantity: number;
    pickedQuantity: number;
  }>;
  createdAt: string;
  completedAt?: string;
}

export interface PackingSlip {
  id: string;
  fulfillmentId: string;
  orderNumber: string;
  customerName: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    productName: string;
    sku: string;
    quantity: number;
  }>;
  specialInstructions?: string;
  createdAt: string;
}
