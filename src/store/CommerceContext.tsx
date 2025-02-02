import React, { createContext, useContext, useState, useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_CART,
  ADD_TO_CART,
  UPDATE_CART_ITEM,
  REMOVE_FROM_CART,
} from '../services/cartQueries';
import {
  SET_SHIPPING_ADDRESS,
  SET_BILLING_ADDRESS,
  SET_SHIPPING_METHOD,
  SET_PAYMENT_METHOD,
  PLACE_ORDER,
} from '../services/checkoutQueries';
import type { Cart, CartItem, ShippingAddress, PaymentMethod } from '../types/commerce';

interface CommerceContextType {
  cart: Cart | null;
  loading: boolean;
  error: Error | null;
  addToCart: (sku: string, quantity: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  placeOrder: (input: { shippingAddress: ShippingAddress; paymentMethod: PaymentMethod }) => Promise<void>;
}

const CommerceContext = createContext<CommerceContextType | undefined>(undefined);

export const CommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);

  // Query to get cart data
  const { data, loading: cartLoading, refetch } = useQuery(GET_CART);

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

  const addToCart = useCallback(
    async (sku: string, quantity: number) => {
      try {
        await addToCartMutation({
          variables: {
            input: {
              cart_id: data?.cart?.id,
              cart_items: [
                {
                  data: {
                    quantity,
                    sku,
                  },
                },
              ],
            },
          },
        });
        await refetch();
        setError(null);
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [addToCartMutation, data?.cart?.id, refetch]
  );

  const updateCartItem = useCallback(
    async (itemId: string, quantity: number) => {
      try {
        await updateCartItemMutation({
          variables: {
            input: {
              cart_id: data?.cart?.id,
              cart_items: [
                {
                  cart_item_id: itemId,
                  quantity,
                },
              ],
            },
          },
        });
        await refetch();
        setError(null);
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [updateCartItemMutation, data?.cart?.id, refetch]
  );

  const removeFromCart = useCallback(
    async (itemId: string) => {
      try {
        await removeFromCartMutation({
          variables: {
            input: {
              cart_id: data?.cart?.id,
              cart_item_id: itemId,
            },
          },
        });
        await refetch();
        setError(null);
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [removeFromCartMutation, data?.cart?.id, refetch]
  );

  const placeOrder = useCallback(
    async ({ shippingAddress, paymentMethod }: { shippingAddress: ShippingAddress; paymentMethod: PaymentMethod }) => {
      try {
        // Set shipping address
        await setShippingAddressMutation({
          variables: {
            input: {
              cart_id: data?.cart?.id,
              shipping_addresses: [
                {
                  address: {
                    firstname: shippingAddress.firstName,
                    lastname: shippingAddress.lastName,
                    street: [shippingAddress.streetAddress1, shippingAddress.streetAddress2],
                    city: shippingAddress.city,
                    region: shippingAddress.region,
                    postcode: shippingAddress.postcode,
                    telephone: shippingAddress.telephone,
                    save_in_address_book: false,
                  },
                },
              ],
            },
          },
        });

        // Set billing address (same as shipping)
        await setBillingAddressMutation({
          variables: {
            input: {
              cart_id: data?.cart?.id,
              billing_address: {
                address: {
                  firstname: shippingAddress.firstName,
                  lastname: shippingAddress.lastName,
                  street: [shippingAddress.streetAddress1, shippingAddress.streetAddress2],
                  city: shippingAddress.city,
                  region: shippingAddress.region,
                  postcode: shippingAddress.postcode,
                  telephone: shippingAddress.telephone,
                  save_in_address_book: false,
                },
              },
            },
          },
        });

        // Set shipping method (using standard shipping)
        await setShippingMethodMutation({
          variables: {
            input: {
              cart_id: data?.cart?.id,
              shipping_methods: [
                {
                  carrier_code: 'standard',
                  method_code: 'standard',
                },
              ],
            },
          },
        });

        // Set payment method
        await setPaymentMethodMutation({
          variables: {
            input: {
              cart_id: data?.cart?.id,
              payment_method: {
                code: 'stripe',
                stripe: {
                  payment_method_id: paymentMethod.id,
                },
              },
            },
          },
        });

        // Place order
        const { data: orderData } = await placeOrderMutation({
          variables: {
            input: {
              cart_id: data?.cart?.id,
            },
          },
        });

        await refetch();
        setError(null);
        return orderData.placeOrder.order;
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [
      data?.cart?.id,
      setShippingAddressMutation,
      setBillingAddressMutation,
      setShippingMethodMutation,
      setPaymentMethodMutation,
      placeOrderMutation,
      refetch,
    ]
  );

  return (
    <CommerceContext.Provider
      value={{
        cart: data?.cart || null,
        loading: cartLoading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
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
