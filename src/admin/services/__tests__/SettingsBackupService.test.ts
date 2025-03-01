import { SettingsBackupService } from '../SettingsBackupService';
import { apolloClient } from '../../../lib/apollo';
import { BackupMetadata, RestoreResponse } from '../../types/settings';

// Mock Apollo Client
jest.mock('../../../lib/apollo', () => ({
  apolloClient: {
    query: jest.fn(),
    mutate: jest.fn(),
  },
}));

describe('SettingsBackupService', () => {
  const mockBackup: BackupMetadata = {
    id: 'backup-123',
    timestamp: '2025-02-12T00:00:00Z',
    size: 1024,
    type: 'manual',
    status: 'success',
    contents: ['general', 'inventory', 'security'],
  };

  const mockRestoreResponse: RestoreResponse = {
    success: true,
    message: 'Restore completed successfully',
    restoredSettings: ['general', 'inventory'],
    skippedSettings: [],
    errors: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBackup', () => {
    it('should create a backup with specified options', async () => {
      (apolloClient.mutate as jest.Mock).mockResolvedValueOnce({
        data: { createSettingsBackup: mockBackup },
      });

      const options = { includeMedia: true, encrypt: true };
      const backup = await SettingsBackupService.createBackup(options);

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.any(Object),
        variables: { options },
      });
      expect(backup).toEqual(mockBackup);
    });

    it('should handle backup creation errors', async () => {
      const error = new Error('Backup failed');
      (apolloClient.mutate as jest.Mock).mockRejectedValueOnce(error);

      await expect(
        SettingsBackupService.createBackup({ includeMedia: true, encrypt: true })
      ).rejects.toThrow(error);
    });
  });

  describe('getBackups', () => {
    it('should fetch all backups with network-only policy', async () => {
      (apolloClient.query as jest.Mock).mockResolvedValueOnce({
        data: { settingsBackups: [mockBackup] },
      });

      const backups = await SettingsBackupService.getBackups();

      expect(apolloClient.query).toHaveBeenCalledWith({
        query: expect.any(Object),
        fetchPolicy: 'network-only',
      });
      expect(backups).toEqual([mockBackup]);
    });
  });

  describe('restoreFromBackup', () => {
    it('should restore settings from backup with default options', async () => {
      (apolloClient.mutate as jest.Mock).mockResolvedValueOnce({
        data: { restoreSettingsFromBackup: mockRestoreResponse },
      });

      const response = await SettingsBackupService.restoreFromBackup('backup-123');

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.any(Object),
        variables: { backupId: 'backup-123', options: {} },
      });
      expect(response).toEqual(mockRestoreResponse);
    });

    it('should restore settings with custom options', async () => {
      (apolloClient.mutate as jest.Mock).mockResolvedValueOnce({
        data: { restoreSettingsFromBackup: mockRestoreResponse },
      });

      const options = { skipValidation: true, dryRun: true };
      await SettingsBackupService.restoreFromBackup('backup-123', options);

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.any(Object),
        variables: { backupId: 'backup-123', options },
      });
    });

    it('should handle restore errors', async () => {
      const errorResponse: RestoreResponse = {
        success: false,
        message: 'Restore failed',
        restoredSettings: [],
        skippedSettings: ['security'],
        errors: ['Invalid backup format'],
      };

      (apolloClient.mutate as jest.Mock).mockResolvedValueOnce({
        data: { restoreSettingsFromBackup: errorResponse },
      });

      const response = await SettingsBackupService.restoreFromBackup('backup-123');
      expect(response.success).toBe(false);
      expect(response.errors).toHaveLength(1);
    });
  });

  describe('deleteBackup', () => {
    it('should delete specified backup', async () => {
      (apolloClient.mutate as jest.Mock).mockResolvedValueOnce({
        data: { deleteSettingsBackup: { success: true, message: 'Deleted' } },
      });

      const success = await SettingsBackupService.deleteBackup('backup-123');

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.any(Object),
        variables: { backupId: 'backup-123' },
      });
      expect(success).toBe(true);
    });
  });

  describe('downloadBackup', () => {
    it('should return download URL for backup', async () => {
      const downloadUrl = 'https://example.com/backup.zip';
      (apolloClient.mutate as jest.Mock).mockResolvedValueOnce({
        data: {
          downloadSettingsBackup: {
            url: downloadUrl,
            expiresAt: '2025-02-13T00:00:00Z',
          },
        },
      });

      const url = await SettingsBackupService.downloadBackup('backup-123');

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.any(Object),
        variables: { backupId: 'backup-123' },
      });
      expect(url).toBe(downloadUrl);
    });
  });

  describe('scheduleBackup', () => {
    it('should schedule automated backups', async () => {
      (apolloClient.mutate as jest.Mock).mockResolvedValueOnce({
        data: { scheduleSettingsBackup: { success: true, message: 'Scheduled' } },
      });

      const schedule = {
        frequency: 'daily' as const,
        time: '00:00',
        retentionDays: 30,
      };
      const success = await SettingsBackupService.scheduleBackup(schedule);

      expect(apolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.any(Object),
        variables: { schedule },
      });
      expect(success).toBe(true);
    });
  });

  describe('validateBackup', () => {
    it('should validate backup integrity', async () => {
      const validationResult = {
        isValid: true,
        issues: [],
      };
      (apolloClient.query as jest.Mock).mockResolvedValueOnce({
        data: { validateSettingsBackup: validationResult },
      });

      const result = await SettingsBackupService.validateBackup('backup-123');

      expect(apolloClient.query).toHaveBeenCalledWith({
        query: expect.any(Object),
        variables: { backupId: 'backup-123' },
      });
      expect(result).toEqual(validationResult);
    });

    it('should report validation issues', async () => {
      const validationResult = {
        isValid: false,
        issues: ['Corrupted backup file', 'Missing required settings'],
      };
      (apolloClient.query as jest.Mock).mockResolvedValueOnce({
        data: { validateSettingsBackup: validationResult },
      });

      const result = await SettingsBackupService.validateBackup('backup-123');
      expect(result.isValid).toBe(false);
      expect(result.issues).toHaveLength(2);
    });
  });
});
