import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import ScentProfile from '../ScentProfile';
import { ScentRecommendations } from '../ScentRecommendations';
import { GET_SIMILAR_SCENTS } from '../../../graphql/scent';

// Mock data
const mockScentProfile = {
  primary_notes: [
    { name: 'Lavender', intensity: 8 },
    { name: 'Bergamot', intensity: 6 }
  ],
  middle_notes: [
    { name: 'Rose', intensity: 7 }
  ],
  base_notes: [
    { name: 'Vanilla', intensity: 9 }
  ],
  intensity: 'MODERATE',
  mood: ['Relaxing'],
  season: ['Spring', 'Summer']
};

const mockRecommendations = [
  {
    id: '1',
    name: 'Lavender Dreams',
    price: { regularPrice: { amount: { value: 29.99, currency: 'USD' } } },
    image: { url: '/images/lavender.jpg', label: 'Lavender Candle' },
    scent_profile: { ...mockScentProfile }
  },
  {
    id: '2',
    name: 'Rose Garden',
    price: { regularPrice: { amount: { value: 24.99, currency: 'USD' } } },
    image: { url: '/images/rose.jpg', label: 'Rose Candle' },
    scent_profile: { ...mockScentProfile, intensity: 'LIGHT' }
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
        similarScents: mockRecommendations
      }
    }
  }
];

describe('Scent Profile Integration', () => {
  const renderComponents = () => {
    return render(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <div data-testid="product-container">
            <ScentProfile profile={mockScentProfile} />
            <ScentRecommendations
              productId="1"
              scentProfile={mockScentProfile}
            />
          </div>
        </MockedProvider>
      </MemoryRouter>
    );
  };

  it('displays scent profile and loads recommendations', async () => {
    renderComponents();

    // Verify scent profile display
    expect(screen.getByText('Scent Profile')).toBeInTheDocument();
    expect(screen.getByText('Lavender')).toBeInTheDocument();
    expect(screen.getByText('MODERATE Intensity')).toBeInTheDocument();

    // Wait for and verify recommendations
    await waitFor(() => {
      expect(screen.getByText('Similar Fragrances You Might Like')).toBeInTheDocument();
    });

    expect(screen.getByText('Lavender Dreams')).toBeInTheDocument();
    expect(screen.getByText('Rose Garden')).toBeInTheDocument();
  });

  it('shows matching notes between profile and recommendations', async () => {
    renderComponents();

    // Wait for recommendations to load
    await waitFor(() => {
      expect(screen.getByText('Similar Fragrances You Might Like')).toBeInTheDocument();
    });

    // Verify that matching notes are highlighted
    const profileNotes = screen.getAllByText('Lavender');
    expect(profileNotes.length).toBeGreaterThan(1); // Should appear in both profile and recommendations
  });

  it('maintains consistent intensity display across components', async () => {
    renderComponents();

    // Check intensity in profile
    expect(screen.getByText('MODERATE Intensity')).toHaveClass('bg-yellow-100');

    // Wait for recommendations
    await waitFor(() => {
      expect(screen.getByText('Similar Fragrances You Might Like')).toBeInTheDocument();
    });

    // Verify intensity classes in recommendations
    const recommendationIntensities = screen.getAllByTestId('intensity-badge');
    expect(recommendationIntensities[0]).toHaveClass('bg-yellow-100'); // MODERATE
    expect(recommendationIntensities[1]).toHaveClass('bg-green-100'); // LIGHT
  });

  it('updates recommendations when scent profile changes', async () => {
    const { rerender } = renderComponents();

    await waitFor(() => {
      expect(screen.getByText('Similar Fragrances You Might Like')).toBeInTheDocument();
    });

    // Update scent profile
    const updatedProfile = {
      ...mockScentProfile,
      intensity: 'STRONG',
      primary_notes: [{ name: 'Patchouli', intensity: 9 }]
    };

    const updatedMocks = [
      {
        request: {
          query: GET_SIMILAR_SCENTS,
          variables: {
            productId: '1',
            scentProfile: updatedProfile
          }
        },
        result: {
          data: {
            similarScents: [
              {
                id: '3',
                name: 'Intense Patchouli',
                price: { regularPrice: { amount: { value: 34.99, currency: 'USD' } } },
                image: { url: '/images/patchouli.jpg', label: 'Patchouli Candle' },
                scent_profile: updatedProfile
              }
            ]
          }
        }
      }
    ];

    rerender(
      <MemoryRouter>
        <MockedProvider mocks={updatedMocks} addTypename={false}>
          <div data-testid="product-container">
            <ScentProfile profile={updatedProfile} />
            <ScentRecommendations
              productId="1"
              scentProfile={updatedProfile}
            />
          </div>
        </MockedProvider>
      </MemoryRouter>
    );

    // Verify profile updates
    expect(screen.getByText('STRONG Intensity')).toBeInTheDocument();
    expect(screen.getByText('Patchouli')).toBeInTheDocument();

    // Wait for and verify updated recommendations
    await waitFor(() => {
      expect(screen.getByText('Intense Patchouli')).toBeInTheDocument();
    });
  });

  it('handles navigation between recommended products', async () => {
    renderComponents();

    await waitFor(() => {
      expect(screen.getByText('Similar Fragrances You Might Like')).toBeInTheDocument();
    });

    // Click on a recommended product
    const recommendedProduct = screen.getByText('Rose Garden');
    fireEvent.click(recommendedProduct);

    // Verify navigation
    expect(window.location.pathname).toBe('/products/2');
  });
});
