import { useState, useCallback, useEffect } from 'react';
import { useOptimizedApi } from './useOptimizedApi';
import { MonitoringService } from '../services/monitoring/MonitoringService';
import { RetryService } from '../services/optimization/RetryService';
import { Cart, CartItem as CommerceCartItem, Product } from '../types/commerce';
import { ApiResponse } from '../types/api';

interface CartState extends Omit<Cart, 'id'> {
  loading: boolean;
  error: Error | null;
}

interface UseCartReturn {
  cart: Cart | null;
  loading: boolean;
  error: Error | null;
  addToCart: (sku: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CART_STORAGE_KEY = 'shopping_cart';
const CART_API_ENDPOINT = '/api/cart';

export const useCart = (): UseCartReturn => {
  const monitoring = MonitoringService.getInstance();
  const retryService = RetryService.getInstance();
  const [cartState, setCartState] = useState<CartState>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? {
        ...JSON.parse(savedCart),
        loading: false,
        error: null
      } : {
        items: [],
        prices: {
          subtotal_excluding_tax: { value: 0, currency: 'USD' },
          subtotal_including_tax: { value: 0, currency: 'USD' },
          total: { value: 0, currency: 'USD' }
        },
        loading: false,
        error: null
      };
    } catch (error) {
      monitoring.logError('cart_load_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        componentName: 'useCart'
      });
      return {
        items: [],
        prices: {
          subtotal_excluding_tax: { value: 0, currency: 'USD' },
          subtotal_including_tax: { value: 0, currency: 'USD' },
          total: { value: 0, currency: 'USD' }
        },
        loading: false,
        error: null
      };
    }
  });

  const api = useOptimizedApi();

  const updateLocalStorage = useCallback((cart: Omit<Cart, 'id'>) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      monitoring.logError('cart_save_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        componentName: 'useCart'
      });
    }
  }, []);

  const addToCart = useCallback(async (sku: string, quantity: number = 1) => {
    setCartState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await retryService.retry(() =>
        api.post<ApiResponse<Cart>>(`${CART_API_ENDPOINT}/add`, { sku, quantity })
      );
      const { data } = response;
      setCartState(prev => ({ ...data, loading: false, error: null }));
      updateLocalStorage(data);
      monitoring.logMetric('cart_add_success', {
        value: quantity,
        tags: { sku }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
      setCartState(prev => ({ ...prev, loading: false, error: new Error(errorMessage) }));
      monitoring.logError('cart_add_error', {
        message: errorMessage,
        componentName: 'useCart',
        additionalContext: { sku, quantity }
      });
      throw error;
    }
  }, [api, updateLocalStorage]);

  const removeFromCart = useCallback(async (itemId: string) => {
    setCartState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await retryService.retry(() =>
        api.post<ApiResponse<Cart>>(`${CART_API_ENDPOINT}/remove`, { itemId })
      );
      const { data } = response;
      setCartState(prev => ({ ...data, loading: false, error: null }));
      updateLocalStorage(data);
      monitoring.logMetric('cart_remove_success', {
        value: 1,
        tags: { itemId }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove item from cart';
      setCartState(prev => ({ ...prev, loading: false, error: new Error(errorMessage) }));
      monitoring.logError('cart_remove_error', {
        message: errorMessage,
        componentName: 'useCart',
        additionalContext: { itemId }
      });
      throw error;
    }
  }, [api, updateLocalStorage]);

  const updateCartItem = useCallback(async (itemId: string, quantity: number) => {
    setCartState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await retryService.retry(() =>
        api.post<ApiResponse<Cart>>(`${CART_API_ENDPOINT}/update`, { itemId, quantity })
      );
      const { data } = response;
      setCartState(prev => ({ ...data, loading: false, error: null }));
      updateLocalStorage(data);
      monitoring.logMetric('cart_update_success', {
        value: quantity,
        tags: { itemId }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update cart item';
      setCartState(prev => ({ ...prev, loading: false, error: new Error(errorMessage) }));
      monitoring.logError('cart_update_error', {
        message: errorMessage,
        componentName: 'useCart',
        additionalContext: { itemId, quantity }
      });
      throw error;
    }
  }, [api, updateLocalStorage]);

  const clearCart = useCallback(async () => {
    setCartState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await retryService.retry(() =>
        api.post<ApiResponse<Cart>>(`${CART_API_ENDPOINT}/clear`)
      );
      const { data } = response;
      setCartState(prev => ({ ...data, loading: false, error: null }));
      updateLocalStorage(data);
      monitoring.logMetric('cart_clear_success', { value: 1 });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear cart';
      setCartState(prev => ({ ...prev, loading: false, error: new Error(errorMessage) }));
      monitoring.logError('cart_clear_error', {
        message: errorMessage,
        componentName: 'useCart'
      });
      throw error;
    }
  }, [api, updateLocalStorage]);

  // Return cart state and methods
  return {
    cart: cartState.loading || cartState.error ? null : {
      id: 'local',
      items: cartState.items,
      prices: cartState.prices
    },
    loading: cartState.loading,
    error: cartState.error,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart
  };
};

export default useCart;
