import { WhatsAppMessage } from '../../types/admin';

export const mockChatHistory: WhatsAppMessage[] = [
  {
    id: 'msg_1',
    from: '+447700900000',
    to: 'support',
    content: 'Hi, I have a question about my order #WW12345',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    status: 'read',
    type: 'text'
  },
  {
    id: 'msg_2',
    from: 'support',
    to: '+447700900000',
    content: 'Hello! I\'d be happy to help. Could you please provide more details about your order?',
    timestamp: new Date(Date.now() - 3500000),
    status: 'read',
    type: 'text'
  },
  {
    id: 'msg_3',
    from: '+447700900000',
    to: 'support',
    content: 'I ordered 3 candles but only received 2',
    timestamp: new Date(Date.now() - 3400000),
    status: 'read',
    type: 'text'
  },
  {
    id: 'msg_4',
    from: 'support',
    to: '+447700900000',
    content: 'I\'m sorry to hear that. Let me check your order details.',
    timestamp: new Date(Date.now() - 3300000),
    status: 'delivered',
    type: 'text'
  }
];

export const mockActiveChats = [
  {
    id: 'chat_1',
    customerName: 'John Smith',
    phoneNumber: '+447700900000',
    lastMessage: 'I ordered 3 candles but only received 2',
    unreadCount: 0,
    startTime: Date.now() - 3600000,
    status: 'active',
    orderNumber: 'WW12345'
  },
  {
    id: 'chat_2',
    customerName: 'Sarah Johnson',
    phoneNumber: '+447700900001',
    lastMessage: 'When will my order be delivered?',
    unreadCount: 2,
    startTime: Date.now() - 1800000,
    status: 'active',
    orderNumber: 'WW12346'
  }
];

export const mockTemplates = [
  {
    id: 'template_1',
    name: 'Order Confirmation',
    content: 'Thank you for your order #{{orderNumber}}. We\'ll notify you when it\'s shipped.',
    variables: ['orderNumber']
  },
  {
    id: 'template_2',
    name: 'Shipping Confirmation',
    content: 'Your order #{{orderNumber}} has been shipped! Track it here: {{trackingLink}}',
    variables: ['orderNumber', 'trackingLink']
  },
  {
    id: 'template_3',
    name: 'Out of Hours',
    content: 'Thank you for your message. Our support team is currently offline. We\'ll respond during business hours: Mon-Fri 9am-5pm GMT.',
    variables: []
  }
];

export const mockQuickReplies = [
  {
    id: 'reply_1',
    title: 'Order Status',
    content: 'I\'ll check the status of your order right away. Could you please confirm your order number?'
  },
  {
    id: 'reply_2',
    title: 'Shipping Time',
    content: 'Our standard shipping time is 3-5 business days within the UK. International shipping may take 7-14 business days.'
  },
  {
    id: 'reply_3',
    title: 'Return Policy',
    content: 'We offer a 30-day return policy for unused items in their original packaging. Would you like me to explain the return process?'
  }
];

export const mockStatistics = {
  dailyStats: {
    totalMessages: 156,
    averageResponseTime: 180, // in seconds
    resolvedChats: 42,
    customerSatisfaction: 4.8
  },
  weeklyStats: {
    totalMessages: 876,
    averageResponseTime: 195,
    resolvedChats: 234,
    customerSatisfaction: 4.7
  },
  monthlyStats: {
    totalMessages: 3245,
    averageResponseTime: 210,
    resolvedChats: 892,
    customerSatisfaction: 4.6
  }
};
