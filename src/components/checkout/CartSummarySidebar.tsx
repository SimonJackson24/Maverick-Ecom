import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CART_TOTALS } from '../../graphql/checkout';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { checkoutAnalytics } from '../../services/analytics/checkoutAnalytics';
import { abandonedCartService } from '../../services/email/abandonedCartEmail';
import { checkoutExperiments } from '../../services/experiments/checkoutExperiments';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface CartItem {
  id: string;
  product: {
    name: string;
    sku: string;
    thumbnail: {
      url: string;
    };
  };
  quantity: number;
  prices: {
    row_total: {
      value: number;
      currency: string;
    };
  };
}

interface CartSummarySidebarProps {
  cartId: string;
  className?: string;
}

export const CartSummarySidebar: React.FC<CartSummarySidebarProps> = ({ cartId, className }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const promoInputRef = useRef<HTMLInputElement>(null);

  // Get experiment variant
  const summaryPosition = checkoutExperiments.getAssignment(cartId, 'cart_summary_position');

  // Track visibility
  const { isIntersecting } = useIntersectionObserver(containerRef);

  useEffect(() => {
    if (isIntersecting) {
      checkoutAnalytics.cartSummaryInteraction({
        cartId,
        interactionType: 'view',
      });
    }
  }, [isIntersecting, cartId]);

  // Track cart activity for abandonment
  useEffect(() => {
    abandonedCartService.trackActivity(cartId);
  }, [cartId]);

  const handleScroll = () => {
    if (containerRef.current) {
      checkoutAnalytics.cartSummaryScroll({
        cartId,
        interactionType: 'scroll',
      });
    }
  };

  const handleItemHover = (item: CartItem) => {
    checkoutAnalytics.cartItemHover({
      cartId,
      itemId: item.id,
      itemSku: item.product.sku,
      itemName: item.product.name,
      quantity: item.quantity,
    });
  };

  const handleExpandCollapse = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    
    if (newExpandedState) {
      checkoutAnalytics.cartSummaryExpand({ cartId });
    } else {
      checkoutAnalytics.cartSummaryCollapse({ cartId });
    }

    // Track experiment event
    checkoutExperiments.trackExperimentEvent(
      cartId,
      'cart_summary_position',
      newExpandedState ? 'expand' : 'collapse'
    );
  };

  const handlePromoCodeFocus = () => {
    checkoutAnalytics.promoCodeFocus({ cartId });
  };

  const handlePromoCodeBlur = () => {
    checkoutAnalytics.promoCodeBlur({ cartId });
  };

  const { data, loading, error } = useQuery(GET_CART_TOTALS, {
    variables: { cartId },
    pollInterval: 30000, // Poll every 30 seconds to keep totals updated
  });

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 p-4 rounded-lg ${className}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon
              className="h-5 w-5 text-red-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Unable to load cart summary
            </h3>
          </div>
        </div>
      </div>
    );
  }

  const { cart } = data;
  const items = cart.items as CartItem[];
  const totals = cart.prices;
  const shippingMethod = cart.shipping_addresses[0]?.selected_shipping_method;

  // Apply position based on experiment
  const sidebarPosition = {
    right: 'lg:col-start-8 lg:col-span-5',
    left: 'lg:col-start-1 lg:col-span-5',
    floating: 'fixed bottom-0 right-0 lg:w-96 shadow-lg',
  }[summaryPosition];

  return (
    <div
      ref={containerRef}
      className={`bg-gray-50 rounded-lg ${className} ${sidebarPosition}`}
      onScroll={handleScroll}
    >
      <div className="px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
          <button
            onClick={handleExpandCollapse}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>

        {isExpanded && (
          <>
            {/* Cart Items */}
            <div className="mt-6 flow-root">
              <ul role="list" className="-my-6 divide-y divide-gray-200">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex py-6"
                    onMouseEnter={() => handleItemHover(item)}
                  >
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.product.thumbnail.url}
                        alt={item.product.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.product.name}</h3>
                          <p className="ml-4">
                            {item.prices.row_total.currency}{' '}
                            {item.prices.row_total.value.toFixed(2)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">SKU: {item.product.sku}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="text-gray-500">Qty {item.quantity}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Summary */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {totals.subtotal_excluding_tax.currency}{' '}
                  {totals.subtotal_excluding_tax.value.toFixed(2)}
                </dd>
              </div>

              {shippingMethod && (
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">
                    Shipping ({shippingMethod.carrier_title})
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {shippingMethod.amount.currency}{' '}
                    {shippingMethod.amount.value.toFixed(2)}
                  </dd>
                </div>
              )}

              {totals.applied_taxes?.map((tax: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">{tax.label}</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {tax.amount.currency} {tax.amount.value.toFixed(2)}
                  </dd>
                </div>
              ))}

              {totals.discount && (
                <div className="flex items-center justify-between text-green-600">
                  <dt className="text-sm">Discount</dt>
                  <dd className="text-sm font-medium">
                    -{totals.discount.currency} {Math.abs(totals.discount.value).toFixed(2)}
                  </dd>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">Order Total</dt>
                <dd className="text-base font-medium text-gray-900">
                  {totals.grand_total.currency} {totals.grand_total.value.toFixed(2)}
                </dd>
              </div>
            </div>

            {/* Promo Code Section */}
            <div className="mt-6">
              <form className="mt-2" onSubmit={(e) => {
                e.preventDefault();
                // Handle promo code submission
              }}>
                <label htmlFor="promoCode" className="sr-only">
                  Promotion code
                </label>
                <div className="flex space-x-4">
                  <input
                    ref={promoInputRef}
                    type="text"
                    id="promoCode"
                    name="promoCode"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    onFocus={handlePromoCodeFocus}
                    onBlur={handlePromoCodeBlur}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    placeholder="Enter promotion code"
                  />
                  <button
                    type="submit"
                    className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    Apply
                  </button>
                </div>
              </form>
            </div>

            {/* Security Notice */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="ml-2 text-sm text-gray-500">
                  Secure checkout powered by Adobe Commerce
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
