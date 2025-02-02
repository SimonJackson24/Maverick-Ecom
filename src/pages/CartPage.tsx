import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCommerce } from '../store/CommerceContext';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';

export const CartPage: React.FC = () => {
  const { cart, loading } = useCommerce();

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>
        <div className="mt-12">
          <div className="flow-root">
            <div className="divide-y divide-gray-200">
              {[1, 2, 3].map((i) => (
                <div key={i} className="py-6">
                  <div className="flex animate-pulse">
                    <div className="h-24 w-24 flex-shrink-0 rounded-md bg-gray-200 sm:h-32 sm:w-32" />
                    <div className="ml-4 flex flex-1 flex-col sm:ml-6">
                      <div className="h-4 w-1/2 bg-gray-200 rounded" />
                      <div className="mt-2 h-4 w-1/4 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="text-center">
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Your cart is empty
          </h1>
          <p className="mt-4 text-base text-gray-500">
            Browse our eco-friendly products and add something special to your cart.
          </p>
          <div className="mt-6">
            <Link
              to="/products"
              className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart | The Wick & Wax Co</title>
        <meta
          name="description"
          content="Review and manage items in your shopping cart at The Wick & Wax Co. Eco-friendly candles and bath products made with sustainable materials."
        />
      </Helmet>

      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>
          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>

              <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
                {cart.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </ul>
            </section>

            {/* Cart summary */}
            <CartSummary cart={cart} />
          </form>
        </div>
      </div>

      {/* Related/Recommended products could be added here */}
    </>
  );
};
