import { Fulfillment, FulfillmentItem, FulfillmentStatus, PackingSlip, PickList } from '../types/fulfillment';
import InventoryService from './InventoryService';

class FulfillmentService {
  private static instance: FulfillmentService;
  private inventoryService: InventoryService;

  private constructor() {
    this.inventoryService = InventoryService.getInstance();
  }

  static getInstance(): FulfillmentService {
    if (!FulfillmentService.instance) {
      FulfillmentService.instance = new FulfillmentService();
    }
    return FulfillmentService.instance;
  }

  async createFulfillment(orderId: string, items: FulfillmentItem[]): Promise<Fulfillment> {
    try {
      const fulfillment: Fulfillment = {
        id: `ful_${Date.now()}`,
        orderId,
        status: 'PENDING',
        items,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save fulfillment to database
      await this.saveFulfillment(fulfillment);

      return fulfillment;
    } catch (error) {
      console.error('Error creating fulfillment:', error);
      throw new Error('Failed to create fulfillment');
    }
  }

  async updateFulfillmentStatus(
    fulfillmentId: string,
    status: FulfillmentStatus,
    userId: string,
    notes?: string
  ): Promise<Fulfillment> {
    try {
      const fulfillment = await this.getFulfillment(fulfillmentId);
      
      // Update status and relevant fields
      fulfillment.status = status;
      fulfillment.updatedAt = new Date().toISOString();

      switch (status) {
        case 'PICKED':
          fulfillment.pickedBy = userId;
          break;
        case 'PACKED':
          fulfillment.packedBy = userId;
          break;
        case 'SHIPPED':
          // Update inventory
          for (const item of fulfillment.items) {
            await this.inventoryService.updateInventory({
              productId: item.productId,
              quantity: -item.quantity,
              reason: 'SALE',
              notes: `Fulfillment ${fulfillmentId} shipped`,
            });
          }
          break;
      }

      // Save the updated fulfillment
      await this.saveFulfillment(fulfillment);

      // Create fulfillment step record
      await this.createFulfillmentStep({
        id: `step_${Date.now()}`,
        fulfillmentId,
        status,
        completedBy: userId,
        completedAt: new Date().toISOString(),
        notes,
      });

      return fulfillment;
    } catch (error) {
      console.error('Error updating fulfillment status:', error);
      throw new Error('Failed to update fulfillment status');
    }
  }

  async createPickList(fulfillmentIds: string[]): Promise<PickList> {
    try {
      const fulfillments = await Promise.all(
        fulfillmentIds.map(id => this.getFulfillment(id))
      );

      // Aggregate items from all fulfillments
      const itemMap = new Map<string, PickList['items'][0]>();
      
      for (const fulfillment of fulfillments) {
        for (const item of fulfillment.items) {
          const existing = itemMap.get(item.productId);
          if (existing) {
            existing.totalQuantity += item.quantity;
          } else {
            itemMap.set(item.productId, {
              productId: item.productId,
              productName: item.productName,
              sku: item.sku,
              location: item.location,
              totalQuantity: item.quantity,
              pickedQuantity: 0,
            });
          }
        }
      }

      const pickList: PickList = {
        id: `pick_${Date.now()}`,
        fulfillmentIds,
        status: 'PENDING',
        items: Array.from(itemMap.values()),
        createdAt: new Date().toISOString(),
      };

      await this.savePickList(pickList);

      return pickList;
    } catch (error) {
      console.error('Error creating pick list:', error);
      throw new Error('Failed to create pick list');
    }
  }

  async generatePackingSlip(fulfillmentId: string): Promise<PackingSlip> {
    try {
      const fulfillment = await this.getFulfillment(fulfillmentId);
      const order = await this.getOrder(fulfillment.orderId);

      const packingSlip: PackingSlip = {
        id: `slip_${Date.now()}`,
        fulfillmentId,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        shippingAddress: order.shippingAddress,
        items: fulfillment.items.map(item => ({
          productName: item.productName,
          sku: item.sku,
          quantity: item.quantity,
        })),
        createdAt: new Date().toISOString(),
      };

      await this.savePackingSlip(packingSlip);

      return packingSlip;
    } catch (error) {
      console.error('Error generating packing slip:', error);
      throw new Error('Failed to generate packing slip');
    }
  }

  // These methods would be implemented to interact with your actual database
  private async getFulfillment(fulfillmentId: string): Promise<Fulfillment> {
    // TODO: Implement database query
    throw new Error('Not implemented');
  }

  private async saveFulfillment(fulfillment: Fulfillment): Promise<void> {
    // TODO: Implement database save
  }

  private async createFulfillmentStep(step: any): Promise<void> {
    // TODO: Implement database save
  }

  private async savePickList(pickList: PickList): Promise<void> {
    // TODO: Implement database save
  }

  private async savePackingSlip(packingSlip: PackingSlip): Promise<void> {
    // TODO: Implement database save
  }

  private async getOrder(orderId: string): Promise<any> {
    // TODO: Implement database query
    throw new Error('Not implemented');
  }
}

export default FulfillmentService;
