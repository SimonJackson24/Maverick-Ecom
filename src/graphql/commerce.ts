import { gql } from '@apollo/client';

export const GET_CART = gql`
  query GetCart {
    cart {
      id
      items {
        id
        product {
          id
          name
          price
          images {
            url
            alt
          }
        }
        quantity
        total
      }
      subtotal
      tax
      shipping
      total
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!) {
    addToCart(productId: $productId, quantity: $quantity) {
      id
      items {
        id
        product {
          id
          name
          price
          images {
            url
            alt
          }
        }
        quantity
        total
      }
      subtotal
      tax
      shipping
      total
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($itemId: ID!, $quantity: Int!) {
    updateCartItem(itemId: $itemId, quantity: $quantity) {
      id
      items {
        id
        product {
          id
          name
          price
          images {
            url
            alt
          }
        }
        quantity
        total
      }
      subtotal
      tax
      shipping
      total
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($itemId: ID!) {
    removeFromCart(itemId: $itemId) {
      id
      items {
        id
        product {
          id
          name
          price
          images {
            url
            alt
          }
        }
        quantity
        total
      }
      subtotal
      tax
      shipping
      total
    }
  }
`;

export const SET_SHIPPING_ADDRESS = gql`
  mutation SetShippingAddress($input: AddressInput!) {
    setShippingAddress(input: $input) {
      id
      shippingAddress {
        firstName
        lastName
        company
        street
        city
        state
        postcode
        country
        phone
      }
    }
  }
`;

export const SET_BILLING_ADDRESS = gql`
  mutation SetBillingAddress($input: AddressInput!) {
    setBillingAddress(input: $input) {
      id
      billingAddress {
        firstName
        lastName
        company
        street
        city
        state
        postcode
        country
        phone
      }
    }
  }
`;

export const SET_SHIPPING_METHOD = gql`
  mutation SetShippingMethod($methodId: ID!) {
    setShippingMethod(methodId: $methodId) {
      id
      shippingMethod {
        id
        name
        price
        estimatedDays
      }
      shipping
      total
    }
  }
`;

export const SET_PAYMENT_METHOD = gql`
  mutation SetPaymentMethod($methodId: ID!) {
    setPaymentMethod(methodId: $methodId) {
      id
      paymentMethod {
        id
        name
        type
      }
    }
  }
`;

export const PLACE_ORDER = gql`
  mutation PlaceOrder {
    placeOrder {
      id
      orderNumber
      status
      total
      createdAt
    }
  }
`;

export const GET_AVAILABLE_SHIPPING_METHODS = gql`
  query GetAvailableShippingMethods {
    availableShippingMethods {
      id
      name
      price
      estimatedDays
      carrier
    }
  }
`;

export const GET_AVAILABLE_PAYMENT_METHODS = gql`
  query GetAvailablePaymentMethods {
    availablePaymentMethods {
      id
      name
      type
      description
    }
  }
`;
