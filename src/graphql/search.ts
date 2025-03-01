import { gql } from '@apollo/client';
import { SCENT_FRAGMENTS } from './scent';

export const SEARCH_TYPES = gql`
  enum SearchSortField {
    RELEVANCE
    PRICE
    NAME
    NEWEST
    RATING
    BEST_SELLING
  }

  enum SortDirection {
    ASC
    DESC
  }

  input PriceRangeInput {
    from: Float
    to: Float
  }

  input SearchFiltersInput {
    scent_notes: [String!]
    intensity: [String!]
    mood: [String!]
    season: [String!]
    price: PriceRangeInput
    in_stock: Boolean
  }

  input SearchSortInput {
    field: SearchSortField!
    direction: SortDirection!
  }

  input SearchProductsInput {
    query: String
    filters: SearchFiltersInput
    sort: SearchSortInput
    page: Int!
    itemsPerPage: Int!
  }

  type SearchFacet {
    code: String!
    label: String!
    count: Int!
  }

  type SearchFacets {
    scent_notes: [SearchFacet!]!
    intensity: [SearchFacet!]!
    mood: [SearchFacet!]!
    season: [SearchFacet!]!
    price_ranges: [SearchFacet!]!
  }

  type SearchProducts {
    items: [Product!]!
    total_count: Int!
    facets: SearchFacets!
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($input: SearchProductsInput!) {
    searchProducts(input: $input) {
      items {
        id
        sku
        name
        url_key
        thumbnail {
          url
          label
        }
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
          }
        }
        stock_status
        ...ScentAttributes
      }
      total_count
      facets {
        scent_notes {
          code
          label
          count
        }
        intensity {
          code
          label
          count
        }
        mood {
          code
          label
          count
        }
        season {
          code
          label
          count
        }
        price_ranges {
          code
          label
          count
        }
      }
    }
  }
  ${SCENT_FRAGMENTS}
`;
