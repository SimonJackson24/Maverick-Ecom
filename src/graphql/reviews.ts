import { gql } from '@apollo/client';

export const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews($productId: ID!, $page: Int!, $pageSize: Int!) {
    productReviews(productId: $productId, page: $page, pageSize: $pageSize) {
      items {
        id
        rating
        title
        content
        helpful
        unhelpful
        verified
        createdAt
        user {
          name
          avatar
        }
        status
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
    reviewStats(productId: $productId) {
      averageRating
      totalReviews
      ratingDistribution {
        rating
        count
      }
    }
  }
`;

export const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      rating
      title
      content
      createdAt
      status
    }
  }
`;

export const UPDATE_REVIEW_HELPFUL = gql`
  mutation UpdateReviewHelpful($reviewId: ID!, $helpful: Boolean!) {
    updateReviewHelpful(reviewId: $reviewId, helpful: $helpful) {
      id
      helpful
      unhelpful
    }
  }
`;
