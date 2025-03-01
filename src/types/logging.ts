export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  meta?: Record<string, any>;
}

export interface HealthCheckEndpoint {
  name: string;
  url: string;
  method: string;
  timeout?: number;
}

export interface AlertConfig {
  type: string;
  threshold: number;
  cooldown: number;
  message: string;
}

export interface BackupConfig {
  schedule: string;
  retention: {
    days: number;
    copies: number;
  };
  storage: {
    type: string;
    provider: string;
    bucket: string;
    path: string;
  };
}
