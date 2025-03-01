import { useState, useCallback, useEffect } from 'react';
import { useOptimizedApi } from './useOptimizedApi';
import { Product } from '../types/product';
import { MonitoringService } from '../services/monitoring/MonitoringService';
import { RetryService } from '../services/optimization/RetryService';
import { useAuth } from './useAuth';

interface WishlistItem extends Product {
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  itemCount: number;
}

interface UseWishlistReturn {
  wishlist: WishlistState;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const WISHLIST_STORAGE_KEY = 'user_wishlist';
const WISHLIST_API_ENDPOINT = '/api/wishlist';

export const useWishlist = (): UseWishlistReturn => {
  const monitoring = MonitoringService.getInstance();
  const retryService = RetryService.getInstance();
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [wishlist, setWishlist] = useState<WishlistState>(() => {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return savedWishlist ? JSON.parse(savedWishlist) : { items: [], itemCount: 0 };
    } catch (error) {
      monitoring.logError('wishlist_load_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        componentName: 'useWishlist'
      });
      return { items: [], itemCount: 0 };
    }
  });

  const { data: serverWishlist, mutate } = useOptimizedApi<WishlistState>({
    url: WISHLIST_API_ENDPOINT,
    cache: {
      maxAge: 5 * 60 * 1000, // 5 minutes
      staleWhileRevalidate: true,
    },
  });

  // Sync with server wishlist when authenticated
  useEffect(() => {
    if (isAuthenticated && serverWishlist) {
      setWishlist(serverWishlist);
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(serverWishlist));
      } catch (error) {
        monitoring.logError('wishlist_save_error', {
          message: error instanceof Error ? error.message : 'Unknown error',
          componentName: 'useWishlist'
        });
      }
    }
  }, [isAuthenticated, serverWishlist]);

  // Merge local and server wishlists when user logs in
  useEffect(() => {
    if (isAuthenticated && user && wishlist.items.length > 0) {
      const mergeWishlists = async () => {
        try {
          const mergedItems = [...wishlist.items];
          for (const item of mergedItems) {
            await addToWishlist(item);
          }
          localStorage.removeItem(WISHLIST_STORAGE_KEY);
        } catch (error) {
          monitoring.logError('wishlist_merge_error', {
            message: error instanceof Error ? error.message : 'Unknown error',
            componentName: 'useWishlist'
          });
        }
      };
      mergeWishlists();
    }
  }, [isAuthenticated, user]);

  // API calls with retry logic
  const updateServerWishlist = useCallback(async (newWishlist: WishlistState) => {
    if (!isAuthenticated) {
      return newWishlist;
    }

    return retryService.executeWithRetry(
      async () => {
        const response = await fetch(WISHLIST_API_ENDPOINT, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newWishlist),
        });

        if (!response.ok) {
          throw new Error('Failed to update wishlist on server');
        }

        return response.json();
      },
      {
        maxRetries: 3,
        initialDelay: 1000,
        maxDelay: 5000,
      }
    );
  }, [isAuthenticated]);

  // Add to wishlist
  const addToWishlist = useCallback(async (product: Product) => {
    setIsLoading(true);
    setError(null);

    try {
      const startTime = performance.now();
      
      if (wishlist.items.some(item => item.id === product.id)) {
        return; // Item already in wishlist
      }

      const newItem: WishlistItem = {
        ...product,
        addedAt: new Date().toISOString(),
      };

      const newWishlist = {
        items: [...wishlist.items, newItem],
        itemCount: wishlist.items.length + 1,
      };

      await updateServerWishlist(newWishlist);
      await mutate(newWishlist);

      if (!isAuthenticated) {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newWishlist));
      }

      monitoring.logMetric('wishlist_add_duration', {
        value: performance.now() - startTime,
        tags: { productId: product.id }
      });
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to add to wishlist'));
      monitoring.logError('wishlist_add_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        componentName: 'useWishlist',
        additionalContext: { productId: product.id }
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [wishlist, isAuthenticated, updateServerWishlist, mutate]);

  // Remove from wishlist
  const removeFromWishlist = useCallback(async (productId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const startTime = performance.now();
      const newWishlist = {
        items: wishlist.items.filter(item => item.id !== productId),
        itemCount: wishlist.items.length - 1,
      };

      await updateServerWishlist(newWishlist);
      await mutate(newWishlist);

      if (!isAuthenticated) {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newWishlist));
      }

      monitoring.logMetric('wishlist_remove_duration', {
        value: performance.now() - startTime,
        tags: { productId }
      });
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to remove from wishlist'));
      monitoring.logError('wishlist_remove_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        componentName: 'useWishlist',
        additionalContext: { productId }
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [wishlist, isAuthenticated, updateServerWishlist, mutate]);

  // Check if item is in wishlist
  const isInWishlist = useCallback((productId: string): boolean => {
    return wishlist.items.some(item => item.id === productId);
  }, [wishlist]);

  // Clear wishlist
  const clearWishlist = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const startTime = performance.now();
      const emptyWishlist = { items: [], itemCount: 0 };
      
      await updateServerWishlist(emptyWishlist);
      await mutate(emptyWishlist);

      if (!isAuthenticated) {
        localStorage.removeItem(WISHLIST_STORAGE_KEY);
      }

      monitoring.logMetric('wishlist_clear_duration', {
        value: performance.now() - startTime
      });
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to clear wishlist'));
      monitoring.logError('wishlist_clear_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        componentName: 'useWishlist'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, updateServerWishlist, mutate]);

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    isLoading,
    error,
  };
};
