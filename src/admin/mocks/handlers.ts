import { graphql, http, HttpResponse } from 'msw';
import { v4 as uuidv4 } from 'uuid';

// Mock data
const mockInventoryAlerts = [
  {
    id: '1',
    productId: 'prod_1',
    productName: 'Lavender Candle',
    currentStock: 5,
    threshold: 10,
    status: 'LOW_STOCK',
    createdAt: new Date().toISOString(),
  },
];

const mockInventorySettings = {
  lowStockThreshold: 10,
  outOfStockThreshold: 0,
  enableAutoReorder: false,
  autoReorderThreshold: 5,
  notifyAdminsOnLowStock: true,
  notifySupplierOnLowStock: false,
};

const mockFulfillments = [
  {
    id: '1',
    orderId: 'order_1',
    status: 'PENDING',
    items: [
      {
        id: 'item_1',
        productId: 'prod_1',
        productName: 'Lavender Candle',
        sku: 'LAV-001',
        quantity: 2,
        pickedQuantity: 0,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockPickLists = [
  {
    id: '1',
    fulfillmentIds: ['1'],
    status: 'PENDING',
    items: [
      {
        productId: 'prod_1',
        productName: 'Lavender Candle',
        sku: 'LAV-001',
        totalQuantity: 2,
        pickedQuantity: 0,
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

// Handlers
export const handlers = [
  // Inventory Queries
  graphql.query('GetInventoryAlerts', () => {
    return HttpResponse.json({
      data: {
        inventoryAlerts: mockInventoryAlerts,
      },
    });
  }),

  graphql.query('GetInventorySettings', () => {
    return HttpResponse.json({
      data: {
        inventorySettings: mockInventorySettings,
      },
    });
  }),

  graphql.query('GetInventoryStats', () => {
    return HttpResponse.json({
      data: {
        inventoryStats: {
          lowStockCount: 5,
          totalProducts: 42,
          pendingRestocks: 3,
          __typename: 'InventoryStats',
        },
      },
    });
  }),

  // Inventory Mutations
  graphql.mutation('UpdateInventorySettings', (req) => {
    const { input } = req.variables;
    Object.assign(mockInventorySettings, input);
    return HttpResponse.json({
      data: {
        inventorySettings: mockInventorySettings,
      },
    });
  }),

  graphql.mutation('AcknowledgeInventoryAlert', (req) => {
    const { id } = req.variables;
    const alert = mockInventoryAlerts.find((a) => a.id === id);
    if (alert) {
      alert.acknowledgedAt = new Date().toISOString();
    }
    return HttpResponse.json({
      data: {
        acknowledgeInventoryAlert: alert,
      },
    });
  }),

  // Fulfillment Queries
  graphql.query('GetFulfillments', () => {
    return HttpResponse.json({
      data: {
        fulfillments: mockFulfillments,
      },
    });
  }),

  graphql.query('GetPickLists', () => {
    return HttpResponse.json({
      data: {
        pickLists: mockPickLists,
      },
    });
  }),

  // Fulfillment Mutations
  graphql.mutation('CreatePickList', (req) => {
    const { fulfillmentIds } = req.variables;
    const newPickList = {
      id: uuidv4(),
      fulfillmentIds,
      status: 'PENDING',
      items: [],
      createdAt: new Date().toISOString(),
    };
    mockPickLists.push(newPickList);
    return HttpResponse.json({
      data: {
        createPickList: newPickList,
      },
    });
  }),

  graphql.mutation('UpdateFulfillmentStatus', (req) => {
    const { id, status } = req.variables;
    const fulfillment = mockFulfillments.find((f) => f.id === id);
    if (fulfillment) {
      fulfillment.status = status;
      fulfillment.updatedAt = new Date().toISOString();
    }
    return HttpResponse.json({
      data: {
        updateFulfillmentStatus: fulfillment,
      },
    });
  }),

  graphql.mutation('UpdatePickList', (req) => {
    const { id, items } = req.variables;
    const pickList = mockPickLists.find((pl) => pl.id === id);
    if (pickList) {
      items.forEach((update: any) => {
        const item = pickList.items.find((i) => i.productId === update.productId);
        if (item) {
          item.pickedQuantity = update.pickedQuantity;
        }
      });
    }
    return HttpResponse.json({
      data: {
        updatePickList: pickList,
      },
    });
  }),

  graphql.mutation('CompletePickList', (req) => {
    const { id } = req.variables;
    const pickList = mockPickLists.find((pl) => pl.id === id);
    if (pickList) {
      pickList.status = 'COMPLETED';
      pickList.completedAt = new Date().toISOString();
    }
    return HttpResponse.json({
      data: {
        completePickList: pickList,
      },
    });
  }),
];
