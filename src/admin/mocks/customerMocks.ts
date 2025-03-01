import { graphql, HttpResponse } from 'msw';

// Mock data for orders
const mockOrders = [
  {
    id: 'order_1',
    orderNumber: 'WW-2025-001',
    customerId: '1',
    items: [
      {
        id: 'item_1',
        productId: 'prod_1',
        productName: 'Lavender Dreams Candle',
        quantity: 2,
        price: 29.99,
        total: 59.98,
      },
      {
        id: 'item_2',
        productId: 'prod_2',
        productName: 'Vanilla Bean Diffuser',
        quantity: 1,
        price: 34.99,
        total: 34.99,
      },
    ],
    subtotal: 94.97,
    tax: 7.60,
    shipping: 5.99,
    total: 108.56,
    status: 'completed',
    paymentStatus: 'paid',
    shippingStatus: 'delivered',
    createdAt: '2025-02-15T10:30:00Z',
    updatedAt: '2025-02-15T10:30:00Z',
    shippingAddress: {
      id: 'addr_1',
      type: 'shipping',
      firstName: 'John',
      lastName: 'Doe',
      street: '123 Main St',
      city: 'London',
      state: 'Greater London',
      postalCode: 'SW1A 1AA',
      country: 'UK',
      phone: '+44 123 456 7890',
    },
    billingAddress: {
      id: 'addr_2',
      type: 'billing',
      firstName: 'John',
      lastName: 'Doe',
      street: '123 Main St',
      city: 'London',
      state: 'Greater London',
      postalCode: 'SW1A 1AA',
      country: 'UK',
      phone: '+44 123 456 7890',
    },
  },
  {
    id: 'order_2',
    orderNumber: 'WW-2025-002',
    customerId: '1',
    items: [
      {
        id: 'item_3',
        productId: 'prod_3',
        productName: 'Ocean Breeze Gift Set',
        quantity: 1,
        price: 49.99,
        total: 49.99,
      },
    ],
    subtotal: 49.99,
    tax: 4.00,
    shipping: 5.99,
    total: 59.98,
    status: 'processing',
    paymentStatus: 'paid',
    shippingStatus: 'pending',
    createdAt: '2025-02-17T14:20:00Z',
    updatedAt: '2025-02-17T14:20:00Z',
    shippingAddress: {
      id: 'addr_1',
      type: 'shipping',
      firstName: 'John',
      lastName: 'Doe',
      street: '123 Main St',
      city: 'London',
      state: 'Greater London',
      postalCode: 'SW1A 1AA',
      country: 'UK',
      phone: '+44 123 456 7890',
    },
    billingAddress: {
      id: 'addr_2',
      type: 'billing',
      firstName: 'John',
      lastName: 'Doe',
      street: '123 Main St',
      city: 'London',
      state: 'Greater London',
      postalCode: 'SW1A 1AA',
      country: 'UK',
      phone: '+44 123 456 7890',
    },
  },
];

// Mock data for wishlists
const mockWishlists = [
  {
    id: 'wishlist_1',
    customerId: '1',
    name: 'My Favorites',
    items: [
      {
        id: 'item_1',
        productId: 'prod_4',
        productName: 'Citrus Grove Candle',
        price: 24.99,
        addedAt: '2025-02-10T09:15:00Z',
        inStock: true,
      },
      {
        id: 'item_2',
        productId: 'prod_5',
        productName: 'Sandalwood Reed Diffuser',
        price: 39.99,
        addedAt: '2025-02-12T16:30:00Z',
        inStock: true,
      },
    ],
    createdAt: '2025-02-10T09:15:00Z',
    updatedAt: '2025-02-12T16:30:00Z',
  },
];

// Mock wishlist data
const mockWishlistItems = [
  {
    id: 'wishlist_item_1',
    product: {
      id: 'product_1',
      name: 'Lavender Dreams Candle',
      description: 'A soothing blend of lavender and vanilla',
      price: 24.99,
      images: [
        {
          id: 'img_1',
          url: '/images/products/lavender-dreams.jpg',
          alt: 'Lavender Dreams Candle'
        }
      ],
      inStock: true
    },
    addedAt: '2025-02-15T10:00:00Z'
  },
  {
    id: 'wishlist_item_2',
    product: {
      id: 'product_2',
      name: 'Ocean Breeze Wax Melts',
      description: 'Fresh ocean scent with hints of sea salt',
      price: 12.99,
      images: [
        {
          id: 'img_2',
          url: '/images/products/ocean-breeze.jpg',
          alt: 'Ocean Breeze Wax Melts'
        }
      ],
      inStock: true
    },
    addedAt: '2025-02-16T15:30:00Z'
  }
];

