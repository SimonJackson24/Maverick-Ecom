import React, { createContext, useContext, useState, useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_CART,
  ADD_TO_CART,
  UPDATE_CART_ITEM,
  REMOVE_FROM_CART,
  SET_SHIPPING_ADDRESS,
  SET_BILLING_ADDRESS,
  SET_SHIPPING_METHOD,
  SET_PAYMENT_METHOD,
  PLACE_ORDER,
} from '../graphql/commerce';

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: Array<{
      url: string;
      alt: string;
    }>;
  };
  quantity: number;
  total: number;
}

interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
}

interface CommerceContextType {
  cart: Cart | null;
  loading: boolean;
  error: Error | null;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  setShippingAddress: (address: Address) => Promise<void>;
  setBillingAddress: (address: Address) => Promise<void>;
  setShippingMethod: (methodId: string) => Promise<void>;
  setPaymentMethod: (methodId: string) => Promise<void>;
  placeOrder: () => Promise<{ id: string; orderNumber: string }>;
}

const CommerceContext = createContext<CommerceContextType | undefined>(undefined);

export const CommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);

  // Query to get cart data
  const { data, loading: cartLoading, refetch: refetchCart } = useQuery(GET_CART);

  // Cart mutations
  const [addToCartMutation] = useMutation(ADD_TO_CART);
  const [updateCartItemMutation] = useMutation(UPDATE_CART_ITEM);
  const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART);

  // Checkout mutations
  const [setShippingAddressMutation] = useMutation(SET_SHIPPING_ADDRESS);
  const [setBillingAddressMutation] = useMutation(SET_BILLING_ADDRESS);
  const [setShippingMethodMutation] = useMutation(SET_SHIPPING_METHOD);
  const [setPaymentMethodMutation] = useMutation(SET_PAYMENT_METHOD);
  const [placeOrderMutation] = useMutation(PLACE_ORDER);

  const addToCart = useCallback(async (productId: string, quantity: number) => {
    try {
      await addToCartMutation({
        variables: { productId, quantity },
      });
      await refetchCart();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add to cart'));
      throw err;
    }
  }, [addToCartMutation, refetchCart]);

  const updateCartItem = useCallback(async (itemId: string, quantity: number) => {
    try {
      await updateCartItemMutation({
        variables: { itemId, quantity },
      });
      await refetchCart();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update cart item'));
      throw err;
    }
  }, [updateCartItemMutation, refetchCart]);

  const removeFromCart = useCallback(async (itemId: string) => {
    try {
      await removeFromCartMutation({
        variables: { itemId },
      });
      await refetchCart();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove from cart'));
      throw err;
    }
  }, [removeFromCartMutation, refetchCart]);

  const setShippingAddress = useCallback(async (address: Address) => {
    try {
      await setShippingAddressMutation({
        variables: { input: address },
      });
      await refetchCart();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to set shipping address'));
      throw err;
    }
  }, [setShippingAddressMutation, refetchCart]);

  const setBillingAddress = useCallback(async (address: Address) => {
    try {
      await setBillingAddressMutation({
        variables: { input: address },
      });
      await refetchCart();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to set billing address'));
      throw err;
    }
  }, [setBillingAddressMutation, refetchCart]);

  const setShippingMethod = useCallback(async (methodId: string) => {
    try {
      await setShippingMethodMutation({
        variables: { methodId },
      });
      await refetchCart();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to set shipping method'));
      throw err;
    }
  }, [setShippingMethodMutation, refetchCart]);

  const setPaymentMethod = useCallback(async (methodId: string) => {
    try {
      await setPaymentMethodMutation({
        variables: { methodId },
      });
      await refetchCart();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to set payment method'));
      throw err;
    }
  }, [setPaymentMethodMutation, refetchCart]);

  const placeOrder = useCallback(async () => {
    try {
      const { data } = await placeOrderMutation();
      await refetchCart();
      setError(null);
      return {
        id: data.placeOrder.id,
        orderNumber: data.placeOrder.orderNumber,
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to place order'));
      throw err;
    }
  }, [placeOrderMutation, refetchCart]);

  return (
    <CommerceContext.Provider
      value={{
        cart: data?.cart || null,
        loading: cartLoading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        setShippingAddress,
        setBillingAddress,
        setShippingMethod,
        setPaymentMethod,
        placeOrder,
      }}
    >
      {children}
    </CommerceContext.Provider>
  );
};

export const useCommerce = () => {
  const context = useContext(CommerceContext);
  if (context === undefined) {
    throw new Error('useCommerce must be used within a CommerceProvider');
  }
  return context;
};

export default CommerceContext;
