import { gql } from '@apollo/client';

export const CART_FRAGMENT = gql`
  fragment CartFields on Cart {
    id
    items {
      id
      quantity
      product {
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
        }
        image {
          url
          label
        }
      }
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
`;

export const GET_CART = gql`
  query GetCart {
    cart {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($cartId: String!, $sku: String!, $quantity: Float!) {
    addSimpleProductsToCart(
      input: {
        cart_id: $cartId
        cart_items: [{ data: { sku: $sku, quantity: $quantity } }]
      }
    ) {
      cart {
        ...CartFields
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($cartId: String!, $cartItemId: Int!, $quantity: Float!) {
    updateCartItems(
      input: {
        cart_id: $cartId
        cart_items: [{ cart_item_id: $cartItemId, quantity: $quantity }]
      }
    ) {
      cart {
        ...CartFields
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($cartId: String!, $cartItemId: Int!) {
    removeItemFromCart(
      input: { cart_id: $cartId, cart_item_id: $cartItemId }
    ) {
      cart {
        ...CartFields
      }
    }
  }
  ${CART_FRAGMENT}
`;
