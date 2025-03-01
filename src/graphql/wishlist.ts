import { gql } from '@apollo/client';

export const WISHLIST_FRAGMENT = gql`
  fragment WishlistFields on Wishlist {
    id
    name
    visibility
    items_count
    sharing_code
    updated_at
    items {
      id
      qty
      description
      added_at
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
        stock_status
      }
    }
  }
`;

export const GET_WISHLISTS = gql`
  query GetWishlists {
    customer {
      wishlists {
        ...WishlistFields
      }
    }
  }
  ${WISHLIST_FRAGMENT}
`;

export const GET_SHARED_WISHLIST = gql`
  query GetSharedWishlist($sharingCode: String!) {
    sharedWishlist(sharingCode: $sharingCode) {
      ...WishlistFields
    }
  }
  ${WISHLIST_FRAGMENT}
`;

export const CREATE_WISHLIST = gql`
  mutation CreateWishlist($name: String!, $visibility: WishlistVisibilityEnum!) {
    createWishlist(
      input: {
        name: $name
        visibility: $visibility
      }
    ) {
      wishlist {
        ...WishlistFields
      }
    }
  }
  ${WISHLIST_FRAGMENT}
`;

export const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist($wishlistId: ID!, $sku: String!, $quantity: Float = 1) {
    addProductsToWishlist(
      wishlistId: $wishlistId
      wishlistItems: [
        {
          sku: $sku
          quantity: $quantity
        }
      ]
    ) {
      wishlist {
        ...WishlistFields
      }
      user_errors {
        code
        message
      }
    }
  }
  ${WISHLIST_FRAGMENT}
`;

export const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist($wishlistId: ID!, $wishlistItemsIds: [ID!]!) {
    removeProductsFromWishlist(
      wishlistId: $wishlistId
      wishlistItemsIds: $wishlistItemsIds
    ) {
      wishlist {
        ...WishlistFields
      }
      user_errors {
        code
        message
      }
    }
  }
  ${WISHLIST_FRAGMENT}
`;

export const UPDATE_WISHLIST = gql`
  mutation UpdateWishlist($wishlistId: ID!, $name: String!, $visibility: WishlistVisibilityEnum!) {
    updateWishlist(
      wishlistId: $wishlistId
      input: {
        name: $name
        visibility: $visibility
      }
    ) {
      wishlist {
        ...WishlistFields
      }
    }
  }
  ${WISHLIST_FRAGMENT}
`;

export const COPY_WISHLIST = gql`
  mutation CopyWishlist($sourceWishlistId: ID!, $name: String!) {
    copyWishlist(
      input: {
        sourceWishlistId: $sourceWishlistId
        name: $name
      }
    ) {
      wishlist {
        ...WishlistFields
      }
    }
  }
  ${WISHLIST_FRAGMENT}
`;

export const DELETE_WISHLIST = gql`
  mutation DeleteWishlist($wishlistId: ID!) {
    deleteWishlist(wishlistId: $wishlistId) {
      status
      message
    }
  }
`;
