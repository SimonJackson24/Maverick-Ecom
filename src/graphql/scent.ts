import { gql } from '@apollo/client';

export const SCENT_FRAGMENTS = gql`
  fragment ScentAttributes on Product {
    scent_profile {
      top_notes
      middle_notes
      base_notes
      intensity
      mood
      season
      category
    }
    scent_categories
    similar_scents
  }
`;

export const RECOMMENDATION_FRAGMENTS = gql`
  fragment RecommendationAttributes on ScentRecommendation {
    score
    matching_notes
    matching_categories
    explanation
  }
`;

export const GET_PRODUCT_SCENT_PROFILE = gql`
  query GetProductScentProfile($sku: String!) {
    product(sku: $sku) {
      id
      sku
      name
      ...ScentAttributes
    }
  }
  ${SCENT_FRAGMENTS}
`;

export const GET_SIMILAR_SCENTS = gql`
  query GetSimilarScents($productId: ID!, $limit: Int) {
    similarScents(productId: $productId, limit: $limit) {
      items {
        id
        sku
        name
        url_key
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
          }
        }
        thumbnail {
          url
          label
        }
        ...ScentAttributes
        recommendation {
          ...RecommendationAttributes
        }
      }
      total_count
    }
  }
  ${SCENT_FRAGMENTS}
  ${RECOMMENDATION_FRAGMENTS}
`;

export const GET_PERSONALIZED_RECOMMENDATIONS = gql`
  query GetPersonalizedRecommendations($limit: Int) {
    personalizedRecommendations(limit: $limit) {
      items {
        id
        sku
        name
        url_key
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
          }
        }
        thumbnail {
          url
          label
        }
        ...ScentAttributes
        recommendation {
          ...RecommendationAttributes
        }
      }
      total_count
    }
  }
  ${SCENT_FRAGMENTS}
  ${RECOMMENDATION_FRAGMENTS}
`;

export const GET_SCENT_CATEGORIES = gql`
  query GetScentCategories {
    scentCategories {
      id
      name
      description
      parent_id
      products_count
      children {
        id
        name
        description
        products_count
      }
    }
  }
`;

export const UPDATE_CUSTOMER_SCENT_PREFERENCES = gql`
  mutation UpdateCustomerScentPreferences($input: CustomerScentPreferencesInput!) {
    updateCustomerScentPreferences(input: $input) {
      success
      customer {
        id
        scent_preferences {
          favorite_notes
          preferred_intensity
          seasonal_preferences
          avoided_notes
          preferred_categories
        }
      }
    }
  }
`;

export const TRACK_SCENT_INTERACTION = gql`
  mutation TrackScentInteraction($input: ScentInteractionInput!) {
    trackScentInteraction(input: $input) {
      success
      interaction {
        id
        productId
        action
        timestamp
      }
    }
  }
`;
