import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { WishlistPage } from '../../../pages/WishlistPage';
import { WishlistProvider } from '../../../store/WishlistContext';
import { CartContext } from '../../../store/CartContext';
import { CommerceProvider } from '../../../store/CommerceContext';
import { GET_SHARED_WISHLIST, GET_WISHLISTS } from '../../../graphql/wishlist';

const mockWishlists = {
  customer: {
    wishlists: [
      {
        id: 'wishlist1',
        name: 'My Wishlist',
        visibility: 'PRIVATE',
        items_count: 2,
        sharing_code: 'abc123',
        items: [
          {
            id: 'item1',
            qty: 1,
            description: 'Love this scent!',
            added_at: '2025-02-11T21:47:10Z',
            product: {
              id: 'prod1',
              sku: 'CANDLE-001',
              name: 'Lavender Dreams Candle',
              url_key: 'lavender-dreams-candle',
              price: {
                regularPrice: {
                  amount: {
                    value: 24.99,
                    currency: 'USD',
                  },
                },
              },
              image: {
                url: 'lavender.jpg',
                label: 'Lavender Dreams Candle',
              },
              stock_status: 'IN_STOCK',
            },
          },
        ],
      },
    ],
  },
};

const mockSharedWishlist = {
  sharedWishlist: {
    id: 'shared1',
    name: "Alice's Gift Ideas",
    visibility: 'PUBLIC',
    items_count: 1,
    sharing_code: 'share123',
    items: [
      {
        id: 'item2',
        qty: 1,
        description: 'Perfect for mom',
        added_at: '2025-02-11T21:47:10Z',
        product: {
          id: 'prod2',
          sku: 'CANDLE-002',
          name: 'Vanilla Bean Candle',
          url_key: 'vanilla-bean-candle',
          price: {
            regularPrice: {
              amount: {
                value: 19.99,
                currency: 'USD',
              },
            },
          },
          image: {
            url: 'vanilla.jpg',
            label: 'Vanilla Bean Candle',
          },
          stock_status: 'IN_STOCK',
        },
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
      query: GET_SHARED_WISHLIST,
      variables: { sharingCode: 'share123' },
    },
    result: {
      data: mockSharedWishlist,
    },
  },
];

const mockAddToCart = jest.fn();

const cartContextValue = {
  addToCart: mockAddToCart,
  cart: {
    items: [],
    prices: {
      subtotal: 0,
      total: 0,
      tax: 0,
      shipping: 0,
      discounts: []
    }
  },
  loading: false,
  error: null,
  removeFromCart: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn()
};

const renderWithProviders = (sharingCode?: string) => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter initialEntries={[sharingCode ? `/wishlist/shared/${sharingCode}` : '/wishlist']}>
        <CartContext.Provider value={cartContextValue}>
          <CommerceProvider value={{ addToCart: mockAddToCart }}>
            <WishlistProvider>
              <Routes>
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/wishlist/shared/:sharingCode" element={<WishlistPage />} />
              </Routes>
            </WishlistProvider>
          </CommerceProvider>
        </CartContext.Provider>
      </MemoryRouter>
    </MockedProvider>
  );
};

describe('WishlistPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders personal wishlist correctly', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('My Wishlist')).toBeInTheDocument();
      expect(screen.getByText('Lavender Dreams Candle')).toBeInTheDocument();
      expect(screen.getByText('Love this scent!')).toBeInTheDocument();
    });
  });

  it('renders shared wishlist correctly', async () => {
    renderWithProviders('share123');

    await waitFor(() => {
      expect(screen.getByText("Alice's Gift Ideas (Shared)")).toBeInTheDocument();
      expect(screen.getByText('Vanilla Bean Candle')).toBeInTheDocument();
      expect(screen.getByText('Perfect for mom')).toBeInTheDocument();
    });
  });

  it('shows empty state when wishlist is empty', async () => {
    const emptyMock = {
      request: {
        query: GET_WISHLISTS,
      },
      result: {
        data: {
          customer: {
            wishlists: [
              {
                id: 'empty1',
                name: 'Empty Wishlist',
                visibility: 'PRIVATE',
                items_count: 0,
                sharing_code: 'empty123',
                items: [],
              },
            ],
          },
        },
      },
    };

    render(
      <MockedProvider mocks={[emptyMock]} addTypename={false}>
        <CartContext.Provider value={cartContextValue}>
          <CommerceProvider value={{ addToCart: mockAddToCart }}>
            <WishlistProvider>
              <WishlistPage />
            </WishlistProvider>
          </CommerceProvider>
        </CartContext.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Your wishlist is empty')).toBeInTheDocument();
      expect(
        screen.getByText('Browse our collection and add your favorite items to your wishlist.')
      ).toBeInTheDocument();
    });
  });

  it('handles add to cart action', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Lavender Dreams Candle')).toBeInTheDocument();
    });

    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);

    expect(mockAddToCart).toHaveBeenCalledWith('CANDLE-001', 1);
  });

  it('shows loading state', () => {
    renderWithProviders();

    expect(screen.getByText('Loading wishlists...')).toBeInTheDocument();
  });

  it('shows error state for invalid sharing code', async () => {
    const errorMock = {
      request: {
        query: GET_SHARED_WISHLIST,
        variables: { sharingCode: 'invalid' },
      },
      error: new Error('Wishlist not found'),
    };

    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <MemoryRouter initialEntries={['/wishlist/shared/invalid']}>
          <CartContext.Provider value={cartContextValue}>
            <CommerceProvider value={{ addToCart: mockAddToCart }}>
              <WishlistProvider>
                <Routes>
                  <Route path="/wishlist/shared/:sharingCode" element={<WishlistPage />} />
                </Routes>
              </WishlistProvider>
            </CommerceProvider>
          </CartContext.Provider>
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Wishlist not found')).toBeInTheDocument();
      expect(
        screen.getByText("The shared wishlist you're looking for doesn't exist or has been removed.")
      ).toBeInTheDocument();
    });
  });
});
