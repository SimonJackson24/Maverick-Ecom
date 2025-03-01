import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/product';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { MonitoringService } from '../../services/monitoring/MonitoringService';
import { ImageOptimizationService } from '../../services/optimization/ImageOptimizationService';
import { formatCurrency } from '../../utils/currency';
import { motion } from 'framer-motion';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface ProductCardProps {
  product: Product;
  showActions?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  showActions = true 
}) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const monitoring = MonitoringService.getInstance();
  const imageOptimization = ImageOptimizationService.getInstance();

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addToCart(product);
      monitoring.logEvent('product_added_to_cart', {
        productId: product.id,
        name: product.name,
        price: product.price,
      });
    } catch (error) {
      monitoring.logError('add_to_cart_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        componentName: 'ProductCard',
        additionalContext: { productId: product.id }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
        monitoring.logEvent('product_removed_from_wishlist', {
          productId: product.id,
          name: product.name,
        });
      } else {
        await addToWishlist(product);
        monitoring.logEvent('product_added_to_wishlist', {
          productId: product.id,
          name: product.name,
        });
      }
    } catch (error) {
      monitoring.logError('wishlist_toggle_error', {
        message: error instanceof Error ? error.message : 'Unknown error',
        componentName: 'ProductCard',
        additionalContext: { productId: product.id }
      });
    }
  };

  const handleImageLoad = () => {
    monitoring.logMetric('product_image_load_time', {
      value: performance.now(),
      tags: { 
        component: 'ProductCard',
        productId: product.id 
      }
    });
  };

  const handleImageError = () => {
    setImageError(true);
    monitoring.logError('product_image_load_error', {
      message: 'Failed to load product image',
      componentName: 'ProductCard',
      additionalContext: { 
        productId: product.id,
        imageUrl: product.imageUrl
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
        <Link 
          to={`/products/${product.id}`}
          aria-label={`View details for ${product.name}`}
        >
          {!imageError ? (
            <img
              src={imageOptimization.optimizeImage(product.imageUrl, {
                width: 500,
                height: 500,
                format: 'webp',
              })}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-opacity group-hover:opacity-75"
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100">
              <span className="text-gray-400">Image not available</span>
            </div>
          )}
        </Link>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            <Link 
              to={`/products/${product.id}`}
              className="hover:underline"
            >
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.scentProfile}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">
          {formatCurrency(product.price)}
        </p>
      </div>

      {showActions && (
        <div className="mt-4 flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleWishlistToggle}
            className="text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isInWishlist(product.id) ? (
              <HeartIconSolid className="h-6 w-6 text-red-500" />
            ) : (
              <HeartIcon className="h-6 w-6" />
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={isLoading}
            className={`flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              isLoading ? 'cursor-not-allowed opacity-75' : ''
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCartIcon className="mr-2 h-5 w-5" />
            {isLoading ? 'Adding...' : 'Add to Cart'}
          </motion.button>
        </div>
      )}

      {product.stock <= 5 && product.stock > 0 && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          Only {product.stock} left in stock!
        </p>
      )}

      {product.stock === 0 && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          Out of stock
        </p>
      )}
    </motion.div>
  );
};

export default ProductCard;
