import { S3 } from 'aws-sdk';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { createGzip } from 'zlib';
import { pipeline } from 'stream';
import { MonitoringService } from '../monitoring/MonitoringService';

const execAsync = promisify(exec);
const pipelineAsync = promisify(pipeline);

export class BackupService {
  private static instance: BackupService;
  private s3: S3;
  private monitoring: MonitoringService;

  private constructor() {
    this.s3 = new S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    this.monitoring = MonitoringService.getInstance();
  }

  public static getInstance(): BackupService {
    if (!BackupService.instance) {
      BackupService.instance = new BackupService();
    }
    return BackupService.instance;
  }

  public async createBackup(): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '../../../backups');
    
    try {
      // Create backup directory if it doesn't exist
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      // Backup database
      await this.backupDatabase(backupDir, timestamp);

      // Backup uploaded files
      await this.backupFiles(backupDir, timestamp);

      // Upload to S3
      await this.uploadToS3(backupDir, timestamp);

      // Clean up old backups
      await this.cleanupOldBackups();

      this.monitoring.logEvent('backup_completed', {
        timestamp,
        status: 'success',
      });
    } catch (error) {
      this.monitoring.logError('backup_failed', {
        timestamp,
        error: error.message,
      });
      throw error;
    }
  }

  private async backupDatabase(backupDir: string, timestamp: string): Promise<void> {
    const dbBackupPath = path.join(backupDir, `db_${timestamp}.sql`);
    const compressedBackupPath = `${dbBackupPath}.gz`;

    try {
      // Create database dump
      await execAsync(
        `pg_dump -h ${process.env.DB_HOST} -U ${process.env.DB_USER} -d ${process.env.DB_NAME} > ${dbBackupPath}`
      );

      // Compress the dump
      await pipelineAsync(
        fs.createReadStream(dbBackupPath),
        createGzip(),
        fs.createWriteStream(compressedBackupPath)
      );

      // Remove uncompressed file
      fs.unlinkSync(dbBackupPath);

      this.monitoring.logEvent('database_backup_completed', {
        timestamp,
        file: compressedBackupPath,
      });
    } catch (error) {
      this.monitoring.logError('database_backup_failed', {
        timestamp,
        error: error.message,
      });
      throw error;
    }
  }

  private async backupFiles(backupDir: string, timestamp: string): Promise<void> {
    const uploadsDir = path.join(__dirname, '../../../uploads');
    const filesBackupPath = path.join(backupDir, `files_${timestamp}.tar.gz`);

    try {
      // Create tar archive of uploads directory
      await execAsync(`tar -czf ${filesBackupPath} -C ${uploadsDir} .`);

      this.monitoring.logEvent('files_backup_completed', {
        timestamp,
        file: filesBackupPath,
      });
    } catch (error) {
      this.monitoring.logError('files_backup_failed', {
        timestamp,
        error: error.message,
      });
      throw error;
    }
  }

  private async uploadToS3(backupDir: string, timestamp: string): Promise<void> {
    const files = fs.readdirSync(backupDir).filter(file => file.includes(timestamp));

    for (const file of files) {
      const filePath = path.join(backupDir, file);
      const key = `backups/${file}`;

      try {
        await this.s3.upload({
          Bucket: process.env.BACKUP_S3_BUCKET!,
          Key: key,
          Body: fs.createReadStream(filePath),
        }).promise();

        // Remove local file after successful upload
        fs.unlinkSync(filePath);

        this.monitoring.logEvent('backup_uploaded', {
          timestamp,
          file: key,
        });
      } catch (error) {
        this.monitoring.logError('backup_upload_failed', {
          timestamp,
          file: key,
          error: error.message,
        });
        throw error;
      }
    }
  }

  private async cleanupOldBackups(): Promise<void> {
    const retentionDays = parseInt(process.env.BACKUP_RETENTION_DAYS || '30');
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    try {
      const response = await this.s3.listObjects({
        Bucket: process.env.BACKUP_S3_BUCKET!,
        Prefix: 'backups/',
      }).promise();

      const objectsToDelete = response.Contents?.filter(obj => {
        return obj.LastModified && obj.LastModified < cutoffDate;
      });

      if (objectsToDelete && objectsToDelete.length > 0) {
        await this.s3.deleteObjects({
          Bucket: process.env.BACKUP_S3_BUCKET!,
          Delete: {
            Objects: objectsToDelete.map(obj => ({ Key: obj.Key! })),
          },
        }).promise();

        this.monitoring.logEvent('old_backups_cleaned', {
          count: objectsToDelete.length,
          retentionDays,
        });
      }
    } catch (error) {
      this.monitoring.logError('backup_cleanup_failed', {
        error: error.message,
      });
      throw error;
    }
  }

  public async restoreBackup(timestamp: string): Promise<void> {
    try {
      const backupDir = path.join(__dirname, '../../../restore');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      // Download backup files from S3
      await this.downloadBackup(backupDir, timestamp);

      // Restore database
      await this.restoreDatabase(backupDir, timestamp);

      // Restore files
      await this.restoreFiles(backupDir, timestamp);

      // Clean up restore directory
      fs.rmSync(backupDir, { recursive: true });

      this.monitoring.logEvent('backup_restored', {
        timestamp,
        status: 'success',
      });
    } catch (error) {
      this.monitoring.logError('backup_restore_failed', {
        timestamp,
        error: error.message,
      });
      throw error;
    }
  }

  private async downloadBackup(backupDir: string, timestamp: string): Promise<void> {
    const prefix = `backups/${timestamp}`;

    try {
      const response = await this.s3.listObjects({
        Bucket: process.env.BACKUP_S3_BUCKET!,
        Prefix: prefix,
      }).promise();

      for (const obj of response.Contents || []) {
        const localPath = path.join(backupDir, path.basename(obj.Key!));
        await this.s3.getObject({
          Bucket: process.env.BACKUP_S3_BUCKET!,
          Key: obj.Key!,
        }).createReadStream().pipe(fs.createWriteStream(localPath));
      }
    } catch (error) {
      throw new Error(`Failed to download backup: ${error.message}`);
    }
  }

  private async restoreDatabase(backupDir: string, timestamp: string): Promise<void> {
    const compressedBackupPath = path.join(backupDir, `db_${timestamp}.sql.gz`);
    const backupPath = path.join(backupDir, `db_${timestamp}.sql`);

    try {
      // Decompress backup
      await execAsync(`gunzip -c ${compressedBackupPath} > ${backupPath}`);

      // Restore database
      await execAsync(
        `psql -h ${process.env.DB_HOST} -U ${process.env.DB_USER} -d ${process.env.DB_NAME} < ${backupPath}`
      );
    } catch (error) {
      throw new Error(`Failed to restore database: ${error.message}`);
    }
  }

  private async restoreFiles(backupDir: string, timestamp: string): Promise<void> {
    const filesBackupPath = path.join(backupDir, `files_${timestamp}.tar.gz`);
    const uploadsDir = path.join(__dirname, '../../../uploads');

    try {
      // Clear existing uploads directory
      if (fs.existsSync(uploadsDir)) {
        fs.rmSync(uploadsDir, { recursive: true });
      }
      fs.mkdirSync(uploadsDir);

      // Extract files
      await execAsync(`tar -xzf ${filesBackupPath} -C ${uploadsDir}`);
    } catch (error) {
      throw new Error(`Failed to restore files: ${error.message}`);
    }
  }
}
