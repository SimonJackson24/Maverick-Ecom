import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cart } from '../../types/commerce';

interface CartSummaryProps {
  cart: Cart;
}

const CartSummary: React.FC<CartSummaryProps> = ({ cart }) => {
  const navigate = useNavigate();
  const { prices } = cart;

  const discounts = prices.discounts || [];
  const hasDiscounts = discounts.length > 0;
  const subtotal = prices.subtotal_excluding_tax.value;
  const total = prices.total.value;
  const discountAmount = hasDiscounts
    ? discounts.reduce((sum, discount) => sum + discount.amount.value, 0)
    : 0;

  return (
    <section
      aria-labelledby="summary-heading"
      className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
        Order summary
      </h2>

      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Subtotal</dt>
          <dd className="text-sm font-medium text-gray-900">
            {prices.subtotal_excluding_tax.currency} {subtotal.toFixed(2)}
          </dd>
        </div>

        {hasDiscounts && (
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <dt className="flex items-center text-sm text-gray-600">
              <span>Discounts</span>
            </dt>
            <dd className="text-sm font-medium text-green-700">
              -{discounts[0].amount.currency} {Math.abs(discountAmount).toFixed(2)}
            </dd>
          </div>
        )}

        {/* Show individual discounts if there are any */}
        {hasDiscounts && (
          <div className="space-y-1 pl-4">
            {discounts.map((discount) => (
              <div key={discount.label} className="flex items-center justify-between text-sm">
                <dt className="text-gray-500">{discount.label}</dt>
                <dd className="text-green-700">
                  -{discount.amount.currency} {Math.abs(discount.amount.value).toFixed(2)}
                </dd>
              </div>
            ))}
          </div>
        )}

        {/* Shipping estimate if available */}
        {prices.shipping_estimate && (
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <dt className="text-sm text-gray-600">Shipping estimate</dt>
            <dd className="text-sm font-medium text-gray-900">
              {prices.shipping_estimate.currency} {prices.shipping_estimate.value.toFixed(2)}
            </dd>
          </div>
        )}

        {/* Tax estimate if available */}
        {prices.tax_estimate && (
          <div className="flex items-center justify-between pt-2">
            <dt className="text-sm text-gray-600">Tax estimate</dt>
            <dd className="text-sm font-medium text-gray-900">
              {prices.tax_estimate.currency} {prices.tax_estimate.value.toFixed(2)}
            </dd>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="text-base font-medium text-gray-900">Order total</dt>
          <dd className="text-base font-medium text-gray-900">
            {prices.total.currency} {total.toFixed(2)}
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => navigate('/checkout')}
          className="w-full rounded-md border border-transparent bg-primary-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50"
        >
          Proceed to Checkout
        </button>
      </div>

      <div className="mt-6 text-center text-sm">
        <p>
          <span className="inline-flex items-center space-x-2">
            <svg
              className="h-5 w-5 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-500">Carbon neutral shipping</span>
          </span>
        </p>
      </div>
    </section>
  );
};

export default CartSummary;
