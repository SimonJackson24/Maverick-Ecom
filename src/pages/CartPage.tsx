import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { Helmet } from 'react-helmet-async';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import RelatedProducts from '../components/products/RelatedProducts';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Cart } from '../types/commerce';

export const CartPage: React.FC = () => {
  const { cart, loading } = useCart();

  // Get the most common scent family from cart items
  const dominantScentFamily = React.useMemo(() => {
    if (!cart?.items.length) return null;

    const scentFamilies = cart.items
      .map(item => {
        const scentProfile = item.product.custom_attributes?.scent_profile;
        return typeof scentProfile === 'string' ? JSON.parse(scentProfile).scent_family : null;
      })
      .filter(Boolean);

    if (!scentFamilies.length) return null;

    const scentCount = scentFamilies.reduce((acc, scent) => {
      if (scent) {
        acc[scent] = (acc[scent] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const sorted = Object.entries(scentCount).sort(([, a], [, b]) => b - a);
    return sorted.length > 0 ? sorted[0][0] : null;
  }, [cart?.items]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>
        <div className="mt-12 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!cart || !cart.items.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <Helmet>
          <title>Shopping Cart - Wick & Wax Co</title>
        </Helmet>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your cart is empty
          </h1>
          <p className="mt-4 text-gray-500">
            Looks like you haven't added any items to your cart yet.
          </p>
          <div className="mt-6">
            <Link
              to="/products"
              className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <Helmet>
        <title>Shopping Cart - Wick & Wax Co</title>
      </Helmet>

      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Shopping Cart ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
      </h1>

      <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
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

        <section aria-labelledby="summary-heading" className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
          <CartSummary cart={cart as Cart} />
        </section>
      </div>

      {dominantScentFamily && (
        <section aria-labelledby="related-heading" className="mt-24">
          <h2 id="related-heading" className="text-lg font-medium text-gray-900">
            You might also like
          </h2>

          <RelatedProducts
            scentFamily={dominantScentFamily}
            excludeSkus={cart.items.map(item => item.product.sku)}
          />
        </section>
      )}
    </div>
  );
};

export default CartPage;