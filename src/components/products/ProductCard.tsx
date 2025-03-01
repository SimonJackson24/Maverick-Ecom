import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/commerce';
import { useCommerce } from '../../store/CommerceContext';
import { ReviewStars } from '../reviews/ReviewStars';
import { WishlistButton } from '../wishlist/WishlistButton';

interface ProductCardProps {
  product: Product;
  showScentProfile?: boolean;
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showScentProfile, onAddToCart }) => {
  const { addToCart, loading } = useCommerce();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (onAddToCart) {
        onAddToCart();
      } else {
        await addToCart(product.sku, 1);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const price = product.price?.regularPrice?.amount;
  const minPrice = product.price?.minimalPrice?.amount;
  const isOnSale = price && minPrice && minPrice.value < price.value;
  const attributes = product.custom_attributes || {};

  if (!price) {
    return null; // or some fallback UI
  }

  return (
    <div className="group relative">
      <Link to={`/product/${product.url_key}`} className="block">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
          <img
            src={product.image.url}
            alt={product.image.label}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
          {isOnSale && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                Sale
              </span>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <WishlistButton sku={product.sku} />
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
            <div className="mt-1">
              <ReviewStars rating={product.rating_summary} reviewCount={product.review_count} />
            </div>
            {showScentProfile && attributes.scent_profile && (
              <p className="mt-1 text-sm text-gray-500">{attributes.scent_profile}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {isOnSale ? (
                <>
                  <span className="text-red-600">{minPrice.currency} {minPrice.value.toFixed(2)}</span>
                  <span className="ml-2 line-through text-gray-500">
                    {price.currency} {price.value.toFixed(2)}
                  </span>
                </>
              ) : (
                <>
                  {price.currency} {price.value.toFixed(2)}
                </>
              )}
            </p>
          </div>
        </div>
      </Link>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={loading}
          className="relative flex w-full items-center justify-center rounded-md border border-transparent bg-primary-600 px-8 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Adding...</span>
            </div>
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
