import { client } from './apollo';
import { gql } from '@apollo/client';
import { mockSystemSettings } from './support/mockData';

export interface SystemSettings {
  support?: {
    chatProvider: string;
    whatsappNumber: string;
    whatsappApiKey: string;
    enableGroupChat: boolean;
    messageCleanupDelay: number;
    operatingHours: {
      start: string;
      end: string;
    };
    autoReply: {
      enabled: boolean;
      message: string;
    };
    notificationEmail: string;
  };
}

const GET_SYSTEM_SETTINGS = gql`
  query GetSystemSettings {
    systemSettings {
      support {
        chatProvider
        whatsappNumber
        whatsappApiKey
        enableGroupChat
        messageCleanupDelay
        operatingHours {
          start
          end
        }
        autoReply {
          enabled
          message
        }
        notificationEmail
      }
    }
  }
`;

const UPDATE_SYSTEM_SETTINGS = gql`
  mutation UpdateSystemSettings($settings: SystemSettingsInput!) {
    updateSystemSettings(settings: $settings) {
      success
      message
    }
  }
`;

export class SystemSettingsService {
  private static instance: SystemSettingsService;
  private readonly isDev = process.env.NODE_ENV === 'development';

  private constructor() {}

  public static getInstance(): SystemSettingsService {
    if (!SystemSettingsService.instance) {
      SystemSettingsService.instance = new SystemSettingsService();
    }
    return SystemSettingsService.instance;
  }

  public static async getSettings(): Promise<SystemSettings> {
    const instance = SystemSettingsService.getInstance();
    
    if (instance.isDev) {
      return {
        support: mockSystemSettings.support
      };
    }

    try {
      const { data } = await client.query({
        query: GET_SYSTEM_SETTINGS
      });
      return data.systemSettings;
    } catch (error) {
      console.error('Failed to fetch system settings:', error);
      throw new Error('Failed to fetch system settings');
    }
  }

  public static async updateSettings(settings: SystemSettings): Promise<SystemSettings> {
    const instance = SystemSettingsService.getInstance();
    
    if (instance.isDev) {
      console.log('Mock: Updating system settings', settings);
      if (settings.support) {
        mockSystemSettings.support = {
          ...mockSystemSettings.support,
          ...settings.support
        };
      }
      return {
        support: mockSystemSettings.support
      };
    }

    try {
      const { data } = await client.mutate({
        mutation: UPDATE_SYSTEM_SETTINGS,
        variables: { settings }
      });
      return data.updateSystemSettings;
    } catch (error) {
      console.error('Failed to update system settings:', error);
      throw new Error('Failed to update system settings');
    }
  }
}
