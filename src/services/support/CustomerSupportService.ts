import { MonitoringService } from '../monitoring/MonitoringService';
import { mockSupportTickets } from './mockData';

export interface SupportTicket {
  id: string;
  userId?: string;
  email: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  attachments?: any[];
  orderNumber?: string;
  whatsappNumber?: string;
}

export interface TicketUpdate {
  id: string;
  ticketId: string;
  message: string;
  createdAt: Date;
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
  attachments?: any[];
}

export class CustomerSupportService {
  private static instance: CustomerSupportService;
  private readonly isDev = process.env.NODE_ENV === 'development';
  private monitoring: MonitoringService;

  private constructor() {
    this.monitoring = MonitoringService.getInstance();
  }

  public static getInstance(): CustomerSupportService {
    if (!CustomerSupportService.instance) {
      CustomerSupportService.instance = new CustomerSupportService();
    }
    return CustomerSupportService.instance;
  }

  public async getTickets(filters?: {
    status?: string;
    priority?: string;
    category?: string;
  }): Promise<SupportTicket[]> {
    if (this.isDev) {
      return mockSupportTickets.filter(ticket => {
        if (!filters) return true;
        if (filters.status && ticket.status !== filters.status) return false;
        if (filters.priority && ticket.priority !== filters.priority) return false;
        if (filters.category && ticket.category !== filters.category) return false;
        return true;
      });
    }

    try {
      const response = await fetch('/api/support/tickets');
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      return await response.json();
    } catch (error) {
      this.monitoring.logError('Failed to fetch support tickets', error);
      throw error;
    }
  }

  public async getTicket(id: string): Promise<SupportTicket | null> {
    if (this.isDev) {
      return mockSupportTickets.find(ticket => ticket.id === id) || null;
    }

    try {
      const response = await fetch(`/api/support/tickets/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch ticket');
      }
      return await response.json();
    } catch (error) {
      this.monitoring.logError('Failed to fetch support ticket', error);
      throw error;
    }
  }

  public async createTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>): Promise<SupportTicket> {
    if (this.isDev) {
      const newTicket: SupportTicket = {
        ...ticket,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockSupportTickets.push(newTicket);
      return newTicket;
    }

    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ticket)
      });

      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }

      return await response.json();
    } catch (error) {
      this.monitoring.logError('Failed to create support ticket', error);
      throw error;
    }
  }

  public async updateTicket(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket> {
    if (this.isDev) {
      const ticketIndex = mockSupportTickets.findIndex(t => t.id === id);
      if (ticketIndex === -1) throw new Error('Ticket not found');
      
      mockSupportTickets[ticketIndex] = {
        ...mockSupportTickets[ticketIndex],
        ...updates,
        updatedAt: new Date()
      };
      return mockSupportTickets[ticketIndex];
    }

    try {
      const response = await fetch(`/api/support/tickets/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update ticket');
      }

      return await response.json();
    } catch (error) {
      this.monitoring.logError('Failed to update support ticket', error);
      throw error;
    }
  }
}
