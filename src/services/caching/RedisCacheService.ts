import Redis from 'ioredis';
import { MonitoringService } from '../monitoring/MonitoringService';

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
}

export class RedisCacheService {
  private static instance: RedisCacheService;
  private redis: Redis;
  private monitoring: MonitoringService;

  private constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.monitoring = MonitoringService.getInstance();

    this.redis.on('error', (error) => {
      this.monitoring.logError('redis_connection_error', {
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    });

    this.redis.on('connect', () => {
      this.monitoring.logEvent('redis_connected', {
        timestamp: new Date().toISOString(),
      });
    });
  }

  public static getInstance(): RedisCacheService {
    if (!RedisCacheService.instance) {
      RedisCacheService.instance = new RedisCacheService();
    }
    return RedisCacheService.instance;
  }

  private getKey(key: string): string {
    return `ww:${key}`;
  }

  private getTagKey(tag: string): string {
    return `ww:tag:${tag}`;
  }

  public async get<T>(key: string): Promise<T | null> {
    const startTime = Date.now();
    try {
      const data = await this.redis.get(this.getKey(key));
      
      this.monitoring.logMetric('redis_get', {
        key,
        duration: Date.now() - startTime,
        hit: !!data,
      });

      return data ? JSON.parse(data) : null;
    } catch (error) {
      this.monitoring.logError('redis_get_error', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  public async set<T>(
    key: string,
    value: T,
    options: CacheOptions = {}
  ): Promise<void> {
    const startTime = Date.now();
    const { ttl, tags } = options;

    try {
      const pipeline = this.redis.pipeline();
      const cacheKey = this.getKey(key);

      // Store the value
      if (ttl) {
        pipeline.setex(cacheKey, ttl, JSON.stringify(value));
      } else {
        pipeline.set(cacheKey, JSON.stringify(value));
      }

      // Store tag associations
      if (tags?.length) {
        for (const tag of tags) {
          const tagKey = this.getTagKey(tag);
          pipeline.sadd(tagKey, cacheKey);
        }
      }

      await pipeline.exec();

      this.monitoring.logMetric('redis_set', {
        key,
        duration: Date.now() - startTime,
        ttl,
        tags,
      });
    } catch (error) {
      this.monitoring.logError('redis_set_error', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  public async invalidateByTag(tag: string): Promise<void> {
    const startTime = Date.now();
    try {
      const tagKey = this.getTagKey(tag);
      const keys = await this.redis.smembers(tagKey);

      if (keys.length > 0) {
        const pipeline = this.redis.pipeline();
        pipeline.del(...keys);
        pipeline.del(tagKey);
        await pipeline.exec();
      }

      this.monitoring.logMetric('redis_invalidate_tag', {
        tag,
        keysInvalidated: keys.length,
        duration: Date.now() - startTime,
      });
    } catch (error) {
      this.monitoring.logError('redis_invalidate_tag_error', {
        tag,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  public async invalidateByPattern(pattern: string): Promise<void> {
    const startTime = Date.now();
    try {
      const keys = await this.redis.keys(this.getKey(pattern));
      
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }

      this.monitoring.logMetric('redis_invalidate_pattern', {
        pattern,
        keysInvalidated: keys.length,
        duration: Date.now() - startTime,
      });
    } catch (error) {
      this.monitoring.logError('redis_invalidate_pattern_error', {
        pattern,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  public async clear(): Promise<void> {
    const startTime = Date.now();
    try {
      await this.redis.flushdb();
      
      this.monitoring.logEvent('redis_cache_cleared', {
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
      });
    } catch (error) {
      this.monitoring.logError('redis_clear_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  public async getHealth(): Promise<{
    status: 'healthy' | 'unhealthy';
    memoryUsage: number;
    connectedClients: number;
  }> {
    try {
      const info = await this.redis.info();
      const metrics = info.split('\n').reduce((acc: any, line) => {
        const [key, value] = line.split(':');
        if (key && value) {
          acc[key.trim()] = value.trim();
        }
        return acc;
      }, {});

      return {
        status: 'healthy',
        memoryUsage: parseInt(metrics.used_memory || '0'),
        connectedClients: parseInt(metrics.connected_clients || '0'),
      };
    } catch (error) {
      this.monitoring.logError('redis_health_check_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      return {
        status: 'unhealthy',
        memoryUsage: 0,
        connectedClients: 0,
      };
    }
  }
}
