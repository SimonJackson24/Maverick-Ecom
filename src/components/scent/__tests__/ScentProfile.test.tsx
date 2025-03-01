import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ScentProfile from '../ScentProfile';
import { useAnalytics } from '../../../hooks/useAnalytics';

// Mock the analytics hook
jest.mock('../../../hooks/useAnalytics', () => ({
  useAnalytics: jest.fn()
}));

const mockAnalytics = {
  track: jest.fn()
};

const mockProfile = {
  primary_notes: [
    { name: 'Lavender', intensity: 8, description: 'Floral' },
    { name: 'Bergamot', intensity: 6, description: 'Citrus' }
  ],
  middle_notes: [
    { name: 'Rose', intensity: 7, description: 'Floral' }
  ],
  base_notes: [
    { name: 'Vanilla', intensity: 9, description: 'Sweet' },
    { name: 'Musk', intensity: 5, description: 'Woody' }
  ],
  intensity: 'MODERATE',
  mood: ['RELAXING', 'ROMANTIC'],
  season: ['SPRING', 'SUMMER']
};

describe('ScentProfile', () => {
  beforeEach(() => {
    (useAnalytics as jest.Mock).mockReturnValue(mockAnalytics);
    mockAnalytics.track.mockClear();
  });

  it('renders all scent notes correctly', () => {
    render(
      <ScentProfile
        profile={mockProfile}
        productId="123"
        productName="Test Candle"
      />
    );

    // Check for all notes
    expect(screen.getByText('Lavender')).toBeInTheDocument();
    expect(screen.getByText('Bergamot')).toBeInTheDocument();
    expect(screen.getByText('Rose')).toBeInTheDocument();
    expect(screen.getByText('Vanilla')).toBeInTheDocument();
    expect(screen.getByText('Musk')).toBeInTheDocument();
  });

  it('displays intensity correctly', () => {
    render(
      <ScentProfile
        profile={mockProfile}
        productId="123"
        productName="Test Candle"
      />
    );

    expect(screen.getByText('MODERATE')).toBeInTheDocument();
  });

  it('shows mood and season tags', () => {
    render(
      <ScentProfile
        profile={mockProfile}
        productId="123"
        productName="Test Candle"
      />
    );

    expect(screen.getByText('RELAXING')).toBeInTheDocument();
    expect(screen.getByText('ROMANTIC')).toBeInTheDocument();
    expect(screen.getByText('SPRING')).toBeInTheDocument();
    expect(screen.getByText('SUMMER')).toBeInTheDocument();
  });

  it('tracks note hover events', () => {
    render(
      <ScentProfile
        profile={mockProfile}
        productId="123"
        productName="Test Candle"
      />
    );

    // Hover over a note
    fireEvent.mouseEnter(screen.getByText('Lavender'));

    expect(mockAnalytics.track).toHaveBeenCalledWith('scent_note_hover', {
      product_id: '123',
      product_name: 'Test Candle',
      note_name: 'Lavender',
      note_intensity: 8,
      note_type: 'Floral'
    });
  });

  it('applies correct opacity based on note intensity', () => {
    render(
      <ScentProfile
        profile={mockProfile}
        productId="123"
        productName="Test Candle"
      />
    );

    const lavenderNote = screen.getByText('Lavender').closest('span');
    const muskNote = screen.getByText('Musk').closest('span');

    expect(lavenderNote).toHaveStyle({ opacity: '0.9' }); // 0.5 + (8/20)
    expect(muskNote).toHaveStyle({ opacity: '0.75' }); // 0.5 + (5/20)
  });
});
