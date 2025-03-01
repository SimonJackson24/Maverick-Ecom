import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiOptimizationService } from '../services/optimization/ApiOptimizationService';
import { MonitoringService } from '../services/monitoring/MonitoringService';

interface UseOptimizedApiOptions<T> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  cache?: {
    maxAge: number;
    staleWhileRevalidate?: boolean;
  };
  dependencies?: any[];
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  debounceMs?: number;
  retryConfig?: {
    maxRetries: number;
    retryDelay: number;
  };
}

interface UseOptimizedApiResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isValidating: boolean;
  mutate: () => Promise<void>;
}

export function useOptimizedApi<T>({
  url,
  method = 'GET',
  body,
  headers,
  cache,
  dependencies = [],
  onSuccess,
  onError,
  debounceMs = 0,
  retryConfig = { maxRetries: 3, retryDelay: 1000 },
}: UseOptimizedApiOptions<T>): UseOptimizedApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const apiService = ApiOptimizationService.getInstance();
  const monitoring = MonitoringService.getInstance();
  
  const debounceTimeout = useRef<NodeJS.Timeout>();
  const retryCount = useRef(0);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiService.request<T>(url, {
        method,
        body,
        headers,
        cache,
      });

      setData(response);
      onSuccess?.(response);
      retryCount.current = 0;

      monitoring.logEvent('api_request_success', {
        url,
        method,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      
      if (retryCount.current < retryConfig.maxRetries) {
        retryCount.current++;
        setTimeout(() => {
          fetchData();
        }, retryConfig.retryDelay * retryCount.current);
        
        monitoring.logEvent('api_request_retry', {
          url,
          method,
          retryCount: retryCount.current,
          error: error.message,
        });
      } else {
        setError(error);
        onError?.(error);
        
        monitoring.logError('api_request_failed', {
          url,
          method,
          error: error.message,
          retryCount: retryCount.current,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [url, method, body, JSON.stringify(headers), JSON.stringify(cache), ...dependencies]);

  const debouncedFetchData = useCallback(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (debounceMs > 0) {
      debounceTimeout.current = setTimeout(fetchData, debounceMs);
    } else {
      fetchData();
    }
  }, [fetchData, debounceMs]);

  useEffect(() => {
    debouncedFetchData();

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [debouncedFetchData]);

  const mutate = useCallback(async () => {
    setIsValidating(true);
    try {
      // Clear cache for this URL
      apiService.removeCacheEntry(url, { method, body, headers });
      // Fetch fresh data
      await fetchData();
    } finally {
      setIsValidating(false);
    }
  }, [url, fetchData]);

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}
