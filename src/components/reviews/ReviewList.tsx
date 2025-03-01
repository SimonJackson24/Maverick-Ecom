import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCT_REVIEWS } from '../../graphql/reviews';
import { ReviewsResponse } from '../../types/review';
import { ReviewStars } from './ReviewStars';
import { ReviewItem } from './ReviewItem';
import { Button } from '../common/Button';
import { ApiResponse } from '../../types/api';
import { monitoring } from '../../services/monitoring/MonitoringService';

interface ReviewListProps {
  productId: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({ productId }) => {
  const [page, setPage] = React.useState(1);
  const pageSize = 5;

  const { data, loading, error } = useQuery<ApiResponse<ReviewsResponse>>(GET_PRODUCT_REVIEWS, {
    variables: { 
      product_id: productId, 
      page, 
      page_size: pageSize 
    },
    onError: (error) => {
      monitoring.logError('reviews_query_error', {
        message: error.message,
        componentName: 'ReviewList',
        additionalContext: { productId }
      });
    }
  });

  if (loading) {
    return (
      <div className="animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="mb-4 rounded-lg bg-gray-100 p-4"
          >
            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-full bg-gray-200 rounded mb-2" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-50">
        <p className="font-medium">Error loading reviews</p>
        <p className="text-sm mt-1">Please try again later or contact support if the problem persists.</p>
      </div>
    );
  }

  const { items: reviews, total_count, page_info, stats } = data.data;

  if (total_count === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900">No reviews yet</h3>
        <p className="mt-2 text-sm text-gray-500">Be the first to review this product</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Review Summary */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Customer Reviews</h3>
            <div className="mt-1 flex items-center">
              <ReviewStars rating={stats.average_rating} />
              <p className="ml-2 text-sm text-gray-500">
                Based on {stats.total_reviews} reviews
              </p>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="mt-6">
          {stats.rating_distribution.map((dist) => (
            <div key={dist.rating} className="flex items-center mt-2">
              <div className="w-16 text-sm text-gray-600">{dist.rating} stars</div>
              <div className="w-full h-4 mx-4 bg-gray-200 rounded">
                <div
                  className="h-4 bg-primary-500 rounded"
                  style={{ width: `${dist.percentage}%` }}
                />
              </div>
              <div className="w-16 text-sm text-gray-600">{dist.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>

      {/* Pagination */}
      {page_info.total_pages > 1 && (
        <div className="flex justify-center mt-8 space-x-4">
          <Button
            variant="outlined"
            size="medium"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="medium"
            onClick={() => setPage(page + 1)}
            disabled={page === page_info.total_pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
