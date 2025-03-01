import { monitoringConfig } from '../../../config/monitoring/monitoring-config';
import { LogLevel } from '../../types/logging';

interface ErrorContext {
  message: string;
  stack?: string;
  componentName?: string;
  userId?: string;
  url?: string;
  userAgent?: string;
  timestamp: string;
  additionalContext?: Record<string, any>;
}

interface PerformanceMetric {
  name: string;
  value: number;
  tags?: Record<string, string>;
  timestamp: string;
}

interface Logger {
  debug: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
}

export class MonitoringService {
  private static instance: MonitoringService;
  private logger: Logger;
  private metrics: Map<string, number>;

  private constructor() {
    this.logger = this.createLogger();
    this.metrics = new Map();
    this.setupPerformanceMonitoring();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private createLogger(): Logger {
    const { level, consoleOptions } = monitoringConfig.logging;
    const timestamp = consoleOptions.timestamp ? () => new Date().toISOString() : undefined;

    return {
      debug: (message: string, ...args: any[]) => {
        if (level <= LogLevel.DEBUG) {
          console.debug(timestamp ? `${timestamp()} ${message}` : message, ...args);
        }
      },
      info: (message: string, ...args: any[]) => {
        if (level <= LogLevel.INFO) {
          console.info(timestamp ? `${timestamp()} ${message}` : message, ...args);
        }
      },
      warn: (message: string, ...args: any[]) => {
        if (level <= LogLevel.WARN) {
          console.warn(timestamp ? `${timestamp()} ${message}` : message, ...args);
        }
      },
      error: (message: string, ...args: any[]) => {
        if (level <= LogLevel.ERROR) {
          console.error(timestamp ? `${timestamp()} ${message}` : message, ...args);
        }
      }
    };
  }

  private setupPerformanceMonitoring(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => this.measurePageLoad());
      this.observeNetworkRequests();
      this.observeLongTasks();
    }
  }

  public logError(errorType: string, context: Omit<ErrorContext, 'timestamp'>): void {
    const errorContext: ErrorContext = {
      ...context,
      timestamp: new Date().toISOString(),
    };

    this.logger.error(`[${errorType}]`, errorContext);

    // Send to error tracking service if configured
    if (monitoringConfig.errorTracking.enabled) {
      // Implementation for error tracking service
    }
  }

  public logMetric(name: string, data: Omit<PerformanceMetric, 'timestamp' | 'name'>): void {
    const metric: PerformanceMetric = {
      name,
      ...data,
      timestamp: new Date().toISOString(),
    };

    this.metrics.set(name, metric.value);
    this.logger.info(`[Metric] ${name}:`, metric);

    // Send to metrics service if configured
    if (monitoringConfig.metrics.enabled) {
      // Implementation for metrics service
    }
  }

  private measurePageLoad(): void {
    if (typeof window !== 'undefined' && window.performance) {
      const timing = window.performance.timing;
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      this.logMetric('page_load_time', { value: pageLoadTime });
    }
  }

  private observeNetworkRequests(): void {
    if (typeof window !== 'undefined') {
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const startTime = performance.now();
        try {
          const response = await originalFetch(...args);
          const endTime = performance.now();
          this.logMetric('network_request_duration', {
            value: endTime - startTime,
            tags: {
              url: typeof args[0] === 'string' ? args[0] : 'unknown',
              status: response.status.toString(),
            },
          });
          return response;
        } catch (error) {
          const endTime = performance.now();
          this.logError('network_request_error', {
            message: error instanceof Error ? error.message : 'Unknown error',
            additionalContext: {
              url: typeof args[0] === 'string' ? args[0] : 'unknown',
              duration: endTime - startTime,
            },
          });
          throw error;
        }
      };
    }
  }

  private observeLongTasks(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.logMetric('long_task_duration', {
            value: entry.duration,
            tags: {
              entryType: entry.entryType,
              name: entry.name,
            },
          });
        });
      });

      observer.observe({ entryTypes: ['longtask'] });
    }
  }
}

export const monitoring = MonitoringService.getInstance();
