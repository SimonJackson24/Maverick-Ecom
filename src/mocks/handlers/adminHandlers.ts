import { graphql, HttpResponse } from 'msw';
import { AdminUser, DashboardStats, Customer } from '../../types/admin';

const mockAdminUser: AdminUser = {
  id: '1',
  name: 'Admin User',
  email: 'admin@wickandwax.co',
  role: 'admin',
  permissions: [
    'view_dashboard',
    'view_products',
    'create_products',
    'view_categories',
    'view_scents',
    'view_collections',
    'view_orders',
    'view_customers',
    'view_customer_groups',
    'view_reviews',
    'view_marketing',
    'view_promotions',
    'view_email_campaigns',
    'view_discounts',
    'view_content',
    'view_pages',
    'view_blog',
    'view_media',
    'view_settings',
    'manage_users'
  ],
  lastLogin: new Date().toISOString(),
  twoFactorEnabled: false,
};

// Mock dashboard data
const mockDashboardStats: DashboardStats = {
  customers: {
    total: 850,
    new: 125,
    returning: 725,
    percentageChange: 15.3,
    recentCustomers: Array.from({ length: 5 }, (_, i) => ({
      id: `customer-${i + 1}`,
      name: `New Customer ${i + 1}`,
      email: `newcustomer${i + 1}@example.com`,
      orderCount: Math.floor(Math.random() * 5) + 1,
      totalSpent: Math.floor(Math.random() * 500) + 100,
      lastOrderDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      totalOrders: Math.floor(Math.random() * 10) + 1,
    })),
  },
  revenue: {
    total: 125000,
    previousPeriod: 100000,
    percentageChange: 25,
    breakdown: Array.from({ length: 12 }, (_, i) => ({
      period: `2024-${(i + 1).toString().padStart(2, '0')}`,
      amount: Math.floor(Math.random() * 15000) + 5000,
    })),
  },
  orders: {
    total: 450,
    pending: 25,
    processing: 50,
    shipped: 300,
    delivered: 250,
    cancelled: 25,
    percentageChange: 12.5,
    recentOrders: Array.from({ length: 5 }, (_, i) => ({
      id: `order-${i + 1}`,
      orderNumber: `WW-${(1000 + i + 1).toString()}`,
      customer: {
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
      },
      status: ['pending', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
      total: Math.floor(Math.random() * 200) + 50,
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    })),
  },
  products: {
    total: 150,
    outOfStock: 5,
    lowStock: 15,
    topSellers: Array.from({ length: 5 }, (_, i) => ({
      id: `product-${i + 1}`,
      name: `Top Selling Candle ${i + 1}`,
      sku: `CANDLE-${(i + 1).toString().padStart(3, '0')}`,
      price: Math.floor(Math.random() * 50) + 20,
      quantitySold: Math.floor(Math.random() * 100) + 50,
      revenue: Math.floor(Math.random() * 5000) + 1000,
    })),
  },
  inventory: {
    totalValue: 75000,
    totalItems: 2500,
    lowStockItems: Array.from({ length: 3 }, (_, i) => ({
      id: `low-stock-${i + 1}`,
      name: `Low Stock Item ${i + 1}`,
      sku: `LOW-${(i + 1).toString().padStart(3, '0')}`,
      quantity: Math.floor(Math.random() * 10) + 1,
      reorderPoint: 15,
    })),
    outOfStockItems: Array.from({ length: 2 }, (_, i) => ({
      id: `out-of-stock-${i + 1}`,
      name: `Out of Stock Item ${i + 1}`,
      sku: `OUT-${(i + 1).toString().padStart(3, '0')}`,
      lastInStock: new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
    })),
  },
  marketing: {
    activePromotions: 3,
    emailSubscribers: 2500,
    campaignPerformance: Array.from({ length: 3 }, (_, i) => ({
      id: `campaign-${i + 1}`,
      name: `Campaign ${i + 1}`,
      type: ['email', 'social', 'display'][i % 3],
      status: ['active', 'scheduled', 'completed'][i % 3],
      startDate: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
      metrics: {
        impressions: Math.floor(Math.random() * 10000) + 1000,
        clicks: Math.floor(Math.random() * 1000) + 100,
        conversions: Math.floor(Math.random() * 100) + 10,
        revenue: Math.floor(Math.random() * 5000) + 500,
      },
    })),
  },
  systemHealth: {
    status: 'healthy',
    uptime: 99.99,
    lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    pendingUpdates: 2,
    errors: {
      count: 0,
      recent: [],
    },
  },
};

export const adminHandlers = [
  // Admin login
  graphql.mutation('AdminLogin', () => {
    return HttpResponse.json({
      data: {
        adminLogin: {
          token: 'mock-jwt-token',
          user: mockAdminUser,
        },
      },
    });
  }),

  // Get admin user
  graphql.query('GetAdminUser', () => {
    return HttpResponse.json({
      data: {
        adminUser: mockAdminUser,
      },
    });
  }),

  // Get dashboard stats
  graphql.query('GetDashboardStats', () => {
    return HttpResponse.json({
      data: {
        dashboardStats: mockDashboardStats,
      },
    });
  }),
];
