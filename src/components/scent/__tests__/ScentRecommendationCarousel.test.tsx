import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ScentRecommendationCarousel } from '../ScentRecommendationCarousel';
import { GET_SIMILAR_SCENTS } from '../../../graphql/scent';
import { useAnalytics } from '../../../hooks/useAnalytics';

// Mock the analytics hook
jest.mock('../../../hooks/useAnalytics', () => ({
  useAnalytics: jest.fn()
}));

const mockAnalytics = {
  track: jest.fn()
};

const mockSimilarScents = {
  product: {
    id: '123',
    sku: 'CANDLE-123',
    similar_products: {
      items: [
        {
          id: '456',
          sku: 'CANDLE-456',
          name: 'Lavender Dreams',
          url_key: 'lavender-dreams',
          price_range: {
            minimum_price: {
              regular_price: {
                value: 24.99,
                currency: 'USD'
              }
            }
          },
          thumbnail: {
            url: 'lavender.jpg',
            label: 'Lavender Dreams Candle'
          },
          scent_profile: {
            primary_notes: [{ name: 'Lavender', intensity: 8 }],
            middle_notes: [{ name: 'Vanilla', intensity: 6 }],
            base_notes: [{ name: 'Musk', intensity: 5 }],
            intensity: 'MODERATE',
            mood: ['RELAXING'],
            season: ['SPRING']
          },
          match_score: 85
        }
      ]
    }
  }
};

const mocks = [
  {
    request: {
      query: GET_SIMILAR_SCENTS,
      variables: { sku: 'CANDLE-123' }
    },
    result: {
      data: mockSimilarScents
    }
  }
];

describe('ScentRecommendationCarousel', () => {
  beforeEach(() => {
    (useAnalytics as jest.Mock).mockReturnValue(mockAnalytics);
    mockAnalytics.track.mockClear();
  });

  it('renders loading state initially', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ScentRecommendationCarousel
          productSku="CANDLE-123"
          productName="Original Candle"
        />
      </MockedProvider>
    );

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('renders similar products after loading', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ScentRecommendationCarousel
          productSku="CANDLE-123"
          productName="Original Candle"
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Lavender Dreams')).toBeInTheDocument();
      expect(screen.getByText('$24.99')).toBeInTheDocument();
    });
  });

  it('tracks scroll events', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ScentRecommendationCarousel
          productSku="CANDLE-123"
          productName="Original Candle"
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Scroll right')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Scroll right'));

    expect(mockAnalytics.track).toHaveBeenCalledWith('scent_recommendations_scroll', {
      product_sku: 'CANDLE-123',
      product_name: 'Original Candle',
      scroll_direction: 'right'
    });
  });

  it('tracks product clicks', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ScentRecommendationCarousel
          productSku="CANDLE-123"
          productName="Original Candle"
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Lavender Dreams')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Lavender Dreams'));

    expect(mockAnalytics.track).toHaveBeenCalledWith('scent_recommendation_click', {
      source_product_sku: 'CANDLE-123',
      source_product_name: 'Original Candle',
      recommended_product_sku: 'CANDLE-456',
      recommended_product_name: 'Lavender Dreams',
      match_score: 85
    });
  });

  it('handles empty recommendations gracefully', async () => {
    const emptyMocks = [
      {
        request: {
          query: GET_SIMILAR_SCENTS,
          variables: { sku: 'CANDLE-123' }
        },
        result: {
          data: {
            product: {
              id: '123',
              sku: 'CANDLE-123',
              similar_products: {
                items: []
              }
            }
          }
        }
      }
    ];

    render(
      <MockedProvider mocks={emptyMocks} addTypename={false}>
        <ScentRecommendationCarousel
          productSku="CANDLE-123"
          productName="Original Candle"
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('You May Also Like')).not.toBeInTheDocument();
    });
  });
});
