import { prisma } from '../db';
import axios from 'axios';
import semver from 'semver';
import { execSync } from 'child_process';

export interface VersionInfo {
  currentVersion: string;
  latestVersion: string;
  updateAvailable: boolean;
  releaseNotes?: string;
}

export class VersionManager {
  private static GITHUB_REPO = 'your-username/wick-and-wax-co';
  private static GITHUB_API = `https://api.github.com/repos/${VersionManager.GITHUB_REPO}`;

  static async getCurrentVersion(): Promise<string> {
    const pkg = require('../../../package.json');
    return pkg.version;
  }

  static async getLatestVersion(): Promise<string> {
    try {
      const response = await axios.get(`${VersionManager.GITHUB_API}/releases/latest`);
      return response.data.tag_name.replace('v', '');
    } catch (error) {
      console.error('Failed to fetch latest version:', error);
      throw new Error('Failed to check for updates');
    }
  }

  static async checkForUpdates(): Promise<VersionInfo> {
    const currentVersion = await this.getCurrentVersion();
    const latestVersion = await this.getLatestVersion();

    return {
      currentVersion,
      latestVersion,
      updateAvailable: semver.gt(latestVersion, currentVersion),
      releaseNotes: await this.getReleaseNotes(latestVersion),
    };
  }

  static async getReleaseNotes(version: string): Promise<string> {
    try {
      const response = await axios.get(
        `${VersionManager.GITHUB_API}/releases/tags/v${version}`
      );
      return response.data.body || 'No release notes available';
    } catch (error) {
      console.error('Failed to fetch release notes:', error);
      return 'Failed to fetch release notes';
    }
  }

  static async performUpdate(): Promise<boolean> {
    try {
      // Create backup
      await this.createBackup();

      // Pull latest changes
      execSync('git fetch origin');
      execSync('git reset --hard origin/main');

      // Install dependencies
      execSync('npm install');

      // Run migrations
      execSync('npx prisma migrate deploy');

      // Build application
      execSync('npm run build');

      // Update version in database
      const latestVersion = await this.getLatestVersion();
      await this.updateVersionInDB(latestVersion);

      return true;
    } catch (error) {
      console.error('Update failed:', error);
      await this.restoreBackup();
      throw new Error('Update failed, system restored from backup');
    }
  }

  private static async createBackup(): Promise<void> {
    try {
      // Create backup directory
      execSync('mkdir -p backups');
      
      // Backup database
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = `backups/backup-${timestamp}`;
      
      execSync(`mkdir ${backupPath}`);
      
      // Backup code
      execSync(`cp -r . ${backupPath}/code`);
      
      // Backup database using pg_dump
      const dbUrl = process.env.DATABASE_URL;
      if (dbUrl) {
        execSync(`pg_dump "${dbUrl}" > ${backupPath}/database.sql`);
      }
      
      console.log(`Backup created at ${backupPath}`);
    } catch (error) {
      console.error('Backup failed:', error);
      throw new Error('Failed to create backup');
    }
  }

  private static async restoreBackup(): Promise<void> {
    try {
      // Find latest backup
      const backups = execSync('ls -t backups').toString().split('\n');
      const latestBackup = backups[0];

      if (!latestBackup) {
        throw new Error('No backup found');
      }

      // Restore code
      execSync(`cp -r backups/${latestBackup}/code/. .`);

      // Restore database
      const dbUrl = process.env.DATABASE_URL;
      if (dbUrl) {
        execSync(`psql "${dbUrl}" < backups/${latestBackup}/database.sql`);
      }

      console.log('System restored from backup');
    } catch (error) {
      console.error('Restore failed:', error);
      throw new Error('Failed to restore from backup');
    }
  }

  private static async updateVersionInDB(version: string): Promise<void> {
    await prisma.systemSettings.upsert({
      where: { id: 1 },
      update: {
        version,
        lastUpdated: new Date(),
      },
      create: {
        id: 1,
        version,
        lastUpdated: new Date(),
      },
    });
  }
}
