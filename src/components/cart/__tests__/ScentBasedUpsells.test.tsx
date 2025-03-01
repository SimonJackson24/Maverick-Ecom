import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ScentBasedUpsells } from '../ScentBasedUpsells';
import { GET_SCENT_BASED_UPSELLS } from '../../../graphql/scent';
import { Product } from '../../../types/commerce';
import { ScentBasedUpsell } from '../../../types/scent';

const mockCartItems: Product[] = [
  {
    id: '1',
    name: 'Lavender Dreams',
    price: { regularPrice: { amount: { value: 29.99, currency: 'USD' } } },
    image: { url: '/images/lavender.jpg', label: 'Lavender Candle' },
    scent_profile: {
      primary_notes: [{ name: 'Lavender', intensity: 8 }],
      middle_notes: [{ name: 'Rose', intensity: 7 }],
      base_notes: [{ name: 'Vanilla', intensity: 9 }],
      intensity: 'MODERATE',
      mood: ['Relaxing'],
      season: ['Spring']
    }
  }
];

const mockUpsells: ScentBasedUpsell[] = [
  {
    product: {
      id: '2',
      name: 'Vanilla Dreams',
      price: { regularPrice: { amount: { value: 24.99, currency: 'USD' } } },
      image: { url: '/images/vanilla.jpg', label: 'Vanilla Candle' }
    },
    pairs_with: [{ id: '1', name: 'Lavender Dreams' }],
    matching_score: 0.85
  }
];

const mocks = [
  {
    request: {
      query: GET_SCENT_BASED_UPSELLS,
      variables: {
        productIds: mockCartItems.map(item => item.id),
        scentProfiles: mockCartItems.map(item => item.scent_profile)
      }
    },
    result: {
      data: {
        scentBasedUpsells: mockUpsells
      }
    }
  }
];

const errorMocks = [
  {
    request: {
      query: GET_SCENT_BASED_UPSELLS,
      variables: {
        productIds: mockCartItems.map(item => item.id),
        scentProfiles: mockCartItems.map(item => item.scent_profile)
      }
    },
    error: new Error('An error occurred')
  }
];

describe('ScentBasedUpsells', () => {
  it('renders loading state correctly', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ScentBasedUpsells cartItems={mockCartItems} />
      </MockedProvider>
    );

    // Should find 3 loading placeholders
    const loadingElements = screen.getAllByTestId('loading-placeholder');
    expect(loadingElements).toHaveLength(3);
  });

  it('renders upsells when data is loaded', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ScentBasedUpsells cartItems={mockCartItems} />
      </MockedProvider>
    );

    // Wait for data to load
    await screen.findByText('Complete Your Fragrance Collection');

    // Check if products and pairing information are rendered
    expect(screen.getByText('Vanilla Dreams')).toBeInTheDocument();
    expect(screen.getByText('Pairs well with: Lavender Dreams')).toBeInTheDocument();
  });

  it('handles error state gracefully', async () => {
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <ScentBasedUpsells cartItems={mockCartItems} />
      </MockedProvider>
    );

    // Wait for error state
    await new Promise(resolve => setTimeout(resolve, 0));

    // Component should render null in error state
    expect(screen.queryByText('Complete Your Fragrance Collection')).not.toBeInTheDocument();
  });

  it('applies custom className correctly', () => {
    const customClass = 'custom-test-class';
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ScentBasedUpsells
          cartItems={mockCartItems}
          className={customClass}
        />
      </MockedProvider>
    );

    const container = screen.getByTestId('upsells-container');
    expect(container).toHaveClass(customClass);
  });

  it('handles empty cart items gracefully', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <ScentBasedUpsells cartItems={[]} />
      </MockedProvider>
    );

    // Component should not make GraphQL query and render nothing
    expect(screen.queryByText('Complete Your Fragrance Collection')).not.toBeInTheDocument();
  });

  it('renders correct number of upsell products', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ScentBasedUpsells cartItems={mockCartItems} />
      </MockedProvider>
    );

    // Wait for data to load
    await screen.findByText('Complete Your Fragrance Collection');

    const productCards = screen.getAllByTestId('product-card');
    expect(productCards).toHaveLength(mockUpsells.length);
  });
});
