import { gql } from '@apollo/client';

export const GET_CUSTOMERS = gql`
  query GetCustomers(
    $page: Int
    $perPage: Int
    $searchQuery: String
  ) {
    customers(
      page: $page
      perPage: $perPage
      searchQuery: $searchQuery
    ) {
      items {
        id
        firstName
        lastName
        email
        phone
        totalOrders
        totalSpent
        lastOrderDate
        status
        createdAt
      }
      total
      pageInfo {
        hasNextPage
        hasPreviousPage
        currentPage
        totalPages
      }
    }
  }
`;

export const GET_CUSTOMER = gql`
  query GetCustomer($id: ID!) {
    customer(id: $id) {
      id
      firstName
      lastName
      email
      phone
      totalOrders
      totalSpent
      lastOrderDate
      status
      createdAt
      orders {
        id
        orderNumber
        total
        status
        createdAt
      }
      addresses {
        id
        type
        street
        city
        state
        zip
        country
        isDefault
      }
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($id: ID!, $input: CustomerInput!) {
    updateCustomer(id: $id, input: $input) {
      id
      firstName
      lastName
      email
      phone
      status
    }
  }
`;

export const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($id: ID!) {
    deleteCustomer(id: $id) {
      id
    }
  }
`;
