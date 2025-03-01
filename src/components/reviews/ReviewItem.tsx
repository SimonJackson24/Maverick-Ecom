import React from 'react';
import { useMutation } from '@apollo/client';
import { format } from 'date-fns';
import { HandThumbUpIcon as ThumbUpIcon, HandThumbDownIcon as ThumbDownIcon } from '@heroicons/react/24/outline';
import { ProductReview } from '../../types/review';
import { ReviewStars } from './ReviewStars';
import { UPDATE_REVIEW_HELPFUL } from '../../graphql/reviews';
import { Button } from '../common/Button';

interface ReviewItemProps {
  review: ProductReview;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const [updateHelpful] = useMutation(UPDATE_REVIEW_HELPFUL);
  const [helpfulStatus, setHelpfulStatus] = React.useState<'helpful' | 'unhelpful' | null>(null);

  const handleHelpfulClick = async (helpful: boolean) => {
    if (helpfulStatus !== null) return;

    try {
      await updateHelpful({
        variables: {
          reviewId: review.id,
          helpful
        }
      });
      setHelpfulStatus(helpful ? 'helpful' : 'unhelpful');
    } catch (error) {
      console.error('Error updating review helpful status:', error);
    }
  };

  return (
    <div className="border-b border-gray-200 pb-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center">
            <ReviewStars rating={review.rating} size="sm" />
            <h4 className="ml-2 text-lg font-medium text-gray-900">
              {review.title}
            </h4>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            By {review.user.name} on{' '}
            {format(new Date(review.createdAt), 'MMM d, yyyy')}
          </p>
        </div>
        {review.verified && (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Verified Purchase
          </span>
        )}
      </div>

      <div className="mt-4 space-y-6">
        <p className="text-sm text-gray-600">{review.content}</p>

        <div className="flex items-center space-x-4">
          <Button
            variant="text"
            size="small"
            startIcon={<ThumbUpIcon />}
            onClick={() => handleHelpfulClick(true)}
            disabled={helpfulStatus !== null}
            className={helpfulStatus === 'helpful' ? 'text-primary-500' : ''}
          >
            Helpful ({review.helpful})
          </Button>
          <Button
            variant="text"
            size="small"
            startIcon={<ThumbDownIcon />}
            onClick={() => handleHelpfulClick(false)}
            disabled={helpfulStatus !== null}
            className={helpfulStatus === 'unhelpful' ? 'text-primary-500' : ''}
          >
            Not Helpful ({review.unhelpful})
          </Button>
        </div>
      </div>
    </div>
  );
};
