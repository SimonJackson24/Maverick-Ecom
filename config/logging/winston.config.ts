import winston from 'winston';
import 'winston-daily-rotate-file';
import { ElasticsearchTransport } from 'winston-elasticsearch';

const LOG_DIR = process.env.LOG_DIR || '/var/log/wickandwax';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Custom format for structured logging
const customFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.metadata({
    fillExcept: ['message', 'level', 'timestamp', 'label'],
  }),
  winston.format.json()
);

// File transport with rotation
const fileRotateTransport = new winston.transports.DailyRotateFile({
  dirname: LOG_DIR,
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: customFormat,
});

// Elasticsearch transport for production
const elasticsearchTransport =
  NODE_ENV === 'production'
    ? new ElasticsearchTransport({
        level: 'info',
        clientOpts: {
          node: process.env.ELASTICSEARCH_URL,
          auth: {
            username: process.env.ELASTICSEARCH_USERNAME,
            password: process.env.ELASTICSEARCH_PASSWORD,
          },
        },
        indexPrefix: 'wickandwax-logs',
      })
    : null;

// Create logger instance
export const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: customFormat,
  defaultMeta: { service: 'wickandwax-web' },
  transports: [
    // Always write to rotating file
    fileRotateTransport,
    
    // Console transport for development
    ...(NODE_ENV !== 'production'
      ? [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            ),
          }),
        ]
      : []),
    
    // Elasticsearch transport for production
    ...(elasticsearchTransport ? [elasticsearchTransport] : []),
  ],
  
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.DailyRotateFile({
      dirname: LOG_DIR,
      filename: 'exceptions-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: customFormat,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.DailyRotateFile({
      dirname: LOG_DIR,
      filename: 'rejections-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: customFormat,
    }),
  ],
});

// Custom log levels
export const LogLevels = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  HTTP: 'http',
  DEBUG: 'debug',
};

// Log message types
interface LogMessage {
  message: string;
  metadata?: Record<string, any>;
}

// Logging utility functions
export const logError = (log: LogMessage) => {
  logger.error(log.message, { metadata: log.metadata });
};

export const logWarn = (log: LogMessage) => {
  logger.warn(log.message, { metadata: log.metadata });
};

export const logInfo = (log: LogMessage) => {
  logger.info(log.message, { metadata: log.metadata });
};

export const logHttp = (log: LogMessage) => {
  logger.http(log.message, { metadata: log.metadata });
};

export const logDebug = (log: LogMessage) => {
  logger.debug(log.message, { metadata: log.metadata });
};

// Request logging middleware
export const requestLogger = () => {
  return (req: any, res: any, next: any) => {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      
      logHttp({
        message: 'HTTP Request',
        metadata: {
          method: req.method,
          url: req.url,
          status: res.statusCode,
          duration,
          userAgent: req.get('user-agent'),
          ip: req.ip,
          userId: req.user?.id,
        },
      });
    });

    next();
  };
};

// Error logging middleware
export const errorLogger = () => {
  return (err: any, req: any, res: any, next: any) => {
    logError({
      message: 'Request Error',
      metadata: {
        error: {
          message: err.message,
          stack: err.stack,
          code: err.code,
        },
        request: {
          method: req.method,
          url: req.url,
          headers: req.headers,
          query: req.query,
          body: req.body,
        },
        user: req.user,
      },
    });

    next(err);
  };
};

// Performance logging
export const logPerformance = (
  operation: string,
  duration: number,
  metadata?: Record<string, any>
) => {
  logInfo({
    message: 'Performance Metric',
    metadata: {
      operation,
      duration,
      ...metadata,
    },
  });
};

// Audit logging
export const logAudit = (
  action: string,
  userId: string,
  details: Record<string, any>
) => {
  logInfo({
    message: 'Audit Log',
    metadata: {
      action,
      userId,
      timestamp: new Date().toISOString(),
      ...details,
    },
  });
};
