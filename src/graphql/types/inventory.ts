export interface InventoryStats {
  lowStockCount: number;
  outOfStockCount: number;
  totalProducts: number;
  totalStock: number;
  recentTransactions: InventoryTransaction[];
  topLowStock: LowStockProduct[];
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  type: 'SALE' | 'RESTOCK';
  createdAt: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  currentStock: number;
  threshold: number;
}

export interface InventorySettings {
  lowStockThreshold: number;
  outOfStockThreshold: number;
  enableAutoReorder: boolean;
  autoReorderThreshold: number;
  notifyAdminsOnLowStock: boolean;
  notifySupplierOnLowStock: boolean;
}

export interface UpdateInventorySettingsInput {
  lowStockThreshold?: number;
  outOfStockThreshold?: number;
  enableAutoReorder?: boolean;
  autoReorderThreshold?: number;
  notifyAdminsOnLowStock?: boolean;
  notifySupplierOnLowStock?: boolean;
}

export interface InventoryUpdateInput {
  productId: string;
  quantity: number;
  reason?: string;
  notes?: string;
}

export interface InventoryStatsResponse {
  inventoryStats: InventoryStats;
}

export interface InventorySettingsResponse {
  inventorySettings: InventorySettings;
}

export interface InventoryAlertResponse {
  inventoryAlerts: InventoryAlert[];
}

export interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  status: string;
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export interface AcknowledgeAlertResponse {
  acknowledgeInventoryAlert: InventoryAlert;
}

export interface ResolveAlertResponse {
  resolveInventoryAlert: InventoryAlert;
}

export interface InventoryTransactionResponse {
  updateInventory: InventoryTransaction;
}
