import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { WishlistManager } from '../WishlistManager';
import {
  GET_WISHLISTS,
  CREATE_WISHLIST,
  UPDATE_WISHLIST,
  DELETE_WISHLIST,
} from '../../../graphql/wishlist';

const mockWishlists = {
  customer: {
    wishlists: [
      {
        id: 'wishlist1',
        name: 'My Wishlist',
        visibility: 'PRIVATE',
        items_count: 2,
        sharing_code: 'abc123',
      },
      {
        id: 'wishlist2',
        name: 'Gift Ideas',
        visibility: 'PRIVATE',
        items_count: 1,
        sharing_code: 'def456',
      },
    ],
  },
};

const mocks = [
  {
    request: {
      query: GET_WISHLISTS,
    },
    result: {
      data: mockWishlists,
    },
  },
  {
    request: {
      query: CREATE_WISHLIST,
      variables: {
        name: 'New Wishlist',
        visibility: 'PRIVATE',
      },
    },
    result: {
      data: {
        createWishlist: {
          wishlist: {
            id: 'wishlist3',
            name: 'New Wishlist',
            visibility: 'PRIVATE',
            items_count: 0,
            sharing_code: 'xyz789',
          },
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_WISHLIST,
      variables: {
        wishlistId: 'wishlist1',
        name: 'My Wishlist',
        visibility: 'PUBLIC',
      },
    },
    result: {
      data: {
        updateWishlist: {
          wishlist: {
            id: 'wishlist1',
            name: 'My Wishlist',
            visibility: 'PUBLIC',
            items_count: 2,
            sharing_code: 'abc123',
          },
        },
      },
    },
  },
];

describe('WishlistManager', () => {
  const mockOnSelectWishlist = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders wishlist selector with correct options', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <WishlistManager
          selectedWishlistId="wishlist1"
          onSelectWishlist={mockOnSelectWishlist}
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('My Wishlist (2)')).toBeInTheDocument();
      expect(screen.getByText('Gift Ideas (1)')).toBeInTheDocument();
    });
  });

  it('handles wishlist selection', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <WishlistManager
          selectedWishlistId="wishlist1"
          onSelectWishlist={mockOnSelectWishlist}
        />
      </MockedProvider>
    );

    const select = await screen.findByRole('combobox');
    fireEvent.change(select, { target: { value: 'wishlist2' } });

    expect(mockOnSelectWishlist).toHaveBeenCalledWith('wishlist2');
  });

  it('opens create wishlist dialog', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <WishlistManager
          selectedWishlistId="wishlist1"
          onSelectWishlist={mockOnSelectWishlist}
        />
      </MockedProvider>
    );

    const newButton = await screen.findByText('New Wishlist');
    fireEvent.click(newButton);

    expect(screen.getByText('Create New Wishlist')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Wishlist Name')).toBeInTheDocument();
  });

  it('creates new wishlist', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <WishlistManager
          selectedWishlistId="wishlist1"
          onSelectWishlist={mockOnSelectWishlist}
        />
      </MockedProvider>
    );

    // Open create dialog
    const newButton = await screen.findByText('New Wishlist');
    fireEvent.click(newButton);

    // Fill in name
    const input = screen.getByPlaceholderText('Wishlist Name');
    fireEvent.change(input, { target: { value: 'New Wishlist' } });

    // Submit
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.queryByText('Create New Wishlist')).not.toBeInTheDocument();
    });
  });

  it('handles share functionality', async () => {
    const mockNavigator = {
      share: jest.fn().mockResolvedValue(undefined),
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    };
    Object.defineProperty(window, 'navigator', {
      value: mockNavigator,
      writable: true,
    });

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <WishlistManager
          selectedWishlistId="wishlist1"
          onSelectWishlist={mockOnSelectWishlist}
        />
      </MockedProvider>
    );

    const shareButton = await screen.findByText('Share');
    fireEvent.click(shareButton);

    if (navigator.share) {
      expect(mockNavigator.share).toHaveBeenCalled();
    } else {
      expect(mockNavigator.clipboard.writeText).toHaveBeenCalled();
    }
  });

  it('displays analytics data', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <WishlistManager
          selectedWishlistId="wishlist1"
          onSelectWishlist={mockOnSelectWishlist}
        />
      </MockedProvider>
    );

    const analyticsButton = await screen.findByText('Analytics');
    fireEvent.click(analyticsButton);

    await waitFor(() => {
      expect(screen.getByText('Wishlist Analytics')).toBeInTheDocument();
    });
  });
});
