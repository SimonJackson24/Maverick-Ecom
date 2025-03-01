import { WhatsAppService } from './WhatsAppService';
import { db } from '../database';
import { io, Socket } from 'socket.io-client';

interface ChatSession {
  sessionId: string;
  customerNumber: string;
  socketId: string;
  timestamp: number;
}

export class ChatService {
  private whatsAppService: WhatsAppService;
  private activeSessions: Map<string, ChatSession>;
  private socket: Socket;

  constructor() {
    this.whatsAppService = new WhatsAppService();
    this.activeSessions = new Map();
    this.socket = io(process.env.WEBSOCKET_SERVER_URL!);
    this.initializeSocketListeners();
  }

  private initializeSocketListeners(): void {
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('agent_message', async (data) => {
      const session = this.activeSessions.get(data.sessionId);
      if (session) {
        // Forward message to customer's WhatsApp
        await this.whatsAppService.sendMessageToCustomer(
          session.customerNumber,
          data.message
        );

        // Store message in database
        await this.storeMessage({
          sessionId: data.sessionId,
          type: 'agent',
          content: data.message,
          timestamp: Date.now()
        });
      }
    });
  }

  async startChatSession(customerNumber: string): Promise<string> {
    try {
      // Validate WhatsApp number format
      if (!this.isValidWhatsAppNumber(customerNumber)) {
        throw new Error('Invalid WhatsApp number format');
      }

      const sessionId = this.generateSessionId();
      const session: ChatSession = {
        sessionId,
        customerNumber,
        socketId: this.socket.id,
        timestamp: Date.now()
      };

      this.activeSessions.set(sessionId, session);

      // Store session in database
      await db.chatSessions.create({
        data: {
          sessionId,
          customerNumber,
          startTime: new Date(),
          status: 'active'
        }
      });

      return sessionId;
    } catch (error) {
      console.error('Error starting chat session:', error);
      throw new Error('Failed to start chat session');
    }
  }

  async sendCustomerMessage(sessionId: string, message: string): Promise<void> {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        throw new Error('Chat session not found');
      }

      // Send message to WhatsApp group
      await this.whatsAppService.sendMessageToGroup(
        message,
        session.customerNumber
      );

      // Store message in database
      await this.storeMessage({
        sessionId,
        type: 'customer',
        content: message,
        timestamp: Date.now()
      });

      // Emit message to WebSocket for real-time updates
      this.socket.emit('customer_message', {
        sessionId,
        message,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error sending customer message:', error);
      throw new Error('Failed to send message');
    }
  }

  async endChatSession(sessionId: string): Promise<void> {
    try {
      const session = this.activeSessions.get(sessionId);
      if (session) {
        this.activeSessions.delete(sessionId);

        // Update session status in database
        await db.chatSessions.update({
          where: { sessionId },
          data: {
            endTime: new Date(),
            status: 'completed'
          }
        });
      }
    } catch (error) {
      console.error('Error ending chat session:', error);
      throw new Error('Failed to end chat session');
    }
  }

  private async storeMessage(message: {
    sessionId: string;
    type: 'customer' | 'agent';
    content: string;
    timestamp: number;
  }): Promise<void> {
    try {
      await db.chatMessages.create({
        data: {
          sessionId: message.sessionId,
          type: message.type,
          content: message.content,
          timestamp: new Date(message.timestamp)
        }
      });
    } catch (error) {
      console.error('Error storing message:', error);
      throw new Error('Failed to store message');
    }
  }

  private generateSessionId(): string {
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private isValidWhatsAppNumber(number: string): boolean {
    // Basic validation for international format: +[country code][number]
    return /^\+[1-9]\d{1,14}$/.test(number);
  }
}
