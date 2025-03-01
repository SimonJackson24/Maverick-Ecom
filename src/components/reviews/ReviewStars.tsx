import React from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export interface ReviewStarsProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export const ReviewStars: React.FC<ReviewStarsProps> = ({
  rating,
  reviewCount,
  size = 'md',
  interactive = false,
  onChange
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const normalizedRating = Math.round(rating / 20); // Convert 0-100 scale to 0-5

  return (
    <div className="flex items-center">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = interactive
            ? star <= (hoverRating || normalizedRating)
            : star <= normalizedRating;

          return (
            <button
              key={star}
              type="button"
              className={clsx(
                'text-primary-500',
                interactive && 'cursor-pointer hover:scale-110 transition-transform'
              )}
              onClick={() => interactive && onChange?.(star)}
              onMouseEnter={() => interactive && setHoverRating(star)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              disabled={!interactive}
            >
              {filled ? (
                <StarIcon className={sizeClasses[size]} />
              ) : (
                <StarOutlineIcon className={sizeClasses[size]} />
              )}
            </button>
          );
        })}
      </div>
      {reviewCount !== undefined && (
        <p className="ml-2 text-sm text-gray-500">
          {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
        </p>
      )}
    </div>
  );
};

export default ReviewStars;
