import React from 'react';
import { Cart, ShippingAddress } from '../../types/commerce';

interface CheckoutSummaryProps {
  cart: Cart;
  shippingAddress?: ShippingAddress;
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ cart, shippingAddress }) => {
  const { prices, items } = cart;
  const hasDiscounts = prices.discounts && prices.discounts.length > 0;
  const subtotal = prices.subtotal_excluding_tax.value;
  const total = prices.subtotal_including_tax.value;
  const discountAmount = hasDiscounts
    ? prices.discounts.reduce((sum, discount) => sum + discount.amount.value, 0)
    : 0;

  return (
    <div className="mt-10 lg:mt-0">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
        <h3 className="sr-only">Items in your cart</h3>
        <ul role="list" className="divide-y divide-gray-200">
          {items.map((item) => (
            <li key={item.id} className="flex px-4 py-6 sm:px-6">
              <div className="flex-shrink-0">
                <img
                  src={item.product.image.url}
                  alt={item.product.image.label}
                  className="w-20 rounded-md"
                />
              </div>

              <div className="ml-6 flex flex-1 flex-col">
                <div className="flex">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm">
                      <a href={`/product/${item.product.url_key}`} className="font-medium text-gray-700 hover:text-gray-800">
                        {item.product.name}
                      </a>
                    </h4>
                    {item.product.eco_friendly_features && item.product.eco_friendly_features.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.product.eco_friendly_features.map((feature) => (
                          <span
                            key={feature}
                            className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flow-root flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900">
                      {item.product.price.regularPrice.amount.currency}{' '}
                      {(item.product.price.regularPrice.amount.value * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>
              </div>
            </li>
          ))}
        </ul>

        <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <dt className="text-sm">Subtotal</dt>
            <dd className="text-sm font-medium text-gray-900">
              {prices.subtotal_excluding_tax.currency} {subtotal.toFixed(2)}
            </dd>
          </div>

          {hasDiscounts && (
            <>
              <div className="flex items-center justify-between">
                <dt className="text-sm">Discounts</dt>
                <dd className="text-sm font-medium text-green-700">
                  -{prices.discounts[0].amount.currency} {Math.abs(discountAmount).toFixed(2)}
                </dd>
              </div>
              {prices.discounts.map((discount) => (
                <div key={discount.label} className="flex items-center justify-between text-sm">
                  <dt className="text-gray-500">{discount.label}</dt>
                  <dd className="text-gray-500">
                    -{discount.amount.currency} {Math.abs(discount.amount.value).toFixed(2)}
                  </dd>
                </div>
              ))}
            </>
          )}

          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <dt className="text-base font-medium">Total</dt>
            <dd className="text-base font-medium text-gray-900">
              {prices.subtotal_including_tax.currency} {total.toFixed(2)}
            </dd>
          </div>
        </dl>

        {shippingAddress && (
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <h3 className="text-base font-medium text-gray-900">Shipping Address</h3>
            <div className="mt-4 text-sm text-gray-500">
              <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
              <p>{shippingAddress.streetAddress1}</p>
              {shippingAddress.streetAddress2 && <p>{shippingAddress.streetAddress2}</p>}
              <p>
                {shippingAddress.city}, {shippingAddress.region} {shippingAddress.postcode}
              </p>
              <p>{shippingAddress.telephone}</p>
              <p>{shippingAddress.email}</p>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
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
              <span className="ml-2 text-sm text-gray-500">Carbon neutral shipping</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
