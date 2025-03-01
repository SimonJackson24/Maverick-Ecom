import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShippingForm } from '../components/checkout/ShippingForm';
import { PaymentForm } from '../components/checkout/PaymentForm';
import { CheckoutSummary } from '../components/checkout/CheckoutSummary';
import { useCommerce } from '../store/CommerceContext';
import type { ShippingAddress, PaymentMethod } from '../types/commerce';

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, loading, placeOrder } = useCommerce();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>();
  const [error, setError] = useState<string>();

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleShippingSubmit = async (values: ShippingAddress) => {
    try {
      setShippingAddress(values);
      setCurrentStep('payment');
      setError(undefined);
    } catch (err) {
      setError('Failed to save shipping information. Please try again.');
    }
  };

  const handlePaymentSubmit = async (values: PaymentMethod) => {
    if (!shippingAddress) {
      setError('Shipping information is missing. Please try again.');
      setCurrentStep('shipping');
      return;
    }

    try {
      await placeOrder({
        shippingAddress,
        paymentMethod: values,
      });
      setCurrentStep('confirmation');
      setError(undefined);
    } catch (err) {
      setError('Failed to process payment. Please try again.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Checkout | The Wick & Wax Co</title>
        <meta
          name="description"
          content="Secure checkout for your eco-friendly candles and bath products."
        />
      </Helmet>

      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <h1 className="sr-only">Checkout</h1>

            <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
              <div>
                {/* Progress */}
                <nav aria-label="Progress" className="mb-8">
                  <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
                    {['shipping', 'payment', 'confirmation'].map((step, index) => (
                      <li key={step} className="md:flex-1">
                        <div
                          className={`group flex flex-col border-l-4 ${
                            index < ['shipping', 'payment', 'confirmation'].indexOf(currentStep) + 1
                              ? 'border-primary-600'
                              : 'border-gray-200'
                          } py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0`}
                        >
                          <span
                            className={`text-sm font-medium ${
                              index < ['shipping', 'payment', 'confirmation'].indexOf(currentStep) + 1
                                ? 'text-primary-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {step.charAt(0).toUpperCase() + step.slice(1)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </nav>

                {error && (
                  <div className="mb-6 rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{error}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 'shipping' && (
                  <div>
                    <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">Shipping information</h2>
                        <div className="mt-6">
                          <ShippingForm
                            initialValues={shippingAddress}
                            onSubmit={handleShippingSubmit}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 'payment' && (
                  <div>
                    <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">Payment</h2>
                        <div className="mt-6">
                          <PaymentForm onSubmit={handlePaymentSubmit} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 'confirmation' && (
                  <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <h2 className="mt-4 text-lg font-medium text-gray-900">
                        Order successfully placed
                      </h2>
                      <p className="mt-2 text-sm text-gray-500">
                        Thank you for your order. You will receive a confirmation email shortly.
                      </p>
                      <div className="mt-6">
                        <button
                          type="button"
                          onClick={() => navigate('/')}
                          className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                          Continue shopping
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order summary */}
              <CheckoutSummary cart={cart} shippingAddress={shippingAddress} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
