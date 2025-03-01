export type StockLevel = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  status: StockLevel;
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export interface InventorySettings {
  lowStockThreshold: number; // Percentage or fixed number
  outOfStockThreshold: number;
  enableAutoReorder: boolean;
  autoReorderThreshold: number;
  notifyAdminsOnLowStock: boolean;
  notifySupplierOnLowStock: boolean;
}

export interface InventoryUpdateInput {
  productId: string;
  quantity: number;
  reason: 'SALE' | 'RETURN' | 'ADJUSTMENT' | 'RESTOCK';
  notes?: string;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
}
