import React from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useWishlist } from '../../store/WishlistContext';

interface WishlistButtonProps {
  sku: string;
  className?: string;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({ sku, className = '' }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist, loading, wishlist } = useWishlist();

  const inWishlist = isInWishlist(sku);
  const wishlistItem = wishlist?.items.find(item => item.product.sku === sku);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if button is inside a link
    e.stopPropagation();

    try {
      if (inWishlist && wishlistItem) {
        await removeFromWishlist(wishlistItem.id);
      } else {
        await addToWishlist(sku);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={loading}
      className={`
        inline-flex items-center justify-center p-2
        text-gray-400 hover:text-primary-500 
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        ${inWishlist ? 'text-primary-500' : ''}
        ${className}
      `}
      aria-label={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
    >
      {inWishlist ? (
        <HeartIconSolid className="h-6 w-6" />
      ) : (
        <HeartIcon className="h-6 w-6" />
      )}
    </button>
  );
};
