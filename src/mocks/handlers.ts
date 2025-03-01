import { graphql, http, HttpResponse } from 'msw';
import { mockChatHistory, mockTemplates, mockActiveChats, mockStatistics } from '../services/support/mockData';
import { adminHandlers } from './handlers/adminHandlers';
import { inventoryHandlers } from './handlers/inventoryHandlers';
import { shippingHandlers } from '../admin/mocks/shippingMocks';
import { seoHandlers } from '../admin/mocks/seoMocks';
import { supportHandlers } from '../admin/mocks/supportMocks';
import { customerHandlers } from '../admin/mocks/customerMocks';
import { authHandlers } from '../admin/mocks/authMocks';

export const handlers = [
  ...adminHandlers,
  ...inventoryHandlers,
  ...shippingHandlers,
  ...seoHandlers,
  ...supportHandlers,
  ...customerHandlers,
  ...authHandlers,

  // GraphQL Handlers
  graphql.query('GetDashboardStats', () => {
    return HttpResponse.json({
      data: {
        dashboardStats: {
          revenue: {
            total: 125000,
            percentageChange: 15.5,
            breakdown: [
              { period: '2025-02-10', amount: 15000 },
              { period: '2025-02-11', amount: 17500 },
              { period: '2025-02-12', amount: 16000 },
              { period: '2025-02-13', amount: 18500 },
              { period: '2025-02-14', amount: 19500 },
              { period: '2025-02-15', amount: 21000 },
              { period: '2025-02-16', amount: 17500 },
            ],
          },
          orders: {
            total: 450,
            percentageChange: 8.2,
            shipping: 25,
            breakdown: [
              { period: '2025-02-10', count: 55, newCustomers: 12 },
              { period: '2025-02-11', count: 62, newCustomers: 15 },
              { period: '2025-02-12', count: 58, newCustomers: 10 },
              { period: '2025-02-13', count: 65, newCustomers: 18 },
              { period: '2025-02-14', count: 70, newCustomers: 20 },
              { period: '2025-02-15', count: 75, newCustomers: 22 },
              { period: '2025-02-16', count: 65, newCustomers: 15 },
            ],
          },
          products: {
            total: 150,
            percentageChange: -2.5,
            outOfStock: 8,
            lowStock: 15,
            breakdown: [
              { period: '2025-02-10', count: 145 },
              { period: '2025-02-11', count: 148 },
              { period: '2025-02-12', count: 150 },
              { period: '2025-02-13', count: 152 },
              { period: '2025-02-14', count: 149 },
              { period: '2025-02-15', count: 147 },
              { period: '2025-02-16', count: 150 },
            ],
          },
          customers: {
            total: 850,
            percentageChange: 12.3,
            active: 620,
            new: 45,
            breakdown: [
              { period: '2025-02-10', count: 800, newCustomers: 5 },
              { period: '2025-02-11', count: 810, newCustomers: 8 },
              { period: '2025-02-12', count: 815, newCustomers: 6 },
              { period: '2025-02-13', count: 825, newCustomers: 9 },
              { period: '2025-02-14', count: 835, newCustomers: 7 },
              { period: '2025-02-15', count: 845, newCustomers: 10 },
              { period: '2025-02-16', count: 850, newCustomers: 5 },
            ],
          },
        },
      },
    });
  }),

  // Support Handlers
  graphql.query('GetSupportTickets', () => {
    return HttpResponse.json({
      data: {
        supportTickets: mockChatHistory,
      },
    });
  }),

  graphql.query('GetSupportTemplates', () => {
    return HttpResponse.json({
      data: {
        supportTemplates: mockTemplates,
      },
    });
  }),

  graphql.query('GetActiveChats', () => {
    return HttpResponse.json({
      data: {
        activeChats: mockActiveChats,
      },
    });
  }),

  graphql.query('GetSupportStatistics', () => {
    return HttpResponse.json({
      data: {
        supportStatistics: mockStatistics,
      },
    });
  }),
];

export default handlers;
