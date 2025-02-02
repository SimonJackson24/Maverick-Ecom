import { gql } from '@apollo/client';

export const GENERATE_CUSTOMER_TOKEN = gql`
  mutation GenerateCustomerToken($email: String!, $password: String!) {
    generateCustomerToken(email: $email, password: $password) {
      token
    }
  }
`;

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer(
    $firstname: String!
    $lastname: String!
    $email: String!
    $password: String!
  ) {
    createCustomer(
      input: {
        firstname: $firstname
        lastname: $lastname
        email: $email
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
      orders(pageSize: 10) {
        items {
          id
          number
          order_date
          status
          total {
            grand_total {
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
            telephone
          }
          items {
            product_name
            product_sku
            quantity_ordered
            product_sale_price {
              value
              currency
            }
          }
        }
      }
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer(
    $firstname: String
    $lastname: String
    $email: String
    $password: String
    $currentPassword: String
  ) {
    updateCustomer(
      input: {
        firstname: $firstname
        lastname: $lastname
        email: $email
        password: $password
        currentPassword: $currentPassword
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

export const CREATE_CUSTOMER_ADDRESS = gql`
  mutation CreateCustomerAddress($input: CustomerAddressInput!) {
    createCustomerAddress(input: $input) {
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
`;

export const UPDATE_CUSTOMER_ADDRESS = gql`
  mutation UpdateCustomerAddress($id: Int!, $input: CustomerAddressInput!) {
    updateCustomerAddress(id: $id, input: $input) {
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
`;

export const DELETE_CUSTOMER_ADDRESS = gql`
  mutation DeleteCustomerAddress($id: Int!) {
    deleteCustomerAddress(id: $id)
  }
`;

export const REVOKE_CUSTOMER_TOKEN = gql`
  mutation RevokeCustomerToken {
    revokeCustomerToken {
      result
    }
  }
`;
