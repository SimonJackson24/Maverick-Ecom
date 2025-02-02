import { gql } from '@apollo/client';

export const PRODUCT_FRAGMENT = gql`
  fragment ProductFields on ProductInterface {
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
    description {
      html
    }
    short_description {
      html
    }
    image {
      url
      label
    }
    media_gallery {
      url
      label
      position
    }
    categories {
      id
      name
      url_path
    }
    meta_description
    stock_status
    ... on SimpleProduct {
      eco_friendly_features
      sustainable_materials
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts(
    $pageSize: Int!
    $currentPage: Int!
    $filter: ProductAttributeFilterInput
    $sort: ProductAttributeSortInput
  ) {
    products(
      pageSize: $pageSize
      currentPage: $currentPage
      filter: $filter
      sort: $sort
    ) {
      items {
        ...ProductFields
      }
      total_count
      page_info {
        total_pages
        current_page
        page_size
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const GET_PRODUCT_BY_URL_KEY = gql`
  query GetProductByUrlKey($urlKey: String!) {
    products(filter: { url_key: { eq: $urlKey } }) {
      items {
        ...ProductFields
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      items {
        id
        name
        url_path
        description
        image
        children {
          id
          name
          url_path
          description
          image
        }
      }
    }
  }
`;

export const GET_CATEGORY = gql`
  query GetCategory($id: String!) {
    category(id: $id) {
      id
      name
      url_path
      description
      image
      products(pageSize: 12, currentPage: 1) {
        items {
          ...ProductFields
        }
        total_count
        page_info {
          total_pages
          current_page
          page_size
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const CREATE_CART = gql`
  mutation CreateCart {
    createEmptyCart
  }
`;

export const GET_CART = gql`
  query GetCart($cartId: String!) {
    cart(cart_id: $cartId) {
      id
      items {
        id
        product {
          ...ProductFields
        }
        quantity
      }
      prices {
        subtotal_excluding_tax {
          value
          currency
        }
        subtotal_including_tax {
          value
          currency
        }
        discounts {
          amount {
            value
            currency
          }
          label
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($cartId: String!, $sku: String!, $quantity: Float!) {
    addSimpleProductsToCart(
      input: {
        cart_id: $cartId
        cart_items: [{ data: { quantity: $quantity, sku: $sku } }]
      }
    ) {
      cart {
        id
        items {
          id
          product {
            ...ProductFields
          }
          quantity
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($cartId: String!, $itemId: Int!, $quantity: Float!) {
    updateCartItems(
      input: {
        cart_id: $cartId
        cart_items: [{ cart_item_id: $itemId, quantity: $quantity }]
      }
    ) {
      cart {
        id
        items {
          id
          product {
            ...ProductFields
          }
          quantity
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($cartId: String!, $itemId: Int!) {
    removeItemFromCart(
      input: { cart_id: $cartId, cart_item_id: $itemId }
    ) {
      cart {
        id
        items {
          id
          product {
            ...ProductFields
          }
          quantity
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer(
    $email: String!
    $firstname: String!
    $lastname: String!
    $password: String!
  ) {
    createCustomer(
      input: {
        email: $email
        firstname: $firstname
        lastname: $lastname
        password: $password
      }
    ) {
      customer {
        id
        email
        firstname
        lastname
      }
    }
  }
`;

export const GENERATE_CUSTOMER_TOKEN = gql`
  mutation GenerateCustomerToken($email: String!, $password: String!) {
    generateCustomerToken(email: $email, password: $password) {
      token
    }
  }
`;

export const GET_CUSTOMER = gql`
  query GetCustomer {
    customer {
      id
      email
      firstname
      lastname
      addresses {
        id
        firstname
        lastname
        street
        city
        region {
          region_code
          region
        }
        postcode
        country_code
        telephone
        default_shipping
        default_billing
      }
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($search: String!, $pageSize: Int!, $currentPage: Int!) {
    products(
      search: $search
      pageSize: $pageSize
      currentPage: $currentPage
    ) {
      items {
        ...ProductFields
      }
      total_count
      page_info {
        total_pages
        current_page
        page_size
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;
