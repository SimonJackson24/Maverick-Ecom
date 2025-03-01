export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  lastResponseAt?: string;
  responses: TicketResponse[];
  tags: string[];
  relatedOrderId?: string;
}

export interface TicketResponse {
  id: string;
  ticketId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorType: 'customer' | 'admin' | 'system';
  createdAt: string;
  attachments: Attachment[];
  isInternal: boolean;
}

export interface Attachment {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  content: string;
  senderId: string;
  senderType: 'customer' | 'admin' | 'system';
  senderName: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachments: Attachment[];
}

export interface ChatSession {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: 'active' | 'ended';
  startedAt: string;
  endedAt?: string;
  assignedTo?: string;
  messages: ChatMessage[];
  tags: string[];
}

export interface SupportMetrics {
  tickets: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
    averageResponseTime: number;
    averageResolutionTime: number;
  };
  chat: {
    activeChats: number;
    totalChatsToday: number;
    averageWaitTime: number;
    averageChatDuration: number;
    satisfactionRate: number;
  };
  performance: {
    ticketsResolvedToday: number;
    chatsHandledToday: number;
    averageSatisfactionScore: number;
    responseTimePercentiles: {
      p50: number;
      p90: number;
      p99: number;
    };
  };
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  status: 'draft' | 'published' | 'archived';
  viewCount: number;
  helpfulVotes: number;
  unhelpfulVotes: number;
}

export interface SupportSettings {
  ticketing: {
    categories: string[];
    priorities: Array<{
      name: string;
      color: string;
      slaMinutes: number;
    }>;
    autoAssignment: boolean;
    requireResponse: boolean;
    defaultResponseTemplates: Array<{
      name: string;
      content: string;
      category: string;
    }>;
  };
  chat: {
    enabled: boolean;
    operatingHours: Array<{
      day: number;
      start: string;
      end: string;
      isOpen: boolean;
    }>;
    maxConcurrentChats: number;
    awayMessage: string;
    welcomeMessage: string;
    offlineMessage: string;
    fileUpload: {
      enabled: boolean;
      maxSize: number;
      allowedTypes: string[];
    };
  };
  notifications: {
    email: {
      enabled: boolean;
      newTicketTemplate: string;
      ticketUpdateTemplate: string;
      ticketResolutionTemplate: string;
    };
    slack: {
      enabled: boolean;
      webhook: string;
      channels: {
        newTickets: string;
        highPriority: string;
        resolved: string;
      };
    };
  };
  automation: {
    enabled: boolean;
    rules: Array<{
      name: string;
      conditions: Array<{
        field: string;
        operator: string;
        value: any;
      }>;
      actions: Array<{
        type: string;
        params: Record<string, any>;
      }>;
    }>;
  };
}
