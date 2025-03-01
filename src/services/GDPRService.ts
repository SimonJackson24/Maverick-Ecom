import { CookieService } from './CookieService';

export interface PersonalData {
  userId: string;
  email: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
  };
  orders?: Array<{
    orderId: string;
    date: string;
    items: Array<{
      productId: string;
      quantity: number;
    }>;
  }>;
  preferences?: {
    marketing: boolean;
    newsletter: boolean;
    productUpdates: boolean;
  };
  activityLog?: Array<{
    timestamp: string;
    action: string;
    details: string;
  }>;
}

export interface DataExport {
  personalData: PersonalData;
  cookies: Record<string, string>;
  metadata: {
    exportDate: string;
    exportId: string;
    format: string;
  };
}

export class GDPRService {
  private static instance: GDPRService;
  private readonly retentionPeriod = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

  private constructor() {}

  public static getInstance(): GDPRService {
    if (!GDPRService.instance) {
      GDPRService.instance = new GDPRService();
    }
    return GDPRService.instance;
  }

  /**
   * Retrieves all personal data associated with a user
   */
  public async getPersonalData(userId: string): Promise<PersonalData | null> {
    try {
      // Implementation would fetch data from your backend
      const response = await fetch(`/api/users/${userId}/personal-data`);
      if (!response.ok) throw new Error('Failed to fetch personal data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching personal data:', error);
      return null;
    }
  }

  /**
   * Exports user data in a portable format (JSON)
   */
  public async exportData(userId: string): Promise<DataExport | null> {
    try {
      const personalData = await this.getPersonalData(userId);
      if (!personalData) throw new Error('No personal data found');

      const cookies = CookieService.getAll();
      
      const exportData: DataExport = {
        personalData,
        cookies,
        metadata: {
          exportDate: new Date().toISOString(),
          exportId: `export-${userId}-${Date.now()}`,
          format: 'json'
        }
      };

      return exportData;
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }

  /**
   * Updates user's personal data
   */
  public async updatePersonalData(userId: string, updates: Partial<PersonalData>): Promise<boolean> {
    try {
      const response = await fetch(`/api/users/${userId}/personal-data`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating personal data:', error);
      return false;
    }
  }

  /**
   * Deletes user's account and all associated data
   */
  public async deleteAccount(userId: string): Promise<boolean> {
    try {
      // Delete user data
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete account');

      // Clear local storage and cookies
      localStorage.clear();
      CookieService.deleteAll();

      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      return false;
    }
  }

  /**
   * Restricts processing of user's data
   */
  public async restrictProcessing(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/users/${userId}/restrict-processing`, {
        method: 'POST',
      });

      return response.ok;
    } catch (error) {
      console.error('Error restricting processing:', error);
      return false;
    }
  }

  /**
   * Updates user's marketing preferences
   */
  public async updateMarketingPreferences(
    userId: string,
    preferences: { marketing: boolean; newsletter: boolean; productUpdates: boolean }
  ): Promise<boolean> {
    try {
      const response = await fetch(`/api/users/${userId}/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating marketing preferences:', error);
      return false;
    }
  }

  /**
   * Logs data processing activity
   */
  public async logActivity(userId: string, action: string, details: string): Promise<void> {
    try {
      await fetch(`/api/activity-log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          action,
          details,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  /**
   * Checks if data retention period has expired
   */
  public isDataExpired(timestamp: string): boolean {
    const dataDate = new Date(timestamp).getTime();
    const now = Date.now();
    return now - dataDate > this.retentionPeriod;
  }

  /**
   * Anonymizes expired data
   */
  public async anonymizeExpiredData(): Promise<void> {
    try {
      await fetch('/api/data/anonymize-expired', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error anonymizing expired data:', error);
    }
  }

  /**
   * Handles data breach notification
   */
  public async reportDataBreach(
    description: string,
    affectedUsers: string[],
    severity: 'low' | 'medium' | 'high'
  ): Promise<boolean> {
    try {
      const response = await fetch('/api/data-breach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          affectedUsers,
          severity,
          timestamp: new Date().toISOString(),
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error reporting data breach:', error);
      return false;
    }
  }
}