// Mock data for addresses
const mockAddresses = [
  {
    id: 'addr_1',
    customerId: '1',
    type: 'shipping',
    isDefault: true,
    firstName: 'John',
    lastName: 'Doe',
    company: '',
    street: '123 Main St',
    city: 'London',
    state: 'Greater London',
    postalCode: 'SW1A 1AA',
    country: 'UK',
    phone: '+44 123 456 7890',
    createdAt: '2024-08-15T14:30:00Z',
    updatedAt: '2024-08-15T14:30:00Z',
  },
  {
    id: 'addr_2',
    customerId: '1',
    type: 'billing',
    isDefault: true,
    firstName: 'John',
    lastName: 'Doe',
    company: '',
    street: '123 Main St',
    city: 'London',
    state: 'Greater London',
    postalCode: 'SW1A 1AA',
    country: 'UK',
    phone: '+44 123 456 7890',
    createdAt: '2024-08-15T14:30:00Z',
    updatedAt: '2024-08-15T14:30:00Z',
  },
];

const customers = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+44 123 456 7890',
    totalOrders: 15,
    totalSpent: 1250.50,
    lastOrderDate: '2025-02-15T10:30:00Z',
    status: 'active',
    createdAt: '2024-08-15T14:30:00Z',
    orders: mockOrders.filter(order => order.customerId === '1'),
    wishlists: mockWishlists.filter(wishlist => wishlist.customerId === '1'),
    addresses: mockAddresses.filter(address => address.customerId === '1'),
    notes: [
      {
        id: 'note_1',
        content: 'VIP customer - Always orders premium candles',
        createdAt: '2025-01-15T11:30:00Z',
        createdBy: 'admin',
      },
    ],
    segments: ['vip', 'repeat_customer'],
    preferences: {
      marketingEmails: true,
      smsNotifications: true,
      giftWrapping: true,
      scentPreferences: ['lavender', 'vanilla', 'sandalwood'],
    },
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+44 123 456 7891',
    totalOrders: 8,
    totalSpent: 750.25,
    lastOrderDate: '2025-02-10T15:45:00Z',
    status: 'active',
    createdAt: '2024-09-20T09:15:00Z',
    orders: [],
    wishlists: [],
    addresses: [],
    notes: [],
    segments: [],
    preferences: {
      marketingEmails: true,
      smsNotifications: false,
      giftWrapping: false,
      scentPreferences: [],
    },
  },
  {
    id: '3',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.j@example.com',
    phone: '+44 123 456 7892',
    totalOrders: 3,
    totalSpent: 225.75,
    lastOrderDate: '2025-01-25T11:20:00Z',
    status: 'inactive',
    createdAt: '2024-11-05T16:45:00Z',
    orders: [],
    wishlists: [],
    addresses: [],
    notes: [],
    segments: [],
    preferences: {
      marketingEmails: true,
      smsNotifications: false,
      giftWrapping: false,
      scentPreferences: [],
    },
  },
  {
    id: '4',
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.w@example.com',
    phone: '+44 123 456 7893',
    totalOrders: 20,
    totalSpent: 1875.30,
    lastOrderDate: '2025-02-16T09:10:00Z',
    status: 'active',
    createdAt: '2024-07-10T13:20:00Z',
    orders: [],
    wishlists: [],
    addresses: [],
    notes: [],
    segments: [],
    preferences: {
      marketingEmails: true,
      smsNotifications: false,
      giftWrapping: false,
      scentPreferences: [],
    },
  },
  {
    id: '5',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.b@example.com',
    phone: '+44 123 456 7894',
    totalOrders: 0,
    totalSpent: 0,
    lastOrderDate: null,
    status: 'blocked',
    createdAt: '2025-01-05T10:30:00Z',
    orders: [],
    wishlists: [],
    addresses: [],
    notes: [],
    segments: [],
    preferences: {
      marketingEmails: true,
      smsNotifications: false,
      giftWrapping: false,
      scentPreferences: [],
    },
  },
];

