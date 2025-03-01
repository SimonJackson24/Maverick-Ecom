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

export type PickListStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

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

export interface ShippingLabel {
  provider: string;
  trackingNumber: string;
  url: string;
  createdAt: string;
}

export interface Fulfillment {
  id: string;
  orderId: string;
  status: FulfillmentStatus;
  items: FulfillmentItem[];
  pickedBy?: string;
  packedBy?: string;
  shippingLabel?: ShippingLabel;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PickListItem {
  productId: string;
  productName: string;
  sku: string;
  location?: string;
  totalQuantity: number;
  pickedQuantity: number;
}

export interface PickList {
  id: string;
  fulfillmentIds: string[];
  status: PickListStatus;
  assignedTo?: string;
  items: PickListItem[];
  createdAt: string;
  completedAt?: string;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PackingSlip {
  id: string;
  fulfillmentId: string;
  orderNumber: string;
  customerName: string;
  shippingAddress: ShippingAddress;
  items: Array<{
    productName: string;
    sku: string;
    quantity: number;
  }>;
  specialInstructions?: string;
  createdAt: string;
}

// Query Response Types
export interface GetFulfillmentsResponse {
  fulfillments: Fulfillment[];
}

export interface GetFulfillmentResponse {
  fulfillment: Fulfillment;
}

export interface GetPickListsResponse {
  pickLists: PickList[];
}

// Mutation Input Types
export interface UpdatePickListItemInput {
  productId: string;
  pickedQuantity: number;
}

// Mutation Response Types
export interface CreatePickListResponse {
  createPickList: PickList;
}

export interface UpdateFulfillmentStatusResponse {
  updateFulfillmentStatus: Fulfillment;
}

export interface UpdatePickListResponse {
  updatePickList: PickList;
}

export interface CompletePickListResponse {
  completePickList: PickList;
}

export interface GeneratePackingSlipResponse {
  generatePackingSlip: PackingSlip;
}

// Subscription Response Types
export interface FulfillmentUpdatedResponse {
  fulfillmentUpdated: Fulfillment;
}

export interface PickListUpdatedResponse {
  pickListUpdated: PickList;
}
