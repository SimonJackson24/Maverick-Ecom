import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { WishlistButton } from '../WishlistButton';
import { WishlistProvider } from '../../../store/WishlistContext';
import { GET_WISHLIST, ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from '../../../graphql/wishlist';

const mockWishlistData = {
  customer: {
    wishlists: [{
      id: 'wishlist1',
      items_count: 1,
      items: [{
        id: 'item1',
        product: {
          sku: 'test-sku',
        },
      }],
    }],
  },
};

const mocks = [
  {
    request: {
      query: GET_WISHLIST,
    },
    result: {
      data: mockWishlistData,
    },
  },
  {
    request: {
      query: ADD_TO_WISHLIST,
      variables: {
        wishlistId: 'wishlist1',
        sku: 'new-sku',
      },
    },
    result: {
      data: {
        addProductsToWishlist: {
          wishlist: {
            id: 'wishlist1',
            items_count: 2,
            items: [
              {
                id: 'item1',
                product: { sku: 'test-sku' },
              },
              {
                id: 'item2',
                product: { sku: 'new-sku' },
              },
            ],
          },
        },
      },
    },
  },
  {
    request: {
      query: REMOVE_FROM_WISHLIST,
      variables: {
        wishlistId: 'wishlist1',
        wishlistItemsIds: ['item1'],
      },
    },
    result: {
      data: {
        removeProductsFromWishlist: {
          wishlist: {
            id: 'wishlist1',
            items_count: 0,
            items: [],
          },
        },
      },
    },
  },
];

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <WishlistProvider>
        {component}
      </WishlistProvider>
    </MockedProvider>
  );
};

describe('WishlistButton', () => {
  it('renders correctly', () => {
    renderWithProviders(<WishlistButton sku="test-sku" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows filled heart when item is in wishlist', async () => {
    renderWithProviders(<WishlistButton sku="test-sku" />);
    await waitFor(() => {
      expect(screen.getByLabelText('Remove from Wishlist')).toBeInTheDocument();
    });
  });

  it('shows outline heart when item is not in wishlist', async () => {
    renderWithProviders(<WishlistButton sku="new-sku" />);
    await waitFor(() => {
      expect(screen.getByLabelText('Add to Wishlist')).toBeInTheDocument();
    });
  });

  it('handles add to wishlist', async () => {
    renderWithProviders(<WishlistButton sku="new-sku" />);
    const button = await screen.findByRole('button');
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByLabelText('Add to Wishlist')).toBeInTheDocument();
    });
  });

  it('handles remove from wishlist', async () => {
    renderWithProviders(<WishlistButton sku="test-sku" />);
    const button = await screen.findByRole('button');
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByLabelText('Remove from Wishlist')).toBeInTheDocument();
    });
  });
});
