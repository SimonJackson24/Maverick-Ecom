import { Request, Response, NextFunction } from 'express';
import { httpRequestDurationMicroseconds } from '../utils/metrics';
import logger from '../utils/logger';

export const requestMonitoring = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();

  // Add response listener to capture metrics after request is completed
  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;

    // Record request duration
    httpRequestDurationMicroseconds
      .labels(req.method, req.path, res.statusCode.toString())
      .observe(durationInSeconds);

    // Log request details
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: durationInSeconds,
      userAgent: req.get('user-agent'),
      ip: req.ip
    });
  });

  next();
};

// Middleware to track database query performance
export const dbQueryMonitoring = (operation: string, table: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = process.hrtime();
      
      try {
        const result = await originalMethod.apply(this, args);
        const duration = process.hrtime(start);
        const durationInSeconds = duration[0] + duration[1] / 1e9;

        // Record query duration
        dbQueryDurationMicroseconds
          .labels(operation, table)
          .observe(durationInSeconds);

        return result;
      } catch (error) {
        logger.error('Database query error', {
          operation,
          table,
          error: error.message,
          stack: error.stack
        });
        throw error;
      }
    };

    return descriptor;
  };
};
