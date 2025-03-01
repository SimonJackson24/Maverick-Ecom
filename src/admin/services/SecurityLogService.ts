import { GraphQLClient } from 'graphql-request';

export enum SecurityEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_COMPLETE = 'PASSWORD_RESET_COMPLETE',
  SETUP_2FA = 'SETUP_2FA',
  VERIFY_2FA = 'VERIFY_2FA',
  USE_BACKUP_CODE = 'USE_BACKUP_CODE',
  GENERATE_BACKUP_CODES = 'GENERATE_BACKUP_CODES',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_UNLOCKED = 'ACCOUNT_UNLOCKED'
}

export interface SecurityEvent {
  id: string;
  eventType: SecurityEventType;
  userId: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  location?: {
    city?: string;
    country?: string;
    region?: string;
  };
  deviceInfo?: {
    type: string;
    os: string;
    browser: string;
  };
  details?: Record<string, any>;
  status: 'success' | 'failure';
}

class SecurityLogService {
  private static instance: SecurityLogService;
  private client: GraphQLClient;

  private constructor() {
    this.client = new GraphQLClient('/api/admin/graphql', {
      credentials: 'include',
    });
  }

  public static getInstance(): SecurityLogService {
    if (!SecurityLogService.instance) {
      SecurityLogService.instance = new SecurityLogService();
    }
    return SecurityLogService.instance;
  }

  public async logEvent(
    eventType: SecurityEventType,
    details?: Record<string, any>,
    status: 'success' | 'failure' = 'success'
  ): Promise<void> {
    const mutation = `
      mutation LogSecurityEvent($input: SecurityEventInput!) {
        logSecurityEvent(input: $input) {
          id
          eventType
          timestamp
        }
      }
    `;

    try {
      await this.client.request(mutation, {
        input: {
          eventType,
          details,
          status,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
      // Don't throw - we don't want to break the app flow if logging fails
    }
  }

  public async getRecentEvents(limit: number = 10): Promise<SecurityEvent[]> {
    const query = `
      query GetRecentSecurityEvents($limit: Int!) {
        recentSecurityEvents(limit: $limit) {
          id
          eventType
          userId
          timestamp
          ipAddress
          userAgent
          location {
            city
            country
            region
          }
          deviceInfo {
            type
            os
            browser
          }
          details
          status
        }
      }
    `;

    try {
      const response = await this.client.request(query, { limit });
      return response.recentSecurityEvents;
    } catch (error) {
      console.error('Failed to fetch security events:', error);
      throw error;
    }
  }

  public async getUserEvents(userId: string, limit: number = 10): Promise<SecurityEvent[]> {
    const query = `
      query GetUserSecurityEvents($userId: ID!, $limit: Int!) {
        userSecurityEvents(userId: $userId, limit: $limit) {
          id
          eventType
          timestamp
          ipAddress
          userAgent
          location {
            city
            country
            region
          }
          deviceInfo {
            type
            os
            browser
          }
          details
          status
        }
      }
    `;

    try {
      const response = await this.client.request(query, { userId, limit });
      return response.userSecurityEvents;
    } catch (error) {
      console.error('Failed to fetch user security events:', error);
      throw error;
    }
  }

  public async getFailedLoginAttempts(
    userId: string,
    timeWindow: number = 30 * 60 * 1000 // 30 minutes
  ): Promise<number> {
    const query = `
      query GetFailedLoginAttempts($userId: ID!, $since: DateTime!) {
        failedLoginAttempts(userId: $userId, since: $since)
      }
    `;

    try {
      const response = await this.client.request(query, {
        userId,
        since: new Date(Date.now() - timeWindow).toISOString(),
      });
      return response.failedLoginAttempts;
    } catch (error) {
      console.error('Failed to fetch failed login attempts:', error);
      return 0; // Default to 0 to prevent account lockout issues
    }
  }

  public async detectSuspiciousActivity(event: Partial<SecurityEvent>): Promise<boolean> {
    const query = `
      query DetectSuspiciousActivity($event: SecurityEventInput!) {
        isSuspiciousActivity(event: $event)
      }
    `;

    try {
      const response = await this.client.request(query, { event });
      return response.isSuspiciousActivity;
    } catch (error) {
      console.error('Failed to detect suspicious activity:', error);
      return false; // Default to false to prevent false positives
    }
  }
}

export const securityLogService = SecurityLogService.getInstance();
