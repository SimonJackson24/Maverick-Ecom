import { LogLevel } from '../../src/types/logging';

export const monitoringConfig = {
  logging: {
    level: import.meta.env.PROD ? LogLevel.INFO : LogLevel.DEBUG,
    format: 'browser',
    transports: ['console'],
    consoleOptions: {
      colors: true,
      timestamp: true,
    },
  },
  metrics: {
    enabled: true,
    interval: 60000, // 1 minute
    prefix: 'wickandwax',
    defaultLabels: {
      environment: import.meta.env.MODE || 'development',
      service: 'e-commerce',
    },
  },
  errorTracking: {
    enabled: true,
    sampleRate: import.meta.env.PROD ? 0.1 : 1.0, // 10% in prod, 100% in dev
    ignoreErrors: [
      'Network request failed',
      'Failed to fetch',
      'Load failed',
    ],
    tags: {
      environment: import.meta.env.MODE || 'development',
      service: 'e-commerce',
    },
  },
  alerts: {
    endpoints: {
      slack: import.meta.env.VITE_ALERT_WEBHOOK_SLACK,
      email: import.meta.env.VITE_ALERT_EMAIL,
    },
    thresholds: {
      errorRate: 0.01, // 1% error rate
      responseTime: 1000, // 1 second
      memoryUsage: 0.9, // 90% memory usage
      cpuUsage: 0.8, // 80% CPU usage
      diskUsage: 0.9, // 90% disk usage
    },
    intervals: {
      check: 300000, // 5 minutes
      notify: 3600000, // 1 hour
    },
  },
  tracing: {
    enabled: true,
    sampling: {
      rate: import.meta.env.PROD ? 0.1 : 1.0, // 10% in prod, 100% in dev
    },
    exporters: {
      browser: {
        enabled: true,
      },
    },
  },
  apm: {
    enabled: true,
    serviceName: 'wickandwax-frontend',
    environment: import.meta.env.MODE || 'development',
    sampleRate: import.meta.env.PROD ? 0.1 : 1.0,
  },
  profiling: {
    enabled: import.meta.env.DEV,
    sampleRate: 0.01,
  },
};
