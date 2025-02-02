import React from 'react';
import { Link } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { CartItem as CartItemType } from '../../types/commerce';
import { useCommerce } from '../../store/CommerceContext';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateCartItem, removeFromCart, loading } = useCommerce();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity === 0) {
      await removeFromCart(item.id);
    } else {
      await updateCartItem(item.id, newQuantity);
    }
  };

  return (
    <li className="flex py-6">
      <div className="flex-shrink-0">
        <Link to={`/product/${item.product.url_key}`}>
          <img
            src={item.product.image.url}
            alt={item.product.image.label}
            className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"
          />
        </Link>
      </div>

      <div className="ml-4 flex flex-1 flex-col sm:ml-6">
        <div>
          <div className="flex justify-between">
            <h4 className="text-sm">
              <Link to={`/product/${item.product.url_key}`} className="font-medium text-gray-700 hover:text-gray-800">
                {item.product.name}
              </Link>
            </h4>
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 disabled:opacity-50"
              onClick={() => removeFromCart(item.id)}
              disabled={loading}
            >
              <span className="sr-only">Remove</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
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

        <div className="mt-4 flex flex-1 items-end justify-between">
          <div className="flex items-center space-x-2">
            <label htmlFor={`quantity-${item.id}`} className="sr-only">
              Quantity
            </label>
            <select
              id={`quantity-${item.id}`}
              name={`quantity-${item.id}`}
              value={item.quantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              disabled={loading}
              className="rounded-md border border-gray-300 text-left text-base font-medium text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num === 0 ? 'Remove' : num}
                </option>
              ))}
            </select>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900">
              {item.product.price.regularPrice.amount.currency}{' '}
              {(item.product.price.regularPrice.amount.value * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
};
