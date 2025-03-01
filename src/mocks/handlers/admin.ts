import { graphql } from 'msw';
import { addDays, subDays, format } from 'date-fns';

const generateRevenueData = (days: number) => {
  const data = [];
  const baseAmount = 5000;
  
  for (let i = 0; i < days; i++) {
    const date = subDays(new Date(), i);
    const randomVariation = Math.random() * 2000 - 1000;
    data.push({
      period: format(date, 'MMM dd'),
      amount: Math.max(0, baseAmount + randomVariation),
    });
  }
  
  return data.reverse();
};

const generateRecentOrders = () => {
  const statuses = ['pending', 'processing', 'shipped', 'delivered'];
  const orders = [];
  
  for (let i = 0; i < 10; i++) {
    orders.push({
      id: `order-${i}`,
      orderNumber: `ORD-${Math.floor(Math.random() * 10000)}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      total: Math.floor(Math.random() * 500) + 50,
      createdAt: subDays(new Date(), Math.floor(Math.random() * 7)).toISOString(),
      customer: {
        name: `Customer ${i}`,
        email: `customer${i}@example.com`,
      },
    });
  }
  
  return orders;
};

const generateTopProducts = () => {
  const products = [];
  
  for (let i = 0; i < 5; i++) {
    products.push({
      id: `product-${i}`,
      name: `Top Selling Candle ${i + 1}`,
      sku: `SKU-${1000 + i}`,
      price: Math.floor(Math.random() * 50) + 20,
      quantitySold: Math.floor(Math.random() * 100) + 50,
      revenue: Math.floor(Math.random() * 5000) + 1000,
    });
  }
  
  return products;
};

const generateRecentCustomers = () => {
  const customers = [];
  
  for (let i = 0; i < 5; i++) {
    customers.push({
      id: `customer-${i}`,
      name: `John Doe ${i}`,
      email: `customer${i}@example.com`,
      totalOrders: Math.floor(Math.random() * 10) + 1,
      totalSpent: Math.floor(Math.random() * 1000) + 100,
      lastOrderDate: subDays(new Date(), Math.floor(Math.random() * 30)).toISOString(),
    });
  }
  
  return customers;
};

const generateLowStockItems = () => {
  const items = [];
  
  for (let i = 0; i < 3; i++) {
    items.push({
      id: `product-${i}`,
      name: `Low Stock Candle ${i + 1}`,
      sku: `SKU-${2000 + i}`,
      currentStock: Math.floor(Math.random() * 5) + 1,
      reorderPoint: 10,
    });
  }
  
  return items;
};

export const adminHandlers = [
  graphql.query('GetDashboardStats', (req, res, ctx) => {
    const { filters } = req.variables;
    const revenueData = generateRevenueData(30);
    const currentPeriodRevenue = revenueData.slice(-7).reduce((acc, curr) => acc + curr.amount, 0);
    const previousPeriodRevenue = revenueData.slice(-14, -7).reduce((acc, curr) => acc + curr.amount, 0);
    const percentageChange = ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100;

    return res(
      ctx.data({
        dashboardStats: {
          revenue: {
            total: currentPeriodRevenue,
            previousPeriod: previousPeriodRevenue,
            percentageChange: percentageChange,
            breakdown: revenueData
          },
          orders: {
            total: 450,
            pending: 25,
            processing: 45,
            shipped: 180,
            delivered: 185,
            cancelled: 15,
            percentageChange: 12.5,
            recentOrders: generateRecentOrders()
          },
          products: {
            total: 250,
            outOfStock: 15,
            lowStock: 25,
            topSellers: generateTopProducts()
          },
          customers: {
            total: 850,
            new: 125,
            returning: 725,
            percentageChange: 15.3,
            recentCustomers: generateRecentCustomers()
          },
          inventory: {
            totalValue: 75000,
            totalItems: 1250,
            lowStockItems: generateLowStockItems(),
            outOfStockItems: generateLowStockItems().map(item => ({
              id: item.id,
              name: item.name,
              sku: item.sku,
              lastInStock: subDays(new Date(), Math.floor(Math.random() * 7)).toISOString()
            }))
          },
          marketing: {
            activePromotions: 3,
            emailSubscribers: 2500,
            campaignPerformance: [
              {
                id: 'camp_001',
                name: "Valentine's Day Special",
                type: 'seasonal',
                status: 'active',
                startDate: subDays(new Date(), 7).toISOString(),
                endDate: addDays(new Date(), 7).toISOString(),
                metrics: {
                  impressions: 15000,
                  clicks: 2500,
                  conversions: 350,
                  revenue: 10500
                }
              }
            ]
          },
          systemHealth: {
            status: 'healthy',
            uptime: 99.98,
            lastBackup: subDays(new Date(), 1).toISOString(),
            pendingUpdates: 2,
            errors: {
              count: 0,
              recent: []
            }
          }
        }
      })
    );
  }),

  graphql.query('GetAdminUser', (req, res, ctx) => {
    return res(
      ctx.data({
        adminUser: {
          id: '1',
          name: 'Admin User',
          email: 'admin@wickandwax.co',
          role: 'SUPER_ADMIN',
          permissions: ['VIEW_DASHBOARD', 'MANAGE_PRODUCTS', 'MANAGE_ORDERS', 'MANAGE_CUSTOMERS'],
          lastLogin: new Date().toISOString(),
          twoFactorEnabled: true,
        },
      })
    );
  }),

  graphql.query('GetSystemSettings', (req, res, ctx) => {
    return res(
      ctx.data({
        systemSettings: {
          siteName: 'Wick & Wax Co',
          logo: '/logo.svg',
          theme: 'light',
          currency: 'USD',
          timezone: 'America/New_York',
          emailSettings: {
            provider: 'SendGrid',
            fromEmail: 'noreply@wickandwax.co',
            fromName: 'Wick & Wax Co',
          },
          paymentGateways: [
            {
              name: 'Stripe',
              enabled: true,
              testMode: false,
            },
            {
              name: 'PayPal',
              enabled: true,
              testMode: false,
            },
          ],
          shippingMethods: [
            {
              name: 'Standard Shipping',
              enabled: true,
              rate: 5.99,
            },
            {
              name: 'Express Shipping',
              enabled: true,
              rate: 15.99,
            },
          ],
          integrations: [
            {
              name: 'Google Analytics',
              enabled: true,
              apiKey: '******************',
              status: 'connected',
            },
            {
              name: 'MailChimp',
              enabled: true,
              apiKey: '******************',
              status: 'connected',
            },
          ],
        },
      })
    );
  }),
];
