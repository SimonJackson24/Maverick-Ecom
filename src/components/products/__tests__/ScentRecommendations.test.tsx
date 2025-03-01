import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ScentRecommendations } from '../ScentRecommendations';
import { GET_SIMILAR_SCENTS } from '../../../graphql/scent';
import { Product } from '../../../types/commerce';
import { ScentProfile } from '../../../types/scent';

const mockScentProfile: ScentProfile = {
  primary_notes: [{ name: 'Lavender', intensity: 8 }],
  middle_notes: [{ name: 'Rose', intensity: 7 }],
  base_notes: [{ name: 'Vanilla', intensity: 9 }],
  intensity: 'MODERATE',
  mood: ['Relaxing'],
  season: ['Spring']
};

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Lavender Dreams',
    price: { regularPrice: { amount: { value: 29.99, currency: 'USD' } } },
    image: { url: '/images/lavender.jpg', label: 'Lavender Candle' },
    scent_profile: mockScentProfile
  },
  {
    id: '2',
    name: 'Rose Garden',
    price: { regularPrice: { amount: { value: 24.99, currency: 'USD' } } },
    image: { url: '/images/rose.jpg', label: 'Rose Candle' },
    scent_profile: mockScentProfile
  }
];

const mocks = [
  {
    request: {
      query: GET_SIMILAR_SCENTS,
      variables: {
        productId: '1',
        scentProfile: mockScentProfile
      }
    },
    result: {
      data: {
        similarScents: mockProducts
      }
    }
  }
];

const errorMocks = [
  {
    request: {
      query: GET_SIMILAR_SCENTS,
      variables: {
        productId: '1',
        scentProfile: mockScentProfile
      }
    },
    error: new Error('An error occurred')
  }
];

describe('ScentRecommendations', () => {
  it('renders loading state correctly', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ScentRecommendations
          productId="1"
          scentProfile={mockScentProfile}
        />
      </MockedProvider>
    );

    // Should find 4 loading placeholders
    const loadingElements = screen.getAllByTestId('loading-placeholder');
    expect(loadingElements).toHaveLength(4);
  });

  it('renders recommendations when data is loaded', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ScentRecommendations
          productId="1"
          scentProfile={mockScentProfile}
        />
      </MockedProvider>
    );

    // Wait for data to load
    await screen.findByText('Similar Fragrances You Might Like');

    // Check if products are rendered
    expect(screen.getByText('Lavender Dreams')).toBeInTheDocument();
    expect(screen.getByText('Rose Garden')).toBeInTheDocument();
  });

  it('handles error state gracefully', async () => {
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <ScentRecommendations
          productId="1"
          scentProfile={mockScentProfile}
        />
      </MockedProvider>
    );

    // Wait for error state
    await new Promise(resolve => setTimeout(resolve, 0));

    // Component should render null in error state
    expect(screen.queryByText('Similar Fragrances You Might Like')).not.toBeInTheDocument();
  });

  it('applies custom className correctly', () => {
    const customClass = 'custom-test-class';
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ScentRecommendations
          productId="1"
          scentProfile={mockScentProfile}
          className={customClass}
        />
      </MockedProvider>
    );

    const container = screen.getByTestId('recommendations-container');
    expect(container).toHaveClass(customClass);
  });

  it('renders correct number of product cards', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ScentRecommendations
          productId="1"
          scentProfile={mockScentProfile}
        />
      </MockedProvider>
    );

    // Wait for data to load
    await screen.findByText('Similar Fragrances You Might Like');

    const productCards = screen.getAllByTestId('product-card');
    expect(productCards).toHaveLength(mockProducts.length);
  });
});
