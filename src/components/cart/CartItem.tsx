import React from 'react';
import { Link } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { CartItem as CartItemType } from '../../types/commerce';
import { useCommerce } from '../../store/CommerceContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateCartItem, removeFromCart, loading } = useCommerce();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity === 0) {
      await removeFromCart(item.id);
    } else {
      await updateCartItem(item.id, newQuantity);
    }
  };

  const { product, prices } = item;
  const attributes = product.custom_attributes || {};

  return (
    <li className="flex py-6">
      <div className="flex-shrink-0">
        <Link to={`/product/${product.url_key}`}>
          <img
            src={product.image.url}
            alt={product.image.label}
            className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"
          />
        </Link>
      </div>

      <div className="ml-4 flex flex-1 flex-col sm:ml-6">
        <div>
          <div className="flex justify-between">
            <h4 className="text-sm">
              <Link to={`/product/${product.url_key}`} className="font-medium text-gray-700 hover:text-gray-800">
                {product.name}
              </Link>
            </h4>
            <button
              type="button"
              className="-m-2 p-2 text-gray-400 hover:text-gray-500 disabled:opacity-50"
              onClick={() => handleQuantityChange(0)}
              disabled={loading}
            >
              <span className="sr-only">Remove</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Product attributes */}
          <div className="mt-1 flex text-sm">
            {attributes.scent && (
              <p className="text-gray-500">
                Scent: <span className="ml-1 text-gray-700">{attributes.scent}</span>
              </p>
            )}
            {attributes.size && (
              <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                Size: <span className="ml-1 text-gray-700">{attributes.size}</span>
              </p>
            )}
          </div>

          {/* Price */}
          <div className="mt-1 flex items-end justify-between">
            <p className="text-sm font-medium text-gray-900">
              {prices.row_total.currency} {prices.row_total.value.toFixed(2)}
            </p>

            {/* Quantity selector */}
            <div className="flex items-center">
              <label htmlFor={`quantity-${item.id}`} className="sr-only">
                Quantity, {item.quantity}
              </label>
              <select
                id={`quantity-${item.id}`}
                name={`quantity-${item.id}`}
                value={item.quantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                disabled={loading}
                className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
