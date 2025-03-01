import { ApolloError } from '@apollo/client';
import { checkoutAnalytics } from '../services/analytics/checkoutAnalytics';
import type { CheckoutStep } from '../services/analytics/checkoutAnalytics';

interface ErrorMapping {
  code: string;
  message: string;
  action?: string;
}

const ERROR_MAPPINGS: Record<string, ErrorMapping> = {
  // Cart Errors
  CART_NOT_FOUND: {
    code: 'CART_NOT_FOUND',
    message: 'Your shopping cart could not be found. Please try refreshing the page.',
    action: 'refresh',
  },
  CART_EXPIRED: {
    code: 'CART_EXPIRED',
    message: 'Your shopping cart has expired. Please add your items again.',
    action: 'redirect_to_cart',
  },

  // Payment Errors
  PAYMENT_VALIDATION_ERROR: {
    code: 'PAYMENT_VALIDATION_ERROR',
    message: 'There was a problem with your payment information. Please check your details and try again.',
  },
  INSUFFICIENT_STOCK: {
    code: 'INSUFFICIENT_STOCK',
    message: 'Some items in your cart are no longer available in the requested quantity.',
    action: 'redirect_to_cart',
  },
  PAYMENT_PROCESSING_ERROR: {
    code: 'PAYMENT_PROCESSING_ERROR',
    message: 'There was a problem processing your payment. Please try again or use a different payment method.',
  },

  // Shipping Errors
  SHIPPING_METHOD_UNAVAILABLE: {
    code: 'SHIPPING_METHOD_UNAVAILABLE',
    message: 'The selected shipping method is no longer available. Please choose another shipping method.',
  },
  INVALID_SHIPPING_ADDRESS: {
    code: 'INVALID_SHIPPING_ADDRESS',
    message: 'The shipping address appears to be invalid. Please check your address and try again.',
  },

  // Promo Code Errors
  PROMO_CODE_EXPIRED: {
    code: 'PROMO_CODE_EXPIRED',
    message: 'The promotion code you entered has expired.',
  },
  PROMO_CODE_INVALID: {
    code: 'PROMO_CODE_INVALID',
    message: 'The promotion code you entered is invalid.',
  },
  PROMO_CODE_USAGE_LIMIT: {
    code: 'PROMO_CODE_USAGE_LIMIT',
    message: 'This promotion code has reached its usage limit.',
  },

  // Network Errors
  NETWORK_ERROR: {
    code: 'NETWORK_ERROR',
    message: 'There seems to be a problem with your internet connection. Please check your connection and try again.',
  },
};

export interface HandleErrorOptions {
  cartId: string;
  step: CheckoutStep;
  error: ApolloError | Error;
  value?: number;
  currency?: string;
}

export const handleCheckoutError = ({
  cartId,
  step,
  error,
  value,
  currency,
}: HandleErrorOptions): ErrorMapping => {
  // Extract error code from Apollo error if available
  let errorCode = 'UNKNOWN_ERROR';
  if (error instanceof ApolloError) {
    errorCode = error.graphQLErrors[0]?.extensions?.code || 
                error.networkError ? 'NETWORK_ERROR' : 'UNKNOWN_ERROR';
  }

  // Get error mapping or use default
  const errorMapping = ERROR_MAPPINGS[errorCode] || {
    code: errorCode,
    message: 'An unexpected error occurred. Please try again.',
  };

  // Track error in analytics
  checkoutAnalytics.stepError({
    cartId,
    step,
    error: errorMapping.code,
    value,
    currency,
  });

  // Log error for debugging
  console.error('Checkout Error:', {
    code: errorMapping.code,
    message: errorMapping.message,
    originalError: error,
    step,
    cartId,
  });

  return errorMapping;
};

export const isPaymentError = (error: ApolloError | Error): boolean => {
  if (error instanceof ApolloError) {
    const code = error.graphQLErrors[0]?.extensions?.code;
    return code?.includes('PAYMENT_') || false;
  }
  return false;
};

export const isShippingError = (error: ApolloError | Error): boolean => {
  if (error instanceof ApolloError) {
    const code = error.graphQLErrors[0]?.extensions?.code;
    return code?.includes('SHIPPING_') || false;
  }
  return false;
};

export const isPromoCodeError = (error: ApolloError | Error): boolean => {
  if (error instanceof ApolloError) {
    const code = error.graphQLErrors[0]?.extensions?.code;
    return code?.includes('PROMO_CODE_') || false;
  }
  return false;
};

export const getErrorAction = (error: ApolloError | Error): string | undefined => {
  if (error instanceof ApolloError) {
    const code = error.graphQLErrors[0]?.extensions?.code;
    return ERROR_MAPPINGS[code]?.action;
  }
  return undefined;
};
