import React, { useState } from 'react';
import { useGuestCheckout } from '../../store/GuestCheckoutContext';
import { ExclamationTriangleIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import RevolutPayment from './RevolutPayment';
import { useSnackbar } from 'notistack';

interface PaymentMethod {
  code: string;
  title: string;
}

interface CartTotals {
  subtotal: {
    value: number;
    currency: string;
  };
  shipping: {
    value: number;
    currency: string;
  };
  tax: {
    value: number;
    currency: string;
  };
  grand_total: {
    value: number;
    currency: string;
  };
}

export const PaymentStep: React.FC<{
  availablePaymentMethods: PaymentMethod[];
  cartTotals: CartTotals;
}> = ({ availablePaymentMethods, cartTotals }) => {
  const { state, setPaymentMethod, setPaymentDetails } = useGuestCheckout();
  const [selectedMethod, setSelectedMethod] = useState(state.paymentMethod || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMethod) {
      await setPaymentMethod(selectedMethod);
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      await setPaymentMethod('revolut');
      await setPaymentDetails({
        paymentId,
        method: 'revolut',
        status: 'completed'
      });
      enqueueSnackbar('Payment completed successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to process payment', { variant: 'error' });
    }
  };

  const handlePaymentError = (error: string) => {
    enqueueSnackbar(`Payment failed: ${error}`, { variant: 'error' });
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:max-w-7xl">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Payment Method</h2>
          <p className="mt-1 text-sm text-gray-500">
            Please select your preferred payment method and enter your payment details.
          </p>
        </div>

        {state.error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon
                  className="h-5 w-5 text-red-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{state.error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {availablePaymentMethods.map((method) => (
            <div key={method.code} className="relative flex items-start">
              <div className="flex h-6 items-center">
                <input
                  id={method.code}
                  type="radio"
                  name="payment-method"
                  value={method.code}
                  checked={selectedMethod === method.code}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
              </div>
              <div className="ml-3">
                <label htmlFor={method.code} className="text-sm font-medium text-gray-900">
                  {method.title}
                </label>
              </div>
            </div>
          ))}

          {/* Revolut Payment Option */}
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="revolut"
                type="radio"
                name="payment-method"
                value="revolut"
                checked={selectedMethod === 'revolut'}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="revolut" className="text-sm font-medium text-gray-900">
                Pay with Revolut
              </label>
              <p className="text-sm text-gray-500">
                Fast and secure payment with Revolut
              </p>
            </div>
          </div>
        </div>

        {selectedMethod === 'cc' && (
          <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="cardName"
                className="block text-sm font-medium text-gray-700"
              >
                Name on card
              </label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                required
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="cardNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Card number
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  required
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  className="block w-full rounded-md border-gray-300 pr-10 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="expiryDate"
                className="block text-sm font-medium text-gray-700"
              >
                Expiry date
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                required
                placeholder="MM/YY"
                maxLength={5}
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="cvv"
                className="block text-sm font-medium text-gray-700"
              >
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                required
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>
        )}

        {selectedMethod === 'revolut' && (
          <div className="mt-6">
            <RevolutPayment
              amount={cartTotals.grand_total.value}
              currency={cartTotals.grand_total.currency}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        )}

        <div className="rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:p-8">
          <h3 className="text-base font-medium text-gray-900">Order Summary</h3>
          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Subtotal</dt>
              <dd className="text-sm font-medium text-gray-900">
                {cartTotals.subtotal.currency} {cartTotals.subtotal.value.toFixed(2)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Shipping</dt>
              <dd className="text-sm font-medium text-gray-900">
                {cartTotals.shipping.currency} {cartTotals.shipping.value.toFixed(2)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Tax</dt>
              <dd className="text-sm font-medium text-gray-900">
                {cartTotals.tax.currency} {cartTotals.tax.value.toFixed(2)}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="text-base font-medium text-gray-900">Order total</dt>
              <dd className="text-base font-medium text-gray-900">
                {cartTotals.grand_total.currency} {cartTotals.grand_total.value.toFixed(2)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Back to Shipping
          </button>
          <button
            type="submit"
            disabled={state.loading}
            className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.loading ? 'Processing...' : 'Review Order'}
          </button>
        </div>
      </div>
    </div>
  );
};
