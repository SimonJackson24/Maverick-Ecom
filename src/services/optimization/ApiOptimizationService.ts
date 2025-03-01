import { MonitoringService } from '../monitoring/MonitoringService';

interface CacheConfig {
  maxAge: number; // in milliseconds
  staleWhileRevalidate?: boolean;
}

interface CacheEntry {
  data: any;
  timestamp: number;
  isRevalidating?: boolean;
}

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  cache?: CacheConfig;
}

export class ApiOptimizationService {
  private static instance: ApiOptimizationService;
  private cache: Map<string, CacheEntry>;
  private monitoring: MonitoringService;
  private pendingRequests: Map<string, Promise<any>>;
  private abortControllers: Map<string, AbortController>;

  private constructor() {
    this.cache = new Map();
    this.monitoring = MonitoringService.getInstance();
    this.pendingRequests = new Map();
    this.abortControllers = new Map();

    // Clean up expired cache entries periodically
    setInterval(() => this.cleanCache(), 5 * 60 * 1000); // every 5 minutes
  }

  public static getInstance(): ApiOptimizationService {
    if (!ApiOptimizationService.instance) {
      ApiOptimizationService.instance = new ApiOptimizationService();
    }
    return ApiOptimizationService.instance;
  }

  private getCacheKey(url: string, config: RequestConfig = {}): string {
    const { method = 'GET', body } = config;
    return `${method}:${url}:${body ? JSON.stringify(body) : ''}`;
  }

  private isResponseValid(entry: CacheEntry, maxAge: number): boolean {
    return Date.now() - entry.timestamp < maxAge;
  }

  private async cleanCache(): void {
    for (const [key, entry] of this.cache.entries()) {
      if (!this.isResponseValid(entry, 24 * 60 * 60 * 1000)) { // 24 hours max
        this.cache.delete(key);
      }
    }
  }

  private recordMetrics(url: string, startTime: number, success: boolean): void {
    const duration = Date.now() - startTime;
    this.monitoring.logMetric('api_request_duration', {
      url,
      duration,
      success,
      timestamp: new Date().toISOString(),
    });
  }

  public async request<T>(url: string, config: RequestConfig = {}): Promise<T> {
    const {
      method = 'GET',
      body,
      headers = {},
      cache: cacheConfig,
    } = config;

    const cacheKey = this.getCacheKey(url, config);
    const startTime = Date.now();

    // Return cached data if valid
    if (method === 'GET' && cacheConfig) {
      const cachedEntry = this.cache.get(cacheKey);
      if (cachedEntry && this.isResponseValid(cachedEntry, cacheConfig.maxAge)) {
        // Revalidate in background if needed
        if (cacheConfig.staleWhileRevalidate && !cachedEntry.isRevalidating) {
          this.revalidateCache(url, cacheKey, config);
        }
        this.recordMetrics(url, startTime, true);
        return cachedEntry.data;
      }
    }

    // Deduplicate in-flight requests
    const pendingRequest = this.pendingRequests.get(cacheKey);
    if (pendingRequest) {
      return pendingRequest;
    }

    // Cancel any existing request for this URL
    this.abortPreviousRequest(cacheKey);

    // Create new request
    const controller = new AbortController();
    this.abortControllers.set(cacheKey, controller);

    const request = fetch(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Cache successful GET requests
        if (method === 'GET' && cacheConfig) {
          this.cache.set(cacheKey, {
            data,
            timestamp: Date.now(),
          });
        }

        this.recordMetrics(url, startTime, true);
        return data as T;
      })
      .catch((error) => {
        this.recordMetrics(url, startTime, false);
        this.monitoring.logError('api_request_failed', {
          url,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        throw error;
      })
      .finally(() => {
        this.pendingRequests.delete(cacheKey);
        this.abortControllers.delete(cacheKey);
      });

    this.pendingRequests.set(cacheKey, request);
    return request;
  }

  private async revalidateCache(
    url: string,
    cacheKey: string,
    config: RequestConfig
  ): Promise<void> {
    const cachedEntry = this.cache.get(cacheKey);
    if (cachedEntry) {
      cachedEntry.isRevalidating = true;
      try {
        const freshData = await this.request(url, {
          ...config,
          cache: undefined, // Prevent infinite loop
        });
        this.cache.set(cacheKey, {
          data: freshData,
          timestamp: Date.now(),
        });
      } catch (error) {
        // Keep using cached data if revalidation fails
        this.monitoring.logError('cache_revalidation_failed', {
          url,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      } finally {
        if (cachedEntry) {
          cachedEntry.isRevalidating = false;
        }
      }
    }
  }

  private abortPreviousRequest(cacheKey: string): void {
    const controller = this.abortControllers.get(cacheKey);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(cacheKey);
    }
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public removeCacheEntry(url: string, config: RequestConfig = {}): void {
    const cacheKey = this.getCacheKey(url, config);
    this.cache.delete(cacheKey);
  }
}
