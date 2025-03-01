import React from 'react';
import { render, screen } from '@testing-library/react';
import { ScentProfile } from '../ScentProfile';
import { ScentMood, Season, ScentIntensity } from '../../../types/scent';

const mockScentProfile: ScentProfileType = {
  primary_notes: [
    { id: '1', name: 'Lavender', intensity: 8, color: '#4CAF50' },
    { id: '2', name: 'Bergamot', intensity: 6, color: '#FFA726' }
  ],
  middle_notes: [
    { id: '3', name: 'Rose', intensity: 7, color: '#2196F3' },
    { id: '4', name: 'Jasmine', intensity: 5, color: '#9C27B0' }
  ],
  base_notes: [
    { id: '5', name: 'Vanilla', intensity: 9, color: '#4CAF50' },
    { id: '6', name: 'Musk', intensity: 4, color: '#FFA726' }
  ],
  intensity: ScentIntensity.MODERATE,
  mood: [ScentMood.RELAXING, ScentMood.ROMANTIC],
  season: [Season.SPRING, Season.SUMMER],
  longevity: 75
};

describe('ScentProfile', () => {
  it('renders all scent profile sections', () => {
    render(<ScentProfile profile={mockScentProfile} />);
    
    expect(screen.getByText('Scent Profile')).toBeInTheDocument();
    expect(screen.getByText('Top Notes')).toBeInTheDocument();
    expect(screen.getByText('Middle Notes')).toBeInTheDocument();
    expect(screen.getByText('Base Notes')).toBeInTheDocument();
    expect(screen.getByText('Mood')).toBeInTheDocument();
  });

  it('displays intensity badge correctly', () => {
    render(<ScentProfile profile={mockScentProfile} />);
    
    const intensityBadge = screen.getByText('MODERATE Intensity');
    expect(intensityBadge).toBeInTheDocument();
    expect(intensityBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('renders all primary notes with correct intensity tooltips', () => {
    render(<ScentProfile profile={mockScentProfile} />);
    
    mockScentProfile.primary_notes.forEach(note => {
      const noteElement = screen.getByText(note.name);
      expect(noteElement).toBeInTheDocument();
      expect(noteElement).toHaveAttribute('title', `Intensity: ${note.intensity}/10`);
    });
  });

  it('renders all middle notes', () => {
    render(<ScentProfile profile={mockScentProfile} />);
    
    mockScentProfile.middle_notes.forEach(note => {
      expect(screen.getByText(note.name)).toBeInTheDocument();
    });
  });

  it('renders all base notes', () => {
    render(<ScentProfile profile={mockScentProfile} />);
    
    mockScentProfile.base_notes.forEach(note => {
      expect(screen.getByText(note.name)).toBeInTheDocument();
    });
  });

  it('renders mood tags', () => {
    render(<ScentProfile profile={mockScentProfile} />);
    
    mockScentProfile.mood.forEach(mood => {
      expect(screen.getByText(mood)).toBeInTheDocument();
    });
  });

  it('applies custom className correctly', () => {
    const customClass = 'custom-test-class';
    const { container } = render(
      <ScentProfile profile={mockScentProfile} className={customClass} />
    );
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('renders different intensity badges with correct colors', () => {
    const intensityProfiles: ScentProfileType[] = [
      { ...mockScentProfile, intensity: ScentIntensity.LIGHT },
      { ...mockScentProfile, intensity: ScentIntensity.MODERATE },
      { ...mockScentProfile, intensity: ScentIntensity.STRONG }
    ];

    const { rerender } = render(<ScentProfile profile={intensityProfiles[0]} />);
    expect(screen.getByText('LIGHT Intensity')).toHaveClass('bg-green-100', 'text-green-800');

    rerender(<ScentProfile profile={intensityProfiles[1]} />);
    expect(screen.getByText('MODERATE Intensity')).toHaveClass('bg-yellow-100', 'text-yellow-800');

    rerender(<ScentProfile profile={intensityProfiles[2]} />);
    expect(screen.getByText('STRONG Intensity')).toHaveClass('bg-red-100', 'text-red-800');
  });
});
