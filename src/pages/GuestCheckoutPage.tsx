import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Navigate, useParams } from 'react-router-dom';
import { EmailStep } from '../components/checkout/EmailStep';
import { ShippingStep } from '../components/checkout/ShippingStep';
import { PaymentStep } from '../components/checkout/PaymentStep';
import { CartSummarySidebar } from '../components/checkout/CartSummarySidebar';
import { useGuestCheckout } from '../store/GuestCheckoutContext';
import { GET_AVAILABLE_PAYMENT_METHODS, GET_CART_TOTALS } from '../graphql/checkout';
import { CheckCircleIcon, TruckIcon, CreditCardIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { checkoutAnalytics } from '../services/analytics/checkoutAnalytics';
import { handleCheckoutError } from '../utils/checkoutErrorHandler';

const steps = [
  { id: 'email', name: 'Email', icon: EnvelopeIcon },
  { id: 'shipping', name: 'Shipping', icon: TruckIcon },
  { id: 'payment', name: 'Payment', icon: CreditCardIcon },
  { id: 'review', name: 'Review', icon: CheckCircleIcon },
];

export const GuestCheckoutPage: React.FC = () => {
  const { cartId } = useParams<{ cartId: string }>();
  const { state } = useGuestCheckout();

  const { data: paymentMethodsData } = useQuery(GET_AVAILABLE_PAYMENT_METHODS, {
    variables: { cartId },
    skip: !cartId || state.step !== 'payment',
  });

  const { data: cartTotalsData } = useQuery(GET_CART_TOTALS, {
    variables: { cartId },
    skip: !cartId || state.step !== 'payment',
  });

  useEffect(() => {
    // Track step view
    checkoutAnalytics.stepView({
      cartId,
      step: state.step,
      value: cartTotalsData?.cart?.prices?.grand_total?.value,
      currency: cartTotalsData?.cart?.prices?.grand_total?.currency,
    });
  }, [state.step, cartId, cartTotalsData]);

  if (!cartId) {
    return <Navigate to="/cart" replace />;
  }

  const handleError = (error: any) => {
    const errorMapping = handleCheckoutError({
      cartId,
      step: state.step,
      error,
      value: cartTotalsData?.cart?.prices?.grand_total?.value,
      currency: cartTotalsData?.cart?.prices?.grand_total?.currency,
    });

    if (errorMapping.action === 'redirect_to_cart') {
      return <Navigate to="/cart" replace />;
    }

    if (errorMapping.action === 'refresh') {
      window.location.reload();
    }

    return errorMapping.message;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
            {/* Main content */}
            <div className="lg:col-span-7">
              {/* Progress Steps */}
              <nav aria-label="Progress" className="mb-12">
                <ol
                  role="list"
                  className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0"
                >
                  {steps.map((step, stepIdx) => {
                    const isCurrentStep = state.step === step.id;
                    const isCompleted = steps.findIndex(s => s.id === state.step) > stepIdx;
                    
                    return (
                      <li key={step.name} className="relative md:flex md:flex-1">
                        {isCompleted ? (
                          <div className="group flex w-full items-center">
                            <span className="flex items-center px-6 py-4 text-sm font-medium">
                              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600">
                                <CheckCircleIcon
                                  className="h-6 w-6 text-white"
                                  aria-hidden="true"
                                />
                              </span>
                              <span className="ml-4 text-sm font-medium text-gray-900">
                                {step.name}
                              </span>
                            </span>
                          </div>
                        ) : isCurrentStep ? (
                          <div
                            className="flex items-center px-6 py-4 text-sm font-medium"
                            aria-current="step"
                          >
                            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary-600">
                              <step.icon
                                className="h-6 w-6 text-primary-600"
                                aria-hidden="true"
                              />
                            </span>
                            <span className="ml-4 text-sm font-medium text-primary-600">
                              {step.name}
                            </span>
                          </div>
                        ) : (
                          <div className="group flex items-center">
                            <span className="flex items-center px-6 py-4 text-sm font-medium">
                              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300">
                                <step.icon
                                  className="h-6 w-6 text-gray-400"
                                  aria-hidden="true"
                                />
                              </span>
                              <span className="ml-4 text-sm font-medium text-gray-500">
                                {step.name}
                              </span>
                            </span>
                          </div>
                        )}

                        {stepIdx !== steps.length - 1 ? (
                          <>
                            <div
                              className="absolute right-0 top-0 hidden h-full w-5 md:block"
                              aria-hidden="true"
                            >
                              <svg
                                className="h-full w-full text-gray-300"
                                viewBox="0 0 22 80"
                                fill="none"
                                preserveAspectRatio="none"
                              >
                                <path
                                  d="M0 -2L20 40L0 82"
                                  vectorEffect="non-scaling-stroke"
                                  stroke="currentcolor"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </>
                        ) : null}
                      </li>
                    );
                  })}
                </ol>
              </nav>

              {/* Step Content */}
              <div className="mt-10">
                {state.step === 'email' && (
                  <EmailStep onError={handleError} />
                )}
                {state.step === 'shipping' && (
                  <ShippingStep
                    availableShippingMethods={
                      cartTotalsData?.cart?.shipping_addresses[0]?.available_shipping_methods || []
                    }
                    onError={handleError}
                  />
                )}
                {state.step === 'payment' && (
                  <PaymentStep
                    availablePaymentMethods={
                      paymentMethodsData?.cart?.available_payment_methods || []
                    }
                    cartTotals={{
                      subtotal: cartTotalsData?.cart?.prices?.subtotal_excluding_tax || { value: 0, currency: 'USD' },
                      shipping: cartTotalsData?.cart?.shipping_addresses[0]?.selected_shipping_method?.amount || { value: 0, currency: 'USD' },
                      tax: cartTotalsData?.cart?.prices?.applied_taxes?.[0]?.amount || { value: 0, currency: 'USD' },
                      grand_total: cartTotalsData?.cart?.prices?.grand_total || { value: 0, currency: 'USD' },
                    }}
                    onError={handleError}
                  />
                )}
                {state.step === 'review' && (
                  <div className="text-center">
                    <h2 className="text-lg font-medium text-gray-900">Review Your Order</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Please review your order details before placing the order.
                    </p>
                    <button
                      onClick={async () => {
                        try {
                          await placeOrder();
                          checkoutAnalytics.orderPlaced({
                            cartId,
                            step: 'review',
                            orderId: state.orderNumber!,
                            items: cartTotalsData?.cart?.items || [],
                            value: cartTotalsData?.cart?.prices?.grand_total?.value,
                            currency: cartTotalsData?.cart?.prices?.grand_total?.currency,
                          });
                        } catch (error) {
                          handleError(error);
                        }
                      }}
                      className="mt-6 inline-flex items-center rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                      Place Order
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Cart Summary Sidebar */}
            <div className="mt-10 lg:mt-0 lg:col-span-5">
              <CartSummarySidebar cartId={cartId} className="sticky top-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
