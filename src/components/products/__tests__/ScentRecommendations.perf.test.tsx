import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ScentRecommendations } from '../ScentRecommendations';
import { GET_SIMILAR_SCENTS } from '../../../graphql/scent';
import { generateLargeProductList, measureRenderTime, measureMemoryUsage } from '../../../utils/testing';

const SAMPLE_SIZES = [10, 50, 100, 500];

describe('ScentRecommendations Performance', () => {
  // Generate test data once for all tests
  const mockProducts = generateLargeProductList(Math.max(...SAMPLE_SIZES));
  const mockScentProfile = {
    primary_notes: [{ name: 'Lavender', intensity: 8 }],
    middle_notes: [{ name: 'Rose', intensity: 7 }],
    base_notes: [{ name: 'Vanilla', intensity: 9 }],
    intensity: 'MODERATE',
    mood: ['Relaxing'],
    season: ['Spring']
  };

  // Test render performance with different dataset sizes
  SAMPLE_SIZES.forEach(size => {
    it(`renders ${size} recommendations within performance budget`, async () => {
      const products = mockProducts.slice(0, size);
      const mocks = [{
        request: {
          query: GET_SIMILAR_SCENTS,
          variables: { productId: '1', scentProfile: mockScentProfile }
        },
        result: { data: { similarScents: products } }
      }];

      const renderTime = await measureRenderTime(() => {
        render(
          <MockedProvider mocks={mocks} addTypename={false}>
            <ScentRecommendations
              productId="1"
              scentProfile={mockScentProfile}
            />
          </MockedProvider>
        );
      });

      // Performance budgets
      const maxRenderTime = size <= 50 ? 100 : 200; // ms
      expect(renderTime).toBeLessThan(maxRenderTime);
    });
  });

  // Test memory usage
  it('maintains stable memory usage with large datasets', async () => {
    const mocks = [{
      request: {
        query: GET_SIMILAR_SCENTS,
        variables: { productId: '1', scentProfile: mockScentProfile }
      },
      result: { data: { similarScents: mockProducts } }
    }];

    const memoryBefore = await measureMemoryUsage();
    
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ScentRecommendations
          productId="1"
          scentProfile={mockScentProfile}
        />
      </MockedProvider>
    );

    const memoryAfter = await measureMemoryUsage();
    const memoryDiff = memoryAfter - memoryBefore;

    // Memory budget: 50MB for largest dataset
    expect(memoryDiff).toBeLessThan(50 * 1024 * 1024);
  });

  // Test recommendation calculation performance
  it('calculates recommendations within time budget', async () => {
    const startTime = performance.now();
    
    const mocks = [{
      request: {
        query: GET_SIMILAR_SCENTS,
        variables: { productId: '1', scentProfile: mockScentProfile }
      },
      result: { data: { similarScents: mockProducts } }
    }];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ScentRecommendations
          productId="1"
          scentProfile={mockScentProfile}
        />
      </MockedProvider>
    );

    const endTime = performance.now();
    const calculationTime = endTime - startTime;

    // Performance budget: 300ms for recommendation calculation
    expect(calculationTime).toBeLessThan(300);
  });

  // Test lazy loading implementation
  it('implements efficient lazy loading', async () => {
    const intersectionObserverMock = jest.fn();
    window.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: intersectionObserverMock,
      disconnect: jest.fn()
    }));

    const mocks = [{
      request: {
        query: GET_SIMILAR_SCENTS,
        variables: { productId: '1', scentProfile: mockScentProfile }
      },
      result: { data: { similarScents: mockProducts } }
    }];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ScentRecommendations
          productId="1"
          scentProfile={mockScentProfile}
        />
      </MockedProvider>
    );

    expect(intersectionObserverMock).toHaveBeenCalled();
  });

  // Test bundle size
  it('maintains acceptable bundle size', async () => {
    const stats = await import('../../../.next/stats.json');
    const componentSize = stats.assets.find(
      asset => asset.name.includes('ScentRecommendations')
    ).size;

    // Bundle size budget: 50KB
    expect(componentSize).toBeLessThan(50 * 1024);
  });
});
