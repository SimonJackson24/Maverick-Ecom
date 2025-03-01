import { gql } from '@apollo/client';

export const SET_GUEST_EMAIL = gql`
  mutation SetGuestEmailOnCart($cartId: String!, $email: String!) {
    setGuestEmailOnCart(input: {
      cart_id: $cartId
      email: $email
    }) {
      cart {
        id
        email
      }
    }
  }
`;

export const SET_SHIPPING_ADDRESS = gql`
  mutation SetShippingAddressOnCart(
    $cartId: String!
    $firstname: String!
    $lastname: String!
    $street: [String!]!
    $city: String!
    $region: String!
    $postcode: String!
    $countryCode: String!
    $telephone: String!
  ) {
    setShippingAddressOnCart(
      input: {
        cart_id: $cartId
        shipping_address: {
          address: {
            firstname: $firstname
            lastname: $lastname
            street: $street
            city: $city
            region: $region
            postcode: $postcode
            country_code: $countryCode
            telephone: $telephone
            save_in_address_book: false
          }
        }
      }
    ) {
      cart {
        id
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
          country {
            code
            label
          }
          telephone
          available_shipping_methods {
            carrier_code
            carrier_title
            method_code
            method_title
            amount {
              value
              currency
            }
          }
          selected_shipping_method {
            carrier_code
            method_code
            carrier_title
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

export const SET_SHIPPING_METHOD = gql`
  mutation SetShippingMethodOnCart(
    $cartId: String!
    $carrierCode: String!
    $methodCode: String!
  ) {
    setShippingMethodOnCart(
      input: {
        cart_id: $cartId
        shipping_method: {
          carrier_code: $carrierCode
          method_code: $methodCode
        }
      }
    ) {
      cart {
        id
        shipping_addresses {
          selected_shipping_method {
            carrier_code
            method_code
            carrier_title
            method_title
            amount {
              value
              currency
            }
          }
        }
        prices {
          grand_total {
            value
            currency
          }
        }
      }
    }
  }
`;

export const SET_PAYMENT_METHOD = gql`
  mutation SetPaymentMethodOnCart($cartId: String!, $code: String!) {
    setPaymentMethodOnCart(
      input: {
        cart_id: $cartId
        payment_method: {
          code: $code
        }
      }
    ) {
      cart {
        id
        selected_payment_method {
          code
          title
        }
      }
    }
  }
`;

export const PLACE_ORDER = gql`
  mutation PlaceOrder($cartId: String!) {
    placeOrder(
      input: {
        cart_id: $cartId
      }
    ) {
      order {
        order_number
      }
    }
  }
`;

export const GET_AVAILABLE_PAYMENT_METHODS = gql`
  query GetAvailablePaymentMethods($cartId: String!) {
    cart(cart_id: $cartId) {
      available_payment_methods {
        code
        title
      }
    }
  }
`;

export const GET_CART_TOTALS = gql`
  query GetCartTotals($cartId: String!) {
    cart(cart_id: $cartId) {
      prices {
        subtotal_excluding_tax {
          value
          currency
        }
        subtotal_including_tax {
          value
          currency
        }
        applied_taxes {
          amount {
            value
            currency
          }
          label
        }
        grand_total {
          value
          currency
        }
      }
      shipping_addresses {
        selected_shipping_method {
          amount {
            value
            currency
          }
        }
      }
    }
  }
`;
