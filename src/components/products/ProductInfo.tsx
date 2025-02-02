import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { ShieldCheckIcon, TruckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Product } from '../../types/commerce';
import { useCommerce } from '../../store/CommerceContext';

interface ProductInfoProps {
  product: Product;
}

const benefits = [
  { name: 'Eco-friendly packaging', icon: ShieldCheckIcon, description: 'All our packaging is recyclable or biodegradable' },
  { name: 'Carbon neutral shipping', icon: TruckIcon, description: 'We offset all shipping emissions' },
  { name: '30-day returns', icon: ArrowPathIcon, description: 'If you're not satisfied, return within 30 days' },
];

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, loading } = useCommerce();

  const handleAddToCart = async () => {
    try {
      await addToCart(product.sku, quantity);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const price = product.price.regularPrice.amount;
  const minPrice = product.price.minimalPrice?.amount;
  const isOnSale = minPrice && minPrice.value < price.value;

  return (
    <div className="lg:col-span-2">
      <div className="space-y-6">
        {/* Product name and breadcrumbs */}
        <div>
          <nav aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-2">
              {product.categories.map((category, index) => (
                <React.Fragment key={category.id}>
                  <li>
                    <div className="flex items-center text-sm">
                      <a href={`/products/${category.url_path}`} className="font-medium text-gray-500 hover:text-gray-900">
                        {category.name}
                      </a>
                    </div>
                  </li>
                  {index < product.categories.length - 1 && (
                    <li>
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ol>
          </nav>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>
        </div>

        {/* Pricing */}
        <div className="flex items-center">
          {isOnSale ? (
            <div className="flex items-baseline">
              <p className="text-3xl tracking-tight text-gray-900">{minPrice.currency} {minPrice.value.toFixed(2)}</p>
              <p className="ml-2 text-lg font-medium text-gray-500 line-through">{price.currency} {price.value.toFixed(2)}</p>
            </div>
          ) : (
            <p className="text-3xl tracking-tight text-gray-900">
              {price.currency} {price.value.toFixed(2)}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-6">
          <div
            className="text-base text-gray-700"
            dangerouslySetInnerHTML={{ __html: product.description.html }}
          />
        </div>

        {/* Eco-friendly features */}
        {product.eco_friendly_features && product.eco_friendly_features.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900">Eco-Friendly Features</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.eco_friendly_features.map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center rounded-full bg-green-50 px-3 py-0.5 text-sm font-medium text-green-700"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sustainable materials */}
        {product.sustainable_materials && product.sustainable_materials.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900">Sustainable Materials</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sustainable_materials.map((material) => (
                <span
                  key={material}
                  className="inline-flex items-center rounded-full bg-blue-50 px-3 py-0.5 text-sm font-medium text-blue-700"
                >
                  {material}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quantity selector and Add to cart */}
        {product.stock_status === 'IN_STOCK' && (
          <div className="mt-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <label htmlFor="quantity" className="sr-only">
                  Quantity
                </label>
                <select
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="rounded-md border border-gray-300 text-base font-medium text-gray-700 text-left shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={loading}
                className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-primary-600 px-8 py-3 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add to cart'}
              </button>
            </div>
          </div>
        )}

        {/* Out of stock message */}
        {product.stock_status === 'OUT_OF_STOCK' && (
          <div className="mt-8">
            <p className="text-sm text-red-600">
              This product is currently out of stock. Please check back later.
            </p>
          </div>
        )}

        {/* Benefits */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <h2 className="text-sm font-medium text-gray-900">Our Promise</h2>

          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.name} className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:border-gray-400">
                <div className="flex-shrink-0">
                  <benefit.icon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{benefit.name}</p>
                  <p className="text-sm text-gray-500">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