// Mock tracking data
const mockTrackingData = {
  'TN123456789': {
    consignmentNumber: 'TN123456789',
    status: 'In Transit',
    estimatedDelivery: '2025-02-20T17:00:00Z',
    events: [
      {
        eventDateTime: '2025-02-18T15:30:00Z',
        eventDescription: 'Item dispatched from our Bristol depot',
        location: 'Bristol',
        status: 'In Transit'
      },
      {
        eventDateTime: '2025-02-18T09:15:00Z',
        eventDescription: 'Item received at Bristol depot',
        location: 'Bristol',
        status: 'Received'
      },
      {
        eventDateTime: '2025-02-17T16:45:00Z',
        eventDescription: 'Shipping label created',
        location: 'Seller Facility',
        status: 'Label Created'
      }
    ]
  }
};

export const customerHandlers = [
  // Get Customers List with Pagination
  graphql.query('GetCustomers', ({ variables }) => {
    const { page = 1, perPage = 10, searchQuery = '' } = variables;

    let filteredCustomers = customers;
    
    // Apply search filter if provided
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      filteredCustomers = customers.filter(customer => 
        customer.firstName.toLowerCase().includes(search) ||
        customer.lastName.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search) ||
        customer.phone.includes(search)
      );
    }

    // Calculate pagination
    const total = filteredCustomers.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const items = filteredCustomers.slice(start, end);

    return HttpResponse.json({
      data: {
        customers: {
          items,
          total,
          pageInfo: {
            hasNextPage: end < total,
            hasPreviousPage: page > 1,
            currentPage: page,
            totalPages,
          },
        },
      },
    });
  }),

  // Get Single Customer
  graphql.query('GetCustomer', ({ variables }) => {
    const customer = customers.find(c => c.id === variables.id);
    
    if (!customer) {
      return HttpResponse.json({
        errors: [{ message: 'Customer not found' }],
      }, { status: 404 });
    }

    return HttpResponse.json({
      data: {
        customer,
      },
    });
  }),

  // Get Customer Orders
  graphql.query('GetCustomerOrders', () => {
    return HttpResponse.json({
      data: {
        customerOrders: mockOrders.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
          items: order.items,
          shippingAddress: order.shippingAddress,
          shippingMethod: {
            id: 'standard',
            name: 'Standard Shipping',
            price: order.shipping
          },
          trackingNumber: order.id === 'order_1' ? 'TN123456789' : null
        }))
      }
    });
  }),

  // Get Customer Wishlists
  graphql.query('GetCustomerWishlists', ({ variables }) => {
    const { customerId } = variables;
    const wishlists = mockWishlists.filter(wishlist => wishlist.customerId === customerId);

    return HttpResponse.json({
      data: {
        customerWishlists: wishlists,
      },
    });
  }),

  // Get Customer Addresses
  graphql.query('GetCustomerAddresses', ({ variables }) => {
    const { customerId } = variables;
    const addresses = mockAddresses.filter(address => address.customerId === customerId);

    return HttpResponse.json({
      data: {
        customerAddresses: addresses,
      },
    });
  }),

  // Get Wishlist
  graphql.query('GetWishlist', () => {
    return HttpResponse.json({
      data: {
        wishlist: {
          id: 'wishlist_1',
          items: mockWishlistItems
        }
      }
    });
  }),

  // Add to Wishlist
  graphql.mutation('AddToWishlist', ({ variables }) => {
    const { productId } = variables;
    return HttpResponse.json({
      data: {
        addToWishlist: {
          id: 'wishlist_1',
          items: [
            ...mockWishlistItems,
            {
              id: `wishlist_item_${Date.now()}`,
              product: {
                id: productId,
                name: 'New Product'
              }
            }
          ]
        }
      }
    });
  }),

  // Remove from Wishlist
  graphql.mutation('RemoveFromWishlist', ({ variables }) => {
    const { productId } = variables;
    return HttpResponse.json({
      data: {
        removeFromWishlist: {
          id: 'wishlist_1',
          items: mockWishlistItems.filter(item => item.product.id !== productId)
        }
      }
    });
  }),

  // Create Customer
  graphql.mutation('CreateCustomer', ({ variables }) => {
    const newCustomer = {
      id: `customer_${Date.now()}`,
      ...variables.input,
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: null,
      createdAt: new Date().toISOString(),
      orders: [],
      wishlists: [],
      addresses: [],
      notes: [],
      segments: [],
      preferences: {
        marketingEmails: true,
        smsNotifications: false,
        giftWrapping: false,
        scentPreferences: [],
      },
    };
    
    customers.push(newCustomer);
    
    return HttpResponse.json({
      data: {
        createCustomer: newCustomer,
      },
    });
  }),

  // Update Customer
  graphql.mutation('UpdateCustomer', ({ variables }) => {
    const index = customers.findIndex(c => c.id === variables.id);
    
    if (index === -1) {
      return HttpResponse.json({
        errors: [{ message: 'Customer not found' }],
      }, { status: 404 });
    }

    const updatedCustomer = {
      ...customers[index],
      ...variables.input,
    };
    
    customers[index] = updatedCustomer;
    
    return HttpResponse.json({
      data: {
        updateCustomer: updatedCustomer,
      },
    });
  }),

  // Delete Customer
  graphql.mutation('DeleteCustomer', ({ variables }) => {
    const index = customers.findIndex(c => c.id === variables.id);
    
    if (index === -1) {
      return HttpResponse.json({
        errors: [{ message: 'Customer not found' }],
      }, { status: 404 });
    }

    customers.splice(index, 1);
    
    return HttpResponse.json({
      data: {
        deleteCustomer: {
          id: variables.id,
          success: true,
        },
      },
    });
  }),

  // Add Customer Address
  graphql.mutation('AddCustomerAddress', ({ variables }) => {
    const { customerId, input } = variables;
    const newAddress = {
      id: `addr_${Date.now()}`,
      customerId,
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockAddresses.push(newAddress);

    return HttpResponse.json({
      data: {
        addCustomerAddress: newAddress,
      },
    });
  }),

  // Update Customer Address
  graphql.mutation('UpdateCustomerAddress', ({ variables }) => {
    const { addressId, input } = variables;
    const index = mockAddresses.findIndex(a => a.id === addressId);

    if (index === -1) {
      return HttpResponse.json({
        errors: [{ message: 'Address not found' }],
      }, { status: 404 });
    }

    const updatedAddress = {
      ...mockAddresses[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    mockAddresses[index] = updatedAddress;

    return HttpResponse.json({
      data: {
        updateCustomerAddress: updatedAddress,
      },
    });
  }),

  // Delete Customer Address
  graphql.mutation('DeleteCustomerAddress', ({ variables }) => {
    const { addressId } = variables;
    const index = mockAddresses.findIndex(a => a.id === addressId);

    if (index === -1) {
      return HttpResponse.json({
        errors: [{ message: 'Address not found' }],
      }, { status: 404 });
    }

    mockAddresses.splice(index, 1);

    return HttpResponse.json({
      data: {
        deleteCustomerAddress: {
          id: addressId,
          success: true,
        },
      },
    });
  }),

  // Get Order Details
  graphql.query('GetOrderDetails', ({ variables }) => {
    const { orderId } = variables;
    const order = mockOrders.find(order => order.id === orderId);
    
    if (!order) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Order not found'
      });
    }

    return HttpResponse.json({
      data: {
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
          items: order.items,
          shippingAddress: order.shippingAddress,
          shippingMethod: {
            id: 'standard',
            name: 'Standard Shipping',
            price: order.shipping || 5.99
          },
          trackingNumber: order.id === 'order_1' ? 'TN123456789' : null
        }
      }
    });
  }),

  // Get Shipment Tracking
  graphql.query('GetShipmentTracking', ({ variables }) => {
    const { trackingNumber } = variables;
    const tracking = mockTrackingData[trackingNumber];

    if (!tracking) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Tracking information not found'
      });
    }

    return HttpResponse.json({
      data: {
        shipmentTracking: tracking
      }
    });
  }),
];
