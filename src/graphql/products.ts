import { gql } from '@apollo/client';

export const PRODUCT_BASE_FIELDS = gql`
  fragment ProductBaseFields on Product {
    id
    sku
    name
    url_key
    price {
      regularPrice {
        amount {
          value
          currency
        }
      }
      minimalPrice {
        amount {
          value
          currency
        }
      }
    }
    image {
      url
      label
    }
    description {
      html
    }
    meta_description
    media_gallery {
      url
      label
    }
    eco_friendly_features
    sustainable_materials
    stock_status
    categories {
      id
      name
      url_path
    }
    rating_summary
    review_count
    scent_profile {
      primary_scent
      scent_family
      scent_notes
      intensity
    }
    custom_attributes {
      attribute_code
      value
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($urlKey: String!) {
    product(urlKey: $urlKey) {
      ...ProductBaseFields
      custom_attributes {
        attribute_code
        value
      }
    }
  }
  ${PRODUCT_BASE_FIELDS}
`;

export const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts {
    featuredProducts {
      ...ProductBaseFields
    }
  }
  ${PRODUCT_BASE_FIELDS}
`;

export const GET_RELATED_PRODUCTS = gql`
  query GetRelatedProducts($sku: String!) {
    product(sku: $sku) {
      related_products {
        items {
          ...ProductBaseFields
        }
      }
    }
  }
  ${PRODUCT_BASE_FIELDS}
`;

export const GET_PRODUCTS = gql`
  query GetProducts($filter: ProductFilterInput, $sort: ProductSortInput, $pageSize: Int, $currentPage: Int) {
    products(filter: $filter, sort: $sort, pageSize: $pageSize, currentPage: $currentPage) {
      items {
        ...ProductBaseFields
      }
      total_count
      page_info {
        current_page
        page_size
        total_pages
      }
    }
  }
  ${PRODUCT_BASE_FIELDS}
`;
