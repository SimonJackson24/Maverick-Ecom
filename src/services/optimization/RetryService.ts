import { MonitoringService } from '../monitoring/MonitoringService';

interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryableStatuses: number[];
}

interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  halfOpenRequests: number;
}

interface BatchConfig {
  maxBatchSize: number;
  maxWaitTime: number;
}

export class RetryService {
  private static instance: RetryService;
  private monitoring: MonitoringService;
  private circuitStates: Map<string, CircuitBreakerState>;
  private batchQueues: Map<string, BatchQueue>;

  private constructor() {
    this.monitoring = MonitoringService.getInstance();
    this.circuitStates = new Map();
    this.batchQueues = new Map();
  }

  public static getInstance(): RetryService {
    if (!RetryService.instance) {
      RetryService.instance = new RetryService();
    }
    return RetryService.instance;
  }

  public async executeWithRetry<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<T> {
    const retryConfig: RetryConfig = {
      maxRetries: 3,
      initialDelay: 1000,
      maxDelay: 10000,
      backoffFactor: 2,
      retryableStatuses: [408, 429, 500, 502, 503, 504],
      ...config,
    };

    let lastError: Error | null = null;
    let delay = retryConfig.initialDelay;

    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        const result = await operation();
        if (attempt > 0) {
          this.monitoring.logEvent('retry_success', {
            attempt,
            delay,
          });
        }
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (this.shouldRetry(error, retryConfig) && attempt < retryConfig.maxRetries) {
          this.monitoring.logEvent('retry_attempt', {
            attempt,
            delay,
            error: lastError.message,
          });
          
          await this.sleep(delay);
          delay = Math.min(delay * retryConfig.backoffFactor, retryConfig.maxDelay);
          continue;
        }
        
        throw lastError;
      }
    }

    throw lastError;
  }

  private shouldRetry(error: any, config: RetryConfig): boolean {
    if (error?.response?.status) {
      return config.retryableStatuses.includes(error.response.status);
    }
    return error instanceof Error && 
           (error.message.includes('timeout') || 
            error.message.includes('network') ||
            error.message.includes('connection'));
  }

  public async executeWithCircuitBreaker<T>(
    endpoint: string,
    operation: () => Promise<T>,
    config: Partial<CircuitBreakerConfig> = {}
  ): Promise<T> {
    const circuitConfig: CircuitBreakerConfig = {
      failureThreshold: 5,
      resetTimeout: 60000,
      halfOpenRequests: 1,
      ...config,
    };

    let state = this.getCircuitState(endpoint);
    
    if (!state) {
      state = {
        status: 'CLOSED',
        failures: 0,
        lastFailure: null,
        halfOpenCount: 0,
      };
      this.circuitStates.set(endpoint, state);
    }

    if (state.status === 'OPEN') {
      if (Date.now() - (state.lastFailure || 0) > circuitConfig.resetTimeout) {
        state.status = 'HALF_OPEN';
        state.halfOpenCount = 0;
      } else {
        throw new Error(`Circuit breaker is OPEN for endpoint: ${endpoint}`);
      }
    }

    if (state.status === 'HALF_OPEN' && state.halfOpenCount >= circuitConfig.halfOpenRequests) {
      throw new Error(`Circuit breaker is HALF_OPEN and at capacity for endpoint: ${endpoint}`);
    }

    try {
      if (state.status === 'HALF_OPEN') {
        state.halfOpenCount++;
      }

      const result = await operation();
      
      // Success, close the circuit
      state.status = 'CLOSED';
      state.failures = 0;
      state.lastFailure = null;
      state.halfOpenCount = 0;

      return result;
    } catch (error) {
      state.failures++;
      state.lastFailure = Date.now();

      if (state.failures >= circuitConfig.failureThreshold) {
        state.status = 'OPEN';
        this.monitoring.logEvent('circuit_breaker_opened', {
          endpoint,
          failures: state.failures,
        });
      }

      throw error;
    }
  }

  public async executeBatch<T, R>(
    key: string,
    item: T,
    batchOperation: (items: T[]) => Promise<R[]>,
    config: Partial<BatchConfig> = {}
  ): Promise<R> {
    const batchConfig: BatchConfig = {
      maxBatchSize: 10,
      maxWaitTime: 50,
      ...config,
    };

    let queue = this.batchQueues.get(key);
    if (!queue) {
      queue = new BatchQueue<T, R>(key, batchOperation, batchConfig, this.monitoring);
      this.batchQueues.set(key, queue);
    }

    return queue.add(item);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getCircuitState(endpoint: string): CircuitBreakerState | undefined {
    return this.circuitStates.get(endpoint);
  }
}

interface CircuitBreakerState {
  status: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failures: number;
  lastFailure: number | null;
  halfOpenCount: number;
}

class BatchQueue<T, R> {
  private items: T[] = [];
  private promises: Array<{ resolve: (value: R) => void; reject: (error: any) => void }> = [];
  private timeout: NodeJS.Timeout | null = null;
  private processing = false;

  constructor(
    private key: string,
    private batchOperation: (items: T[]) => Promise<R[]>,
    private config: BatchConfig,
    private monitoring: MonitoringService
  ) {}

  public add(item: T): Promise<R> {
    return new Promise((resolve, reject) => {
      this.items.push(item);
      this.promises.push({ resolve, reject });

      if (this.items.length >= this.config.maxBatchSize) {
        this.flush();
      } else if (!this.timeout) {
        this.timeout = setTimeout(() => this.flush(), this.config.maxWaitTime);
      }
    });
  }

  private async flush(): Promise<void> {
    if (this.processing || this.items.length === 0) {
      return;
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    this.processing = true;
    const itemsToProcess = this.items.splice(0, this.config.maxBatchSize);
    const promisesToResolve = this.promises.splice(0, this.config.maxBatchSize);

    try {
      const startTime = Date.now();
      const results = await this.batchOperation(itemsToProcess);

      this.monitoring.logMetric('batch_operation', {
        key: this.key,
        size: itemsToProcess.length,
        duration: Date.now() - startTime,
      });

      results.forEach((result, index) => {
        promisesToResolve[index].resolve(result);
      });
    } catch (error) {
      this.monitoring.logError('batch_operation_failed', {
        key: this.key,
        error: error instanceof Error ? error.message : 'Unknown error',
        items: itemsToProcess.length,
      });

      promisesToResolve.forEach(promise => {
        promise.reject(error);
      });
    } finally {
      this.processing = false;
      if (this.items.length > 0) {
        this.flush();
      }
    }
  }
}
