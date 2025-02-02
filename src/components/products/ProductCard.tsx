import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/commerce';
import { useCommerce } from '../../store/CommerceContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, loading } = useCommerce();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await addToCart(product.sku, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const price = product.price.regularPrice.amount;
  const minPrice = product.price.minimalPrice?.amount;
  const isOnSale = minPrice && minPrice.value < price.value;

  return (
    <Link to={`/product/${product.url_key}`} className="group">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
        <img
          src={product.image.url}
          alt={product.image.label}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
        {isOnSale && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
              Sale
            </span>
          </div>
        )}
        {product.stock_status === 'OUT_OF_STOCK' && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm text-gray-700">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {product.categories[0]?.name}
          </p>
        </div>
        <div className="text-right">
          {isOnSale ? (
            <div>
              <p className="text-sm text-gray-500 line-through">
                {price.currency} {price.value.toFixed(2)}
              </p>
              <p className="text-sm font-medium text-red-600">
                {minPrice.currency} {minPrice.value.toFixed(2)}
              </p>
            </div>
          ) : (
            <p className="text-sm font-medium text-gray-900">
              {price.currency} {price.value.toFixed(2)}
            </p>
          )}
        </div>
      </div>
      {product.stock_status === 'IN_STOCK' && (
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="mt-4 w-full rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
      )}
      {product.eco_friendly_features && product.eco_friendly_features.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {product.eco_friendly_features.map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10"
            >
              {feature}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
};
