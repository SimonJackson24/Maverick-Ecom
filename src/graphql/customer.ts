import { gql } from '@apollo/client';

export const GET_CUSTOMER_PROFILE = gql`
  query GetCustomerProfile {
    customerProfile {
      id
      firstName
      lastName
      email
      phone
      createdAt
      lastLoginAt
    }
  }
`;

export const UPDATE_CUSTOMER_PROFILE = gql`
  mutation UpdateCustomerProfile($input: CustomerProfileInput!) {
    updateCustomerProfile(input: $input) {
      id
      firstName
      lastName
      email
      phone
    }
  }
`;

export const GET_CUSTOMER_ORDERS = gql`
  query GetCustomerOrders {
    customerOrders {
      id
      orderNumber
      total
      status
      createdAt
      items {
        id
        productName
        quantity
        price
        total
      }
      shippingAddress {
        firstName
        lastName
        street
        city
        state
        postcode
        country
      }
      shippingMethod
      trackingNumber
    }
  }
`;

export const GET_CUSTOMER_ADDRESSES = gql`
  query GetCustomerAddresses {
    customerAddresses {
      id
      type
      firstName
      lastName
      company
      street
      city
      state
      postcode
      country
      phone
      isDefault
    }
  }
`;

export const ADD_ADDRESS = gql`
  mutation AddAddress($input: AddressInput!) {
    addAddress(input: $input) {
      id
      type
      firstName
      lastName
      company
      street
      city
      state
      postcode
      country
      phone
      isDefault
    }
  }
`;

export const UPDATE_ADDRESS = gql`
  mutation UpdateAddress($id: ID!, $input: AddressInput!) {
    updateAddress(id: $id, input: $input) {
      id
      type
      firstName
      lastName
      company
      street
      city
      state
      postcode
      country
      phone
      isDefault
    }
  }
`;

export const DELETE_ADDRESS = gql`
  mutation DeleteAddress($id: ID!) {
    deleteAddress(id: $id) {
      id
    }
  }
`;

export const GET_WISHLIST = gql`
  query GetWishlist {
    wishlist {
      id
      items {
        id
        product {
          id
          name
          description
          price
          images {
            id
            url
            alt
          }
          inStock
        }
        addedAt
      }
    }
  }
`;

export const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist($productId: ID!) {
    addToWishlist(productId: $productId) {
      id
      items {
        id
        product {
          id
          name
        }
      }
    }
  }
`;

export const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist($productId: ID!) {
    removeFromWishlist(productId: $productId) {
      id
      items {
        id
        product {
          id
          name
        }
      }
    }
  }
`;

export const UPDATE_CUSTOMER_SETTINGS = gql`
  mutation UpdateCustomerSettings($input: CustomerSettingsInput!) {
    updateCustomerSettings(input: $input) {
      emailNotifications
      orderUpdates
      promotionalEmails
      stockAlerts
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      success
      message
    }
  }
`;

export const GET_ORDER_DETAILS = gql`
  query GetOrderDetails($orderId: ID!) {
    order(id: $orderId) {
      id
      orderNumber
      total
      status
      createdAt
      items {
        id
        productName
        quantity
        price
        total
      }
      shippingAddress {
        firstName
        lastName
        street
        city
        state
        postcode
        country
      }
      shippingMethod {
        id
        name
        price
      }
      trackingNumber
    }
  }
`;

export const REQUEST_RETURN = gql`
  mutation RequestReturn($orderId: ID!, $items: [ReturnItemInput!]!, $reason: String!) {
    requestReturn(orderId: $orderId, items: $items, reason: $reason) {
      id
      status
      returnNumber
      createdAt
    }
  }
`;

export const GET_RETURN_LABEL = gql`
  mutation GetReturnLabel($returnId: ID!) {
    getReturnLabel(returnId: $returnId) {
      labelUrl
      trackingNumber
    }
  }
`;
