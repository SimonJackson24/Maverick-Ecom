import { gql } from '@apollo/client';

export const ORDER_FRAGMENT = gql`
  fragment OrderFields on CustomerOrder {
    id
    number
    order_date
    status
    total {
      grand_total {
        value
        currency
      }
      subtotal {
        value
        currency
      }
      total_shipping {
        value
        currency
      }
      total_tax {
        value
        currency
      }
    }
    shipping_address {
      firstname
      lastname
      street
      city
      region
      postcode
      country_code
      telephone
    }
    shipping_method
    payment_methods {
      name
      type
      additional_data {
        name
        value
      }
    }
    items {
      id
      product_name
      product_sku
      product_url_key
      product_type
      status
      quantity_ordered
      quantity_shipped
      quantity_refunded
      quantity_canceled
      selected_options {
        label
        value
      }
      product_sale_price {
        value
        currency
      }
    }
    shipments {
      id
      tracking {
        title
        number
        carrier
        status
      }
      items {
        id
        product_name
        quantity_shipped
      }
    }
  }
`;

export const GET_CUSTOMER_ORDERS = gql`
  query GetCustomerOrders($pageSize: Int!, $currentPage: Int!) {
    customer {
      orders(pageSize: $pageSize, currentPage: $currentPage) {
        items {
          ...OrderFields
        }
        page_info {
          current_page
          page_size
          total_pages
        }
        total_count
      }
    }
  }
  ${ORDER_FRAGMENT}
`;

export const GET_ORDER_DETAILS = gql`
  query GetOrderDetails($orderNumber: String!) {
    customer {
      order(number: $orderNumber) {
        ...OrderFields
      }
    }
  }
  ${ORDER_FRAGMENT}
`;

export const TRACK_ORDER = gql`
  query TrackOrder($orderNumber: String!) {
    customer {
      order(number: $orderNumber) {
        id
        number
        status
        shipments {
          id
          tracking {
            title
            number
            carrier
            status
          }
        }
      }
    }
  }
`;

export const REORDER_ITEMS = gql`
  mutation ReorderItems($orderNumber: String!) {
    reorderItems(orderNumber: $orderNumber) {
      cart {
        id
        items {
          id
          product {
            name
            sku
          }
          quantity
        }
      }
      userInputErrors {
        code
        message
        path
      }
    }
  }
`;
