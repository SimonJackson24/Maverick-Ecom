import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import {
  SET_GUEST_EMAIL,
  SET_SHIPPING_ADDRESS,
  SET_SHIPPING_METHOD,
  SET_PAYMENT_METHOD,
  PLACE_ORDER,
} from '../graphql/checkout';

interface Address {
  firstname: string;
  lastname: string;
  street: string[];
  city: string;
  region: string;
  postcode: string;
  countryCode: string;
  telephone: string;
}

interface CheckoutState {
  step: 'email' | 'shipping' | 'payment' | 'review';
  email: string;
  shippingAddress: Address | null;
  shippingMethod: {
    carrierCode: string;
    methodCode: string;
  } | null;
  paymentMethod: string | null;
  orderNumber: string | null;
  loading: boolean;
  error: string | null;
}

type CheckoutAction =
  | { type: 'SET_STEP'; payload: CheckoutState['step'] }
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_SHIPPING_ADDRESS'; payload: Address }
  | { type: 'SET_SHIPPING_METHOD'; payload: CheckoutState['shippingMethod'] }
  | { type: 'SET_PAYMENT_METHOD'; payload: string }
  | { type: 'SET_ORDER_NUMBER'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

const initialState: CheckoutState = {
  step: 'email',
  email: '',
  shippingAddress: null,
  shippingMethod: null,
  paymentMethod: null,
  orderNumber: null,
  loading: false,
  error: null,
};

const GuestCheckoutContext = createContext<{
  state: CheckoutState;
  setEmail: (email: string) => Promise<void>;
  setShippingAddress: (address: Address) => Promise<void>;
  setShippingMethod: (carrierCode: string, methodCode: string) => Promise<void>;
  setPaymentMethod: (method: string) => Promise<void>;
  placeOrder: () => Promise<void>;
  goToStep: (step: CheckoutState['step']) => void;
  reset: () => void;
} | null>(null);

const checkoutReducer = (state: CheckoutState, action: CheckoutAction): CheckoutState => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_SHIPPING_ADDRESS':
      return { ...state, shippingAddress: action.payload };
    case 'SET_SHIPPING_METHOD':
      return { ...state, shippingMethod: action.payload };
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload };
    case 'SET_ORDER_NUMBER':
      return { ...state, orderNumber: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export const GuestCheckoutProvider: React.FC<{ cartId: string; children: React.ReactNode }> = ({
  cartId,
  children,
}) => {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);

  const [setGuestEmail] = useMutation(SET_GUEST_EMAIL);
  const [setShippingAddressMutation] = useMutation(SET_SHIPPING_ADDRESS);
  const [setShippingMethodMutation] = useMutation(SET_SHIPPING_METHOD);
  const [setPaymentMethodMutation] = useMutation(SET_PAYMENT_METHOD);
  const [placeOrderMutation] = useMutation(PLACE_ORDER);

  const handleError = useCallback((error: any) => {
    console.error('Checkout error:', error);
    dispatch({ type: 'SET_ERROR', payload: error.message });
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const setEmail = useCallback(
    async (email: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        await setGuestEmail({
          variables: {
            cartId,
            email,
          },
        });
        dispatch({ type: 'SET_EMAIL', payload: email });
        dispatch({ type: 'SET_STEP', payload: 'shipping' });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (error) {
        handleError(error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [cartId, setGuestEmail, handleError]
  );

  const setShippingAddress = useCallback(
    async (address: Address) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        await setShippingAddressMutation({
          variables: {
            cartId,
            ...address,
          },
        });
        dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: address });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (error) {
        handleError(error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [cartId, setShippingAddressMutation, handleError]
  );

  const setShippingMethod = useCallback(
    async (carrierCode: string, methodCode: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        await setShippingMethodMutation({
          variables: {
            cartId,
            carrierCode,
            methodCode,
          },
        });
        dispatch({
          type: 'SET_SHIPPING_METHOD',
          payload: { carrierCode, methodCode },
        });
        dispatch({ type: 'SET_STEP', payload: 'payment' });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (error) {
        handleError(error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [cartId, setShippingMethodMutation, handleError]
  );

  const setPaymentMethod = useCallback(
    async (method: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        await setPaymentMethodMutation({
          variables: {
            cartId,
            code: method,
          },
        });
        dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
        dispatch({ type: 'SET_STEP', payload: 'review' });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (error) {
        handleError(error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [cartId, setPaymentMethodMutation, handleError]
  );

  const placeOrder = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data } = await placeOrderMutation({
        variables: {
          cartId,
        },
      });
      dispatch({
        type: 'SET_ORDER_NUMBER',
        payload: data.placeOrder.order.order_number,
      });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      handleError(error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [cartId, placeOrderMutation, handleError]);

  const goToStep = useCallback((step: CheckoutState['step']) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <GuestCheckoutContext.Provider
      value={{
        state,
        setEmail,
        setShippingAddress,
        setShippingMethod,
        setPaymentMethod,
        placeOrder,
        goToStep,
        reset,
      }}
    >
      {children}
    </GuestCheckoutContext.Provider>
  );
};

export const useGuestCheckout = () => {
  const context = useContext(GuestCheckoutContext);
  if (!context) {
    throw new Error('useGuestCheckout must be used within a GuestCheckoutProvider');
  }
  return context;
};
