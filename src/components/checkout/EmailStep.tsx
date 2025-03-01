import React, { useState } from 'react';
import { useGuestCheckout } from '../../store/GuestCheckoutContext';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export const EmailStep: React.FC = () => {
  const { state, setEmail } = useGuestCheckout();
  const [emailInput, setEmailInput] = useState(state.email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await setEmail(emailInput);
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="px-4 py-6 sm:px-6">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">Guest Checkout</h2>
          <p className="mt-1 text-sm text-gray-500">
            Enter your email address to continue with checkout
          </p>
        </div>

        {state.error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
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

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <a
                href="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign in
              </a>
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={state.loading}
              className="flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.loading ? 'Continuing...' : 'Continue to Shipping'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
