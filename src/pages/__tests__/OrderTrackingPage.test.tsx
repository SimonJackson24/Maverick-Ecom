import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { OrderTrackingPage } from '../OrderTrackingPage';
import { GET_CUSTOMER_ORDERS, GET_ORDER_DETAILS, REORDER_ITEMS } from '../../graphql/orders';

const mockOrders = {
  customer: {
    orders: {
      items: [
        {
          id: 'order1',
          number: '000000001',
          order_date: '2025-02-11T21:53:28Z',
          status: 'processing',
          total: {
            grand_total: {
              value: 49.98,
              currency: 'USD',
            },
            subtotal: {
              value: 44.98,
              currency: 'USD',
            },
            total_shipping: {
              value: 5.00,
              currency: 'USD',
            },
            total_tax: {
              value: 0.00,
              currency: 'USD',
            },
          },
        },
      ],
      page_info: {
        current_page: 1,
        page_size: 5,
        total_pages: 1,
      },
      total_count: 1,
    },
  },
};

const mockOrderDetails = {
  customer: {
    order: {
      id: 'order1',
      number: '000000001',
      order_date: '2025-02-11T21:53:28Z',
      status: 'processing',
      total: {
        grand_total: {
          value: 49.98,
          currency: 'USD',
        },
        subtotal: {
          value: 44.98,
          currency: 'USD',
        },
        total_shipping: {
          value: 5.00,
          currency: 'USD',
        },
        total_tax: {
          value: 0.00,
          currency: 'USD',
        },
      },
      shipping_address: {
        firstname: 'John',
        lastname: 'Doe',
        street: '123 Main St',
        city: 'Anytown',
        region: 'CA',
        postcode: '12345',
        country_code: 'US',
        telephone: '(555) 555-5555',
      },
      shipping_method: 'Ground',
      items: [
        {
          id: 'item1',
          product_name: 'Lavender Dreams Candle',
          product_sku: 'CANDLE-001',
          product_url_key: 'lavender-dreams-candle',
          quantity_ordered: 2,
          product_sale_price: {
            value: 24.99,
            currency: 'USD',
          },
        },
      ],
      shipments: [
        {
          id: 'ship1',
          tracking: {
            title: 'Package 1',
            number: '1Z999999999999999',
            carrier: 'UPS',
            status: 'In Transit',
          },
        },
      ],
    },
  },
};

const mocks = [
  {
    request: {
      query: GET_CUSTOMER_ORDERS,
      variables: { pageSize: 5, currentPage: 1 },
    },
    result: {
      data: mockOrders,
    },
  },
  {
    request: {
      query: GET_ORDER_DETAILS,
      variables: { orderNumber: '000000001' },
    },
    result: {
      data: mockOrderDetails,
    },
  },
  {
    request: {
      query: REORDER_ITEMS,
      variables: { orderNumber: '000000001' },
    },
    result: {
      data: {
        reorderItems: {
          cart: {
            id: 'cart1',
            items: [
              {
                id: 'item1',
                product: {
                  name: 'Lavender Dreams Candle',
                  sku: 'CANDLE-001',
                },
                quantity: 2,
              },
            ],
          },
        },
      },
    },
  },
];

const renderWithProviders = (path: string = '/orders') => {
  return render(
    <HelmetProvider>
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/orders" element={<OrderTrackingPage />} />
            <Route path="/orders/:orderNumber" element={<OrderTrackingPage />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </HelmetProvider>
  );
};

describe('OrderTrackingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders order list correctly', async () => {
    renderWithProviders();

    expect(screen.getByText('Order History')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('000000001')).toBeInTheDocument();
      expect(screen.getByText('processing')).toBeInTheDocument();
      expect(screen.getByText('$49.98')).toBeInTheDocument();
    });
  });

  it('renders order details correctly', async () => {
    renderWithProviders('/orders/000000001');

    await waitFor(() => {
      expect(screen.getByText('Order #000000001')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
      expect(screen.getByText('Lavender Dreams Candle')).toBeInTheDocument();
      expect(screen.getByText('In Transit')).toBeInTheDocument();
    });
  });

  it('handles reorder functionality', async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    renderWithProviders('/orders/000000001');

    await waitFor(() => {
      expect(screen.getByText('Reorder Items')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Reorder Items'));

    await waitFor(() => {
      expect(screen.getByText('Adding to Cart...')).toBeInTheDocument();
    });
  });

  it('shows empty state when no orders exist', async () => {
    const emptyMock = {
      request: {
        query: GET_CUSTOMER_ORDERS,
        variables: { pageSize: 5, currentPage: 1 },
      },
      result: {
        data: {
          customer: {
            orders: {
              items: [],
              page_info: {
                current_page: 1,
                page_size: 5,
                total_pages: 0,
              },
              total_count: 0,
            },
          },
        },
      },
    };

    render(
      <HelmetProvider>
        <MockedProvider mocks={[emptyMock]} addTypename={false}>
          <MemoryRouter>
            <OrderTrackingPage />
          </MemoryRouter>
        </MockedProvider>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No orders yet')).toBeInTheDocument();
      expect(screen.getByText('Start shopping to create your first order')).toBeInTheDocument();
    });
  });

  it('shows error state for invalid order number', async () => {
    const errorMock = {
      request: {
        query: GET_ORDER_DETAILS,
        variables: { orderNumber: 'invalid' },
      },
      error: new Error('Order not found'),
    };

    render(
      <HelmetProvider>
        <MockedProvider mocks={[errorMock]} addTypename={false}>
          <MemoryRouter initialEntries={['/orders/invalid']}>
            <Routes>
              <Route path="/orders/:orderNumber" element={<OrderTrackingPage />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Order Not Found')).toBeInTheDocument();
      expect(
        screen.getByText("We couldn't find the order you're looking for. Please check the order number and try again.")
      ).toBeInTheDocument();
    });
  });

  it('handles pagination correctly', async () => {
    const paginatedMock = {
      request: {
        query: GET_CUSTOMER_ORDERS,
        variables: { pageSize: 5, currentPage: 1 },
      },
      result: {
        data: {
          customer: {
            orders: {
              items: mockOrders.customer.orders.items,
              page_info: {
                current_page: 1,
                page_size: 5,
                total_pages: 2,
              },
              total_count: 6,
            },
          },
        },
      },
    };

    render(
      <HelmetProvider>
        <MockedProvider mocks={[paginatedMock]} addTypename={false}>
          <MemoryRouter>
            <OrderTrackingPage />
          </MemoryRouter>
        </MockedProvider>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByText('Previous')).toBeInTheDocument();
    });

    const previousButton = screen.getByText('Previous');
    const nextButton = screen.getByText('Next');

    expect(previousButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });
});
