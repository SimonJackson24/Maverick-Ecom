import { graphql, HttpResponse } from 'msw';

// Mock data for products with inventory information
const mockProducts = [
  {
    id: 'P1',
    name: 'Lavender Dreams Candle',
    sku: 'LAV-001',
    stockLevel: 25,
    lowStockThreshold: 10,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'P2',
    name: 'Ocean Breeze Diffuser',
    sku: 'OBD-001',
    stockLevel: 50,
    lowStockThreshold: 15,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'P3',
    name: 'Vanilla Bean Candle',
    sku: 'VAN-001',
    stockLevel: 8,
    lowStockThreshold: 10,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'P4',
    name: 'Citrus Grove Wax Melts',
    sku: 'CIT-001',
    stockLevel: 5,
    lowStockThreshold: 15,
    lastUpdated: new Date().toISOString(),
  },
];

const mockStockHistory = new Map();

const mockInventoryStats = {
  lowStockCount: mockProducts.filter(p => p.stockLevel <= p.lowStockThreshold).length,
  outOfStockCount: mockProducts.filter(p => p.stockLevel === 0).length,
  totalProducts: mockProducts.length,
  totalStock: mockProducts.reduce((sum, p) => sum + p.stockLevel, 0),
  recentTransactions: [
    {
      id: '1',
      productId: 'P1',
      productName: 'Lavender Dreams Candle',
      quantity: -5,
      type: 'SALE',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      productId: 'P2',
      productName: 'Ocean Breeze Diffuser',
      quantity: 50,
      type: 'RESTOCK',
      createdAt: new Date().toISOString(),
    },
  ],
  topLowStock: mockProducts
    .filter(p => p.stockLevel <= p.lowStockThreshold)
    .map(p => ({
      id: p.id,
      name: p.name,
      currentStock: p.stockLevel,
      threshold: p.lowStockThreshold,
    })),
};

const mockInventorySettings = {
  lowStockThreshold: 10,
  outOfStockThreshold: 0,
  enableAutoReorder: true,
  autoReorderThreshold: 5,
  notifyAdminsOnLowStock: true,
  notifySupplierOnLowStock: true,
};

export const inventoryHandlers = [
  // Get all products with inventory information
  graphql.query('GetProductsInventory', () => {
    return HttpResponse.json({
      data: {
        products: mockProducts,
      },
    });
  }),

  // Update stock level
  graphql.mutation('UpdateStockLevel', ({ variables }) => {
    const product = mockProducts.find(p => p.id === variables.productId);
    if (product) {
      product.stockLevel = variables.quantity;
      product.lastUpdated = new Date().toISOString();

      // Update inventory stats
      mockInventoryStats.lowStockCount = mockProducts.filter(p => p.stockLevel <= p.lowStockThreshold).length;
      mockInventoryStats.outOfStockCount = mockProducts.filter(p => p.stockLevel === 0).length;
      mockInventoryStats.totalStock = mockProducts.reduce((sum, p) => sum + p.stockLevel, 0);
      mockInventoryStats.topLowStock = mockProducts
        .filter(p => p.stockLevel <= p.lowStockThreshold)
        .map(p => ({
          id: p.id,
          name: p.name,
          currentStock: p.stockLevel,
          threshold: p.lowStockThreshold,
        }));

      return HttpResponse.json({
        data: {
          updateStockLevel: product,
        },
      });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // Log stock adjustment
  graphql.mutation('LogStockAdjustment', ({ variables }) => {
    const adjustment = {
      id: Math.random().toString(36).substr(2, 9),
      productId: variables.productId,
      ...variables.adjustment,
      timestamp: new Date().toISOString(),
      performedBy: {
        id: 'ADMIN1',
        name: 'Admin User',
      },
    };

    // Store adjustment in history
    if (!mockStockHistory.has(variables.productId)) {
      mockStockHistory.set(variables.productId, []);
    }
    mockStockHistory.get(variables.productId).unshift(adjustment);

    // Add to recent transactions
    mockInventoryStats.recentTransactions.unshift({
      id: adjustment.id,
      productId: variables.productId,
      productName: mockProducts.find(p => p.id === variables.productId)?.name,
      quantity: adjustment.quantity,
      type: adjustment.type.toUpperCase(),
      createdAt: adjustment.timestamp,
    });

    // Keep only recent transactions
    if (mockInventoryStats.recentTransactions.length > 10) {
      mockInventoryStats.recentTransactions.pop();
    }

    return HttpResponse.json({
      data: {
        logStockAdjustment: adjustment,
      },
    });
  }),

  // Get stock history for a product
  graphql.query('GetStockHistory', ({ variables }) => {
    const history = mockStockHistory.get(variables.productId) || [];
    const limit = variables.limit || history.length;
    
    return HttpResponse.json({
      data: {
        stockHistory: history.slice(0, limit),
      },
    });
  }),

  // Get inventory statistics
  graphql.query('GetInventoryStats', () => {
    return HttpResponse.json({
      data: {
        inventoryStats: mockInventoryStats,
      },
    });
  }),

  // Get inventory settings
  graphql.query('GetInventorySettings', () => {
    return HttpResponse.json({
      data: {
        inventorySettings: mockInventorySettings,
      },
    });
  }),

  // Update inventory settings
  graphql.mutation('UpdateInventorySettings', ({ variables }) => {
    Object.assign(mockInventorySettings, variables.input);
    return HttpResponse.json({
      data: {
        updateInventorySettings: mockInventorySettings,
      },
    });
  }),
];
