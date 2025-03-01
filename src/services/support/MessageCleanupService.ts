import { WhatsAppService } from './WhatsAppService';
import { db } from '../database';
import { EventEmitter } from 'events';

interface CleanupMetrics {
  totalAttempts: number;
  successfulCleanups: number;
  failedCleanups: number;
  retryCount: number;
}

export class MessageCleanupService {
  private whatsAppService: WhatsAppService;
  private metrics: CleanupMetrics;
  private readonly maxRetries: number;
  private readonly retryDelay: number;
  private readonly metricsEmitter: EventEmitter;
  private cleanupInterval: NodeJS.Timeout | null;

  constructor() {
    this.whatsAppService = new WhatsAppService();
    this.metrics = {
      totalAttempts: 0,
      successfulCleanups: 0,
      failedCleanups: 0,
      retryCount: 0
    };
    this.maxRetries = parseInt(process.env.MAX_CLEANUP_RETRIES || '3');
    this.retryDelay = parseInt(process.env.CLEANUP_RETRY_DELAY || '300000'); // 5 minutes
    this.metricsEmitter = new EventEmitter();
    this.cleanupInterval = null;
  }

  async startCleanupService(): Promise<void> {
    if (this.cleanupInterval) {
      return;
    }

    this.cleanupInterval = setInterval(
      () => this.processFailedCleanups(),
      this.retryDelay
    );

    console.log('Message cleanup service started');
  }

  stopCleanupService(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('Message cleanup service stopped');
    }
  }

  onMetricsUpdate(callback: (metrics: CleanupMetrics) => void): void {
    this.metricsEmitter.on('metricsUpdate', callback);
  }

  async processFailedCleanups(): Promise<void> {
    try {
      const failedCleanups = await db.messageCleanup.findMany({
        where: {
          status: 'failed',
          retry_count: {
            lt: this.maxRetries
          }
        },
        orderBy: {
          cleanup_scheduled_at: 'asc'
        }
      });

      for (const cleanup of failedCleanups) {
        this.metrics.totalAttempts++;
        
        try {
          await this.whatsAppService.deleteGroupMessage(cleanup.group_message_id);

          await db.messageCleanup.update({
            where: { message_id: cleanup.message_id },
            data: {
              status: 'completed',
              cleaned_at: new Date(),
              retry_count: cleanup.retry_count + 1
            }
          });

          this.metrics.successfulCleanups++;
        } catch (error) {
          this.metrics.failedCleanups++;
          this.metrics.retryCount++;

          await db.messageCleanup.update({
            where: { message_id: cleanup.message_id },
            data: {
              retry_count: cleanup.retry_count + 1,
              last_error: error.message,
              status: cleanup.retry_count + 1 >= this.maxRetries ? 'failed_permanent' : 'failed'
            }
          });

          console.error(
            `Failed to cleanup message ${cleanup.message_id} (attempt ${cleanup.retry_count + 1}/${this.maxRetries}):`,
            error
          );
        }
      }

      this.metricsEmitter.emit('metricsUpdate', this.metrics);
    } catch (error) {
      console.error('Error processing failed cleanups:', error);
    }
  }

  async getCleanupMetrics(): Promise<{
    metrics: CleanupMetrics;
    recentFailures: any[];
  }> {
    const recentFailures = await db.messageCleanup.findMany({
      where: {
        status: {
          in: ['failed', 'failed_permanent']
        }
      },
      orderBy: {
        updated_at: 'desc'
      },
      take: 10,
      include: {
        chatMessage: true
      }
    });

    return {
      metrics: this.metrics,
      recentFailures
    };
  }

  async forceCleanup(messageId: string): Promise<void> {
    const cleanup = await db.messageCleanup.findUnique({
      where: { message_id: messageId }
    });

    if (!cleanup) {
      throw new Error('Cleanup record not found');
    }

    try {
      await this.whatsAppService.deleteGroupMessage(cleanup.group_message_id);

      await db.messageCleanup.update({
        where: { message_id: messageId },
        data: {
          status: 'completed',
          cleaned_at: new Date(),
          retry_count: cleanup.retry_count + 1
        }
      });

      this.metrics.successfulCleanups++;
      this.metricsEmitter.emit('metricsUpdate', this.metrics);
    } catch (error) {
      throw new Error(`Force cleanup failed: ${error.message}`);
    }
  }

  async resetMetrics(): Promise<void> {
    this.metrics = {
      totalAttempts: 0,
      successfulCleanups: 0,
      failedCleanups: 0,
      retryCount: 0
    };
    this.metricsEmitter.emit('metricsUpdate', this.metrics);
  }
}
