import { gql } from '@apollo/client';

export const SET_SHIPPING_ADDRESS = gql`
  mutation SetShippingAddress($input: SetShippingAddressInput!) {
    setShippingAddressOnCart(input: $input) {
      cart {
        shipping_addresses {
          firstname
          lastname
          street
          city
          region {
            code
            label
          }
          postcode
          telephone
          country {
            code
            label
          }
        }
      }
    }
  }
`;

export const SET_BILLING_ADDRESS = gql`
  mutation SetBillingAddress($input: SetBillingAddressInput!) {
    setBillingAddressOnCart(input: $input) {
      cart {
        billing_address {
          firstname
          lastname
          street
          city
          region {
            code
            label
          }
          postcode
          telephone
          country {
            code
            label
          }
        }
      }
    }
  }
`;

export const SET_SHIPPING_METHOD = gql`
  mutation SetShippingMethod($input: SetShippingMethodsOnCartInput!) {
    setShippingMethodsOnCart(input: $input) {
      cart {
        shipping_addresses {
          selected_shipping_method {
            carrier_code
            carrier_title
            method_code
            method_title
            amount {
              value
              currency
            }
          }
        }
      }
    }
  }
`;

export const SET_PAYMENT_METHOD = gql`
  mutation SetPaymentMethod($input: SetPaymentMethodOnCartInput!) {
    setPaymentMethodOnCart(input: $input) {
      cart {
        selected_payment_method {
          code
          title
        }
      }
    }
  }
`;

export const PLACE_ORDER = gql`
  mutation PlaceOrder($input: PlaceOrderInput!) {
    placeOrder(input: $input) {
      order {
        order_number
        order_id
      }
    }
  }
`;
