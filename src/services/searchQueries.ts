import { gql } from '@apollo/client';

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($query: String!, $filters: ProductFilterInput, $sort: ProductSortInput, $page: Int!, $pageSize: Int!) {
    searchProducts(query: $query, filters: $filters, sort: $sort, page: $page, pageSize: $pageSize) {
      items {
        id
        name
        urlKey
        sku
        price
        description
        shortDescription
        images {
          url
          alt
        }
        categories {
          id
          name
          urlKey
        }
        attributes {
          code
          name
          value
        }
      }
      totalCount
      pageInfo {
        currentPage
        totalPages
        hasNextPage
        hasPreviousPage
      }
      facets {
        code
        name
        options {
          value
          count
          label
        }
      }
    }
  }
`;

export const SEARCH_SUGGESTIONS = gql`
  query SearchSuggestions($query: String!) {
    searchSuggestions(query: $query) {
      text
      type
      url
      category {
        id
        name
        urlKey
      }
      product {
        id
        name
        urlKey
        price
        images {
          url
          alt
        }
      }
    }
  }
`;
