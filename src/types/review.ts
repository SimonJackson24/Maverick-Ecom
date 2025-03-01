export interface ProductReview {
  id: string;
  product_id: string;
  customer_id: string;
  rating: number;
  title: string;
  content: string;
  helpful_votes: number;
  unhelpful_votes: number;
  is_verified_purchase: boolean;
  created_at: string;
  status: ReviewStatus;
  customer: {
    name: string;
    avatar_url?: string;
  };
}

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface RatingDistribution {
  rating: number;
  count: number;
  percentage: number;
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: RatingDistribution[];
}

export interface ReviewsResponse {
  items: ProductReview[];
  total_count: number;
  page_info: {
    current_page: number;
    page_size: number;
    total_pages: number;
  };
  stats: ReviewStats;
}

export interface CreateReviewInput {
  product_id: string;
  rating: number;
  title: string;
  content: string;
}
