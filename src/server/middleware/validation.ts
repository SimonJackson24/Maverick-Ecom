import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { sanitize } from 'express-validator';
import { validate as uuidValidate } from 'uuid';
import logger from '../utils/logger';

// Custom validation middleware
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    next();
  };
};

// UUID validation
export const validateUUID = (value: string): boolean => {
  return uuidValidate(value);
};

// UUID validation middleware
export const validateUUIDParam = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.params[paramName];
    if (!validateUUID(value)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `Invalid UUID format for parameter: ${paramName}`
      });
    }
    next();
  };
};

// Sanitization middleware
export const sanitizeData = () => {
  return [
    // Sanitize body
    sanitize('*').trim().escape(),
    
    // Custom sanitization for specific fields
    (req: Request, _res: Response, next: NextFunction) => {
      if (req.body) {
        // Allow HTML in specific fields
        const htmlAllowedFields = ['description', 'content'];
        
        for (const field of htmlAllowedFields) {
          if (req.body[field]) {
            req.body[field] = req.body[field].trim();
          }
        }

        // Remove sensitive fields
        const sensitiveFields = ['password', 'token', 'apiKey'];
        for (const field of sensitiveFields) {
          if (req.body[field]) {
            logger.debug(`Removed sensitive field: ${field}`);
            delete req.body[field];
          }
        }
      }
      next();
    }
  ];
};

// Rate limiting check
export const checkRateLimit = (
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
) => {
  const requests = new Map();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const now = Date.now();
    const userRequests = requests.get(ip) || [];

    // Remove old requests outside the window
    const recentRequests = userRequests.filter(
      (timestamp: number) => now - timestamp < windowMs
    );

    if (recentRequests.length >= maxRequests) {
      logger.warn(`Rate limit exceeded for IP: ${ip}`);
      return res.status(429).json({
        status: 'error',
        message: 'Too many requests, please try again later'
      });
    }

    recentRequests.push(now);
    requests.set(ip, recentRequests);

    next();
  };
};

// Schema validation middleware
export const validateSchema = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      });
    }
    next();
  };
};

// Error handling middleware
export const errorHandler = (
  error: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error:', error);

  if (error instanceof Error) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors: [error.message]
    });
  }

  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};
