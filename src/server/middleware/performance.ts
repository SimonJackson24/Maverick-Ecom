import { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import { Cache } from '../utils/cache';
import logger from '../utils/logger';

// Compression middleware
export const compressionMiddleware = compression({
  level: 6,
  threshold: 10 * 1024, // 10KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
});

// Response caching middleware
export const responseCacheMiddleware = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `response:${req.originalUrl}`;
    
    try {
      const cachedResponse = await Cache.get(key);
      if (cachedResponse) {
        return res.json(cachedResponse);
      }

      // Store original res.json
      const originalJson = res.json.bind(res);
      
      // Override res.json to cache the response
      res.json = ((data: any) => {
        Cache.set(key, data, duration)
          .catch(err => logger.error('Cache set error:', err));
        return originalJson(data);
      }) as any;

      next();
    } catch (error) {
      logger.error('Response cache error:', error);
      next();
    }
  };
};

// Query results caching middleware
export const queryCacheMiddleware = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `query:${req.originalUrl}`;
    
    try {
      const cachedResult = await Cache.get(key);
      if (cachedResult) {
        return res.json(cachedResult);
      }
      next();
    } catch (error) {
      logger.error('Query cache error:', error);
      next();
    }
  };
};

// Rate limiting with sliding window
export const slidingWindowRateLimit = (
  windowMs: number = 60000, // 1 minute
  maxRequests: number = 100
) => {
  const requests = new Map<string, number[]>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const ip = req.ip;

    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const userRequests = requests.get(ip)!;
    
    // Remove requests outside the window
    while (userRequests.length > 0 && userRequests[0] < now - windowMs) {
      userRequests.shift();
    }

    if (userRequests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil((userRequests[0] + windowMs - now) / 1000)
      });
    }

    userRequests.push(now);
    next();
  };
};

// Database connection pooling optimization
export const dbConnectionPooling = {
  max: 20,
  min: 5,
  acquire: 30000,
  idle: 10000
};

// Static asset caching
export const staticAssetCache = {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res: Response, path: string) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
};
