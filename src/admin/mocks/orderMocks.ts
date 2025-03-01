import { graphql } from 'msw';

const orders = [
  {
    id: '1',
    orderNumber: 'WW-2025-001',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    total: 125.50,
    items: 3,
    orderStatus: 'completed',
    paymentStatus: 'paid',
    shippingStatus: 'delivered',
    createdAt: '2025-02-15T10:30:00Z',
  },
  {
    id: '2',
    orderNumber: 'WW-2025-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    total: 75.25,
    items: 2,
    orderStatus: 'processing',
    paymentStatus: 'paid',
    shippingStatus: 'preparing',
    createdAt: '2025-02-10T15:45:00Z',
  },
  {
    id: '3',
    orderNumber: 'WW-2025-003',
    customerName: 'Robert Johnson',
    customerEmail: 'robert.j@example.com',
    total: 225.75,
    items: 5,
    orderStatus: 'pending',
    paymentStatus: 'pending',
    shippingStatus: 'pending',
    createdAt: '2025-02-17T11:20:00Z',
  },
];

export const orderHandlers = [
  graphql.query('GetOrders', (req, res, ctx) => {
    const { status, page = 1, perPage = 10, searchQuery = '' } = req.variables;

    let filteredOrders = [...orders];

    // Apply status filter
    if (status && status !== 'all') {
      filteredOrders = filteredOrders.filter(
        order => order.orderStatus === status
      );
    }

    // Apply search filter
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      filteredOrders = filteredOrders.filter(
        order =>
          order.orderNumber.toLowerCase().includes(search) ||
          order.customerName.toLowerCase().includes(search) ||
          order.customerEmail.toLowerCase().includes(search)
      );
    }

    // Calculate pagination
    const total = filteredOrders.length;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedOrders = filteredOrders.slice(start, end);

    return res(
      ctx.data({
        orders: {
          items: paginatedOrders,
          total,
          pageInfo: {
            hasNextPage: end < total,
            hasPreviousPage: page > 1,
            currentPage: page,
            totalPages: Math.ceil(total / perPage),
          },
        },
        orderStats: {
          total: orders.length,
          pending: orders.filter(o => o.orderStatus === 'pending').length,
          processing: orders.filter(o => o.orderStatus === 'processing').length,
          completed: orders.filter(o => o.orderStatus === 'completed').length,
          cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
          todayOrders: 2,
          todayRevenue: 351.25,
          weeklyOrders: 8,
          weeklyRevenue: 1250.75,
          monthlyOrders: 15,
          monthlyRevenue: 2500.50,
        },
      })
    );
  }),
];
