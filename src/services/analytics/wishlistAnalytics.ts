import { gql } from '@apollo/client';
import { client } from '../commerce';

interface WishlistEvent {
  eventType: 'add_to_wishlist' | 'remove_from_wishlist' | 'share_wishlist' | 'create_wishlist';
  productSku?: string;
  wishlistId: string;
  wishlistName?: string;
  timestamp: string;
}

const TRACK_WISHLIST_EVENT = gql`
  mutation TrackWishlistEvent(
    $eventType: String!
    $productSku: String
    $wishlistId: String!
    $wishlistName: String
    $timestamp: String!
  ) {
    trackWishlistEvent(
      input: {
        eventType: $eventType
        productSku: $productSku
        wishlistId: $wishlistId
        wishlistName: $wishlistName
        timestamp: $timestamp
      }
    ) {
      success
    }
  }
`;

export const trackWishlistEvent = async (event: WishlistEvent) => {
  try {
    await client.mutate({
      mutation: TRACK_WISHLIST_EVENT,
      variables: event,
    });

    // Also track in Google Analytics if available
    if (window.gtag) {
      window.gtag('event', event.eventType, {
        event_category: 'Wishlist',
        event_label: event.productSku || event.wishlistName,
        wishlist_id: event.wishlistId,
      });
    }
  } catch (error) {
    console.error('Error tracking wishlist event:', error);
  }
};

interface WishlistAction {
  action: 'add_to_wishlist' | 'remove_from_wishlist' | 'share_wishlist' | 'create_wishlist';
  wishlistId: string;
  productId?: string;
}

export const trackWishlistAction = (action: WishlistAction, wishlistId: string, productId?: string): void => {
  if (!wishlistId) return;
  const event: WishlistEvent = {
    eventType: action.action,
    wishlistId,
    productSku: productId,
    timestamp: new Date().toISOString(),
  };

  try {
    client.mutate({
      mutation: TRACK_WISHLIST_EVENT,
      variables: event,
    });

    // Also track in Google Analytics if available
    if (window.gtag) {
      window.gtag('event', event.eventType, {
        event_category: 'Wishlist',
        event_label: event.productSku,
        wishlist_id: event.wishlistId,
      });
    }
  } catch (error) {
    console.error('Error tracking wishlist action:', error);
  }
};

export const getWishlistAnalytics = async (wishlistId: string) => {
  const GET_WISHLIST_ANALYTICS = gql`
    query GetWishlistAnalytics($wishlistId: String!) {
      wishlistAnalytics(wishlistId: $wishlistId) {
        totalItems
        totalValue
        mostAddedProducts {
          sku
          name
          addCount
        }
        shareCount
        conversionRate
        averageTimeToCart
      }
    }
  `;

  try {
    const { data } = await client.query({
      query: GET_WISHLIST_ANALYTICS,
      variables: { wishlistId },
    });
    return data.wishlistAnalytics;
  } catch (error) {
    console.error('Error fetching wishlist analytics:', error);
    return null;
  }
};
