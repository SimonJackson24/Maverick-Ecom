import { gql } from '@apollo/client';

export const GET_ORDERS = gql`
  query GetOrders(
    $status: String
    $dateRange: String
    $searchQuery: String
    $page: Int
    $perPage: Int
  ) {
    orders(
      status: $status
      dateRange: $dateRange
      searchQuery: $searchQuery
      page: $page
      perPage: $perPage
    ) {
      items {
        id
        orderNumber
        customerName
        customerEmail
        total
        items
        orderStatus
        paymentStatus
        shippingStatus
        createdAt
        shippingAddress {
          street
          city
          state
          zip
          country
        }
      }
      total
      pageInfo {
        hasNextPage
        hasPreviousPage
        currentPage
        totalPages
      }
    }
    orderStats {
      total
      pending
      processing
      completed
      cancelled
      todayOrders
      todayRevenue
      weeklyOrders
      weeklyRevenue
      monthlyOrders
      monthlyRevenue
    }
  }
`;

export const GET_ORDERS_FOR_FULFILLMENT = gql`
  query GetOrdersForFulfillment {
    ordersForFulfillment {
      id
      orderNumber
      createdAt
      status
      items {
        id
        quantity
        product {
          id
          name
          sku
        }
      }
      customer {
        id
        name
        email
      }
      shippingAddress {
        street
        city
        state
        zip
        country
      }
      total
      paymentStatus
      shippingStatus
    }
  }
`;
