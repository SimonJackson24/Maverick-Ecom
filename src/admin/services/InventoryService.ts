import { InventoryAlert, InventorySettings, InventoryTransaction, InventoryUpdateInput, StockLevel } from '../types/inventory';

class InventoryService {
  private static instance: InventoryService;
  private settings: InventorySettings = {
    lowStockThreshold: 10,
    outOfStockThreshold: 0,
    enableAutoReorder: false,
    autoReorderThreshold: 5,
    notifyAdminsOnLowStock: true,
    notifySupplierOnLowStock: false,
  };

  private constructor() {}

  static getInstance(): InventoryService {
    if (!InventoryService.instance) {
      InventoryService.instance = new InventoryService();
    }
    return InventoryService.instance;
  }

  async updateInventory(input: InventoryUpdateInput): Promise<InventoryTransaction> {
    try {
      // 1. Get current stock level
      const currentStock = await this.getCurrentStock(input.productId);
      
      // 2. Calculate new stock level
      const newStock = currentStock + input.quantity;
      
      // 3. Create transaction record
      const transaction: InventoryTransaction = {
        id: `inv_${Date.now()}`,
        productId: input.productId,
        quantity: input.quantity,
        previousStock: currentStock,
        newStock: newStock,
        reason: input.reason,
        notes: input.notes,
        createdAt: new Date().toISOString(),
        createdBy: 'system', // Should come from auth context
      };

      // 4. Update stock level in database
      await this.saveTransaction(transaction);
      
      // 5. Check if we need to create alerts
      await this.checkAndCreateAlerts(input.productId, newStock);

      return transaction;
    } catch (error) {
      console.error('Error updating inventory:', error);
      throw new Error('Failed to update inventory');
    }
  }

  async checkAndCreateAlerts(productId: string, currentStock: number): Promise<void> {
    const stockLevel = await this.calculateStockLevel(productId, currentStock);
    
    if (stockLevel === 'LOW_STOCK' || stockLevel === 'OUT_OF_STOCK') {
      const alert: InventoryAlert = {
        id: `alert_${Date.now()}`,
        productId,
        productName: await this.getProductName(productId),
        currentStock,
        threshold: this.settings.lowStockThreshold,
        status: stockLevel,
        createdAt: new Date().toISOString(),
      };

      await this.createAlert(alert);

      if (this.settings.notifyAdminsOnLowStock) {
        await this.notifyAdmins(alert);
      }

      if (this.settings.notifySupplierOnLowStock && stockLevel === 'LOW_STOCK') {
        await this.notifySupplier(alert);
      }

      if (this.settings.enableAutoReorder && currentStock <= this.settings.autoReorderThreshold) {
        await this.triggerAutoReorder(productId);
      }
    }
  }

  private async calculateStockLevel(productId: string, currentStock: number): Promise<StockLevel> {
    if (currentStock <= this.settings.outOfStockThreshold) {
      return 'OUT_OF_STOCK';
    }
    if (currentStock <= this.settings.lowStockThreshold) {
      return 'LOW_STOCK';
    }
    return 'IN_STOCK';
  }

  // These methods would be implemented to interact with your actual database and services
  private async getCurrentStock(productId: string): Promise<number> {
    // TODO: Implement database query
    return 0;
  }

  private async getProductName(productId: string): Promise<string> {
    // TODO: Implement database query
    return 'Product Name';
  }

  private async saveTransaction(transaction: InventoryTransaction): Promise<void> {
    // TODO: Implement database save
  }

  private async createAlert(alert: InventoryAlert): Promise<void> {
    // TODO: Implement database save
  }

  private async notifyAdmins(alert: InventoryAlert): Promise<void> {
    // TODO: Implement admin notification (email, SMS, etc.)
  }

  private async notifySupplier(alert: InventoryAlert): Promise<void> {
    // TODO: Implement supplier notification
  }

  private async triggerAutoReorder(productId: string): Promise<void> {
    // TODO: Implement auto-reorder logic
  }

  // Settings management
  async updateSettings(settings: Partial<InventorySettings>): Promise<void> {
    this.settings = { ...this.settings, ...settings };
    // TODO: Save settings to database
  }

  async getSettings(): Promise<InventorySettings> {
    // TODO: Load settings from database
    return this.settings;
  }
}

export default InventoryService;
