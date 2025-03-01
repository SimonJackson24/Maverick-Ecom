import { gql } from '@apollo/client';
import { apolloClient } from '../../lib/apollo';
import { SystemSettings } from '../types';

export class SystemSettingsService {
  static async getSettings(): Promise<SystemSettings> {
    const { data } = await apolloClient.query({
      query: gql`
        query GetSystemSettings {
          systemSettings {
            general {
              siteName
              supportEmail
              phoneNumber
              timezone
              dateFormat
              currency
            }
            inventory {
              lowStockThreshold
              enableAutoReorder
              autoReorderThreshold
              defaultSupplier
            }
            notifications {
              enableEmailNotifications
              enableSmsNotifications
              lowStockAlerts
              orderStatusUpdates
              customerReviewAlerts
            }
            security {
              requireTwoFactor
              passwordExpiryDays
              sessionTimeoutMinutes
              maxLoginAttempts
            }
            analytics {
              enableGoogleAnalytics
              googleAnalyticsId
              enableHeatmaps
              trackUserBehavior
            }
            scents {
              enableSeasonalRecommendations
              enablePersonalization
              defaultIntensityLevel
              maxScentCombinations
            }
          }
        }
      `,
      fetchPolicy: 'network-only',
    });

    return data.systemSettings;
  }

  static async updateSettings(settings: SystemSettings): Promise<void> {
    await apolloClient.mutate({
      mutation: gql`
        mutation UpdateSystemSettings($settings: SystemSettingsInput!) {
          updateSystemSettings(settings: $settings) {
            success
            message
          }
        }
      `,
      variables: { settings },
    });
  }

  static async resetSettings(): Promise<void> {
    await apolloClient.mutate({
      mutation: gql`
        mutation ResetSystemSettings {
          resetSystemSettings {
            success
            message
          }
        }
      `,
    });
  }

  static async exportSettings(): Promise<string> {
    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation ExportSystemSettings {
          exportSystemSettings {
            url
            expiresAt
          }
        }
      `,
    });

    return data.exportSystemSettings.url;
  }

  static async importSettings(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('settings', file);

    await apolloClient.mutate({
      mutation: gql`
        mutation ImportSystemSettings($file: Upload!) {
          importSystemSettings(file: $file) {
            success
            message
          }
        }
      `,
      variables: { file },
    });
  }
}
