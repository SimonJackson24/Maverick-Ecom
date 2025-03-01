import Redis from 'ioredis';
import logger from './logger';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('error', (error) => {
  logger.error('Redis connection error:', error);
});

redis.on('connect', () => {
  logger.info('Redis connected successfully');
});

export class Cache {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  static async set(key: string, value: any, expirySeconds?: number): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      if (expirySeconds) {
        await redis.setex(key, expirySeconds, stringValue);
      } else {
        await redis.set(key, stringValue);
      }
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  }

  static async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      logger.error('Cache delete error:', error);
    }
  }

  static async flush(): Promise<void> {
    try {
      await redis.flushall();
    } catch (error) {
      logger.error('Cache flush error:', error);
    }
  }

  // Cache decorator for class methods
  static cacheMethod(keyPrefix: string, expirySeconds?: number) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;

      descriptor.value = async function (...args: any[]) {
        const key = `${keyPrefix}:${JSON.stringify(args)}`;
        
        // Try to get from cache first
        const cached = await Cache.get(key);
        if (cached) {
          return cached;
        }

        // If not in cache, execute method and cache result
        const result = await originalMethod.apply(this, args);
        await Cache.set(key, result, expirySeconds);
        return result;
      };

      return descriptor;
    };
  }

  // Cache invalidation helper
  static async invalidateByPrefix(prefix: string): Promise<void> {
    try {
      const keys = await redis.keys(`${prefix}:*`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      logger.error('Cache invalidation error:', error);
    }
  }
}

export default redis;
