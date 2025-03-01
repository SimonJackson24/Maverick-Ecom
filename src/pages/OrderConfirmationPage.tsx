import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useGuestCheckout } from '../store/GuestCheckoutContext';

export const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, reset } = useGuestCheckout();

  React.useEffect(() => {
    if (!state.orderNumber) {
      navigate('/cart');
    }
  }, [state.orderNumber, navigate]);

  const handleContinueShopping = () => {
    reset();
    navigate('/');
  };

  if (!state.orderNumber) {
    return null;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <div className="flex items-center space-x-4">
            <CheckCircleIcon
              className="h-12 w-12 text-green-500"
              aria-hidden="true"
            />
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Thank you for your order!
            </h1>
          </div>
          <p className="mt-2 text-base text-gray-500">
            Your order #{state.orderNumber} has been placed and will be processed soon.
          </p>
          <p className="mt-2 text-base text-gray-500">
            We've sent a confirmation email to {state.email} with your order details.
          </p>
        </div>

        <div className="mt-10 border-t border-gray-200">
          <div className="mt-10">
            <h2 className="text-lg font-medium text-gray-900">Order details</h2>

            <dl className="mt-4 text-sm font-medium">
              <div className="flex justify-between py-3 text-gray-900">
                <dt>Shipping Address</dt>
                <dd className="text-right">
                  <address className="not-italic">
                    {state.shippingAddress?.firstname} {state.shippingAddress?.lastname}
                    <br />
                    {state.shippingAddress?.street.join(', ')}
                    <br />
                    {state.shippingAddress?.city}, {state.shippingAddress?.region}{' '}
                    {state.shippingAddress?.postcode}
                    <br />
                    {state.shippingAddress?.telephone}
                  </address>
                </dd>
              </div>

              <div className="flex justify-between py-3 text-gray-900 border-t border-gray-200">
                <dt>Payment Method</dt>
                <dd className="text-right">
                  {state.paymentMethod === 'cc' ? 'Credit Card' : state.paymentMethod}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleContinueShopping}
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Continue Shopping
            </button>
            <a
              href={`/order-tracking/${state.orderNumber}`}
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Track Order
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
