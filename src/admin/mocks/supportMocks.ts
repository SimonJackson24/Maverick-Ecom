import { graphql, HttpResponse } from 'msw';

const defaultWhatsAppSettings = {
  enabled: true,
  phoneNumber: '+1234567890',
  displayName: 'Wick & Wax Support',
  welcomeMessage: 'Welcome to Wick & Wax Co! How can we help you today?',
  autoReply: {
    enabled: true,
    message: 'Thank you for your message. Our team will get back to you shortly.',
    afterHoursMessage: 'Our support team is currently offline. We will respond to your message during our business hours.',
  },
  operatingHours: {
    enabled: true,
    timezone: 'America/New_York',
    schedule: [
      { day: 'Sunday', isOpen: false, start: '09:00', end: '17:00' },
      { day: 'Monday', isOpen: true, start: '09:00', end: '17:00' },
      { day: 'Tuesday', isOpen: true, start: '09:00', end: '17:00' },
      { day: 'Wednesday', isOpen: true, start: '09:00', end: '17:00' },
      { day: 'Thursday', isOpen: true, start: '09:00', end: '17:00' },
      { day: 'Friday', isOpen: true, start: '09:00', end: '17:00' },
      { day: 'Saturday', isOpen: false, start: '09:00', end: '17:00' },
    ],
  },
  notifications: {
    email: true,
    desktop: true,
    slack: false,
  },
  templates: [
    {
      name: 'order_confirmation',
      language: 'en',
      components: [
        {
          type: 'header',
          parameters: [
            {
              type: 'text',
              text: 'Order Confirmation',
            },
          ],
        },
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: 'Thank you for your order! Your order number is {{1}}.',
            },
          ],
        },
      ],
    },
  ],
};

const mockSupportTickets = [
  {
    id: '1',
    customerId: 'cust_1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    subject: 'Order Delay',
    description: 'My order is taking longer than expected.',
    status: 'open',
    priority: 'high',
    category: 'orders',
    assignedTo: 'agent_1',
    createdAt: '2025-02-18T18:00:00Z',
    updatedAt: '2025-02-18T18:00:00Z',
    lastResponseAt: null,
    tags: ['order', 'delay'],
    relatedOrderId: 'order_123',
    responses: [],
  },
  {
    id: '2',
    customerId: 'cust_2',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    subject: 'Product Question',
    description: 'Do you have this candle in a different scent?',
    status: 'resolved',
    priority: 'medium',
    category: 'product',
    assignedTo: 'agent_2',
    createdAt: '2025-02-18T17:30:00Z',
    updatedAt: '2025-02-18T17:45:00Z',
    lastResponseAt: '2025-02-18T17:45:00Z',
    tags: ['product', 'inquiry'],
    relatedOrderId: null,
    responses: [
      {
        id: 'resp_1',
        content: 'Yes, we have lavender and vanilla scents available.',
        authorId: 'agent_2',
        authorName: 'Support Agent',
        authorType: 'agent',
        createdAt: '2025-02-18T17:45:00Z',
        isInternal: false,
        attachments: [],
      },
    ],
  },
];

export const supportHandlers = [
  // Get WhatsApp Settings
  graphql.query('GetWhatsAppSettings', () => {
    return HttpResponse.json({
      data: {
        whatsAppSettings: defaultWhatsAppSettings,
      },
    });
  }),

  // Update WhatsApp Settings
  graphql.mutation('UpdateWhatsAppSettings', ({ variables }) => {
    return HttpResponse.json({
      data: {
        updateWhatsAppSettings: {
          ...defaultWhatsAppSettings,
          ...variables.input,
        },
      },
    });
  }),

  // Get Support Tickets
  graphql.query('GetSupportTickets', () => {
    return HttpResponse.json({
      data: {
        supportTickets: mockSupportTickets,
      },
    });
  }),

  // Get Support Ticket by ID
  graphql.query('GetTicketById', ({ variables }) => {
    const ticket = mockSupportTickets.find(t => t.id === variables.id);
    return HttpResponse.json({
      data: {
        supportTicket: ticket || null,
      },
    });
  }),

  // Create Support Ticket
  graphql.mutation('CreateSupportTicket', ({ variables }) => {
    const newTicket = {
      id: `ticket_${Date.now()}`,
      ...variables.input,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastResponseAt: null,
      responses: [],
      tags: [],
      relatedOrderId: null,
      assignedTo: null,
    };
    mockSupportTickets.push(newTicket);
    return HttpResponse.json({
      data: {
        createSupportTicket: newTicket,
      },
    });
  }),

  // Update Support Ticket
  graphql.mutation('UpdateTicket', ({ variables }) => {
    const ticketIndex = mockSupportTickets.findIndex(t => t.id === variables.id);
    if (ticketIndex === -1) {
      return HttpResponse.json({
        errors: [{ message: 'Ticket not found' }],
      }, { status: 404 });
    }
    const updatedTicket = {
      ...mockSupportTickets[ticketIndex],
      ...variables.input,
      updatedAt: new Date().toISOString(),
    };
    mockSupportTickets[ticketIndex] = updatedTicket;
    return HttpResponse.json({
      data: {
        updateTicket: updatedTicket,
      },
    });
  }),

  // Add Ticket Response
  graphql.mutation('AddTicketResponse', ({ variables }) => {
    const ticketIndex = mockSupportTickets.findIndex(t => t.id === variables.ticketId);
    if (ticketIndex === -1) {
      return HttpResponse.json({
        errors: [{ message: 'Ticket not found' }],
      }, { status: 404 });
    }
    const newResponse = {
      id: `resp_${Date.now()}`,
      ...variables.input,
      createdAt: new Date().toISOString(),
      attachments: [],
    };
    mockSupportTickets[ticketIndex].responses.push(newResponse);
    mockSupportTickets[ticketIndex].lastResponseAt = newResponse.createdAt;
    mockSupportTickets[ticketIndex].updatedAt = newResponse.createdAt;
    return HttpResponse.json({
      data: {
        addTicketResponse: newResponse,
      },
    });
  }),
];
