import { gql } from '@apollo/client';
import { apolloClient } from '../../lib/apollo';
import { BackupMetadata, RestoreResponse } from '../types/settings';

export class SettingsBackupService {
  static async createBackup(options: {
    includeMedia: boolean;
    encrypt: boolean;
  }): Promise<BackupMetadata> {
    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation CreateSettingsBackup($options: BackupOptionsInput!) {
          createSettingsBackup(options: $options) {
            id
            timestamp
            size
            type
            status
            contents
          }
        }
      `,
      variables: { options },
    });

    return data.createSettingsBackup;
  }

  static async getBackups(): Promise<BackupMetadata[]> {
    const { data } = await apolloClient.query({
      query: gql`
        query GetSettingsBackups {
          settingsBackups {
            id
            timestamp
            size
            type
            status
            contents
          }
        }
      `,
      fetchPolicy: 'network-only',
    });

    return data.settingsBackups;
  }

  static async restoreFromBackup(
    backupId: string,
    options: {
      skipValidation?: boolean;
      dryRun?: boolean;
    } = {}
  ): Promise<RestoreResponse> {
    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation RestoreSettingsFromBackup(
          $backupId: ID!
          $options: RestoreOptionsInput
        ) {
          restoreSettingsFromBackup(backupId: $backupId, options: $options) {
            success
            message
            restoredSettings
            skippedSettings
            errors
          }
        }
      `,
      variables: { backupId, options },
    });

    return data.restoreSettingsFromBackup;
  }

  static async deleteBackup(backupId: string): Promise<boolean> {
    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation DeleteSettingsBackup($backupId: ID!) {
          deleteSettingsBackup(backupId: $backupId) {
            success
            message
          }
        }
      `,
      variables: { backupId },
    });

    return data.deleteSettingsBackup.success;
  }

  static async downloadBackup(backupId: string): Promise<string> {
    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation DownloadSettingsBackup($backupId: ID!) {
          downloadSettingsBackup(backupId: $backupId) {
            url
            expiresAt
          }
        }
      `,
      variables: { backupId },
    });

    return data.downloadSettingsBackup.url;
  }

  static async scheduleBackup(schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    retentionDays: number;
  }): Promise<boolean> {
    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation ScheduleSettingsBackup($schedule: BackupScheduleInput!) {
          scheduleSettingsBackup(schedule: $schedule) {
            success
            message
          }
        }
      `,
      variables: { schedule },
    });

    return data.scheduleSettingsBackup.success;
  }

  static async validateBackup(backupId: string): Promise<{
    isValid: boolean;
    issues: string[];
  }> {
    const { data } = await apolloClient.query({
      query: gql`
        query ValidateSettingsBackup($backupId: ID!) {
          validateSettingsBackup(backupId: $backupId) {
            isValid
            issues
          }
        }
      `,
      variables: { backupId },
    });

    return data.validateSettingsBackup;
  }
}
