import { render, screen } from '@testing-library/react';
import { ScentProfile } from '../ScentProfile';
import { ScentMood, Season, ScentIntensity } from '../../../types/scent';

describe('ScentProfile Edge Cases', () => {
  it('handles empty notes arrays', () => {
    const emptyProfile = {
      name: 'Empty Profile',
      description: 'A test profile with empty notes',
      primary_notes: [],
      middle_notes: [],
      base_notes: [],
      intensity: ScentIntensity.LIGHT,
      mood: [ScentMood.RELAXING],
      season: [Season.SPRING],
      longevity: 50
    };

    render(<ScentProfile profile={emptyProfile} />);

    expect(screen.getByText('Primary Notes')).toBeInTheDocument();
    expect(screen.getByText('Middle Notes')).toBeInTheDocument();
    expect(screen.getByText('Base Notes')).toBeInTheDocument();
  });

  it('handles single note in each category', () => {
    const singleNoteProfile = {
      name: 'Single Note Profile',
      description: 'A test profile with single notes',
      primary_notes: [
        { id: '1', name: 'Lavender', intensity: 7, color: '#4CAF50' }
      ],
      middle_notes: [
        { id: '2', name: 'Rose', intensity: 5, color: '#2196F3' }
      ],
      base_notes: [
        { id: '3', name: 'Vanilla', intensity: 8, color: '#9C27B0' }
      ],
      intensity: ScentIntensity.MODERATE,
      mood: [ScentMood.RELAXING],
      season: [Season.SPRING],
      longevity: 60
    };

    render(<ScentProfile profile={singleNoteProfile} />);

    expect(screen.getByText('Lavender')).toBeInTheDocument();
    expect(screen.getByText('Rose')).toBeInTheDocument();
    expect(screen.getByText('Vanilla')).toBeInTheDocument();
  });

  it('handles missing description', () => {
    const noDescriptionProfile = {
      name: 'No Description Profile',
      description: '',
      primary_notes: [
        { id: '1', name: 'Citrus', intensity: 6, color: '#FFA726' }
      ],
      middle_notes: [],
      base_notes: [],
      intensity: ScentIntensity.LIGHT,
      mood: [ScentMood.RELAXING],
      season: [Season.SPRING],
      longevity: 40
    };

    render(<ScentProfile profile={noDescriptionProfile} />);
    expect(screen.getByText('No Description Profile')).toBeInTheDocument();
  });

  it('handles extremely long note names', () => {
    const longNameProfile = {
      name: 'Long Name Profile',
      description: 'A test profile with long note names',
      primary_notes: [{
        id: '1', 
        name: 'Very Long Essential Oil Name That Should Be Truncated In Display',
        intensity: 8,
        color: '#4CAF50'
      }],
      middle_notes: [],
      base_notes: [],
      intensity: ScentIntensity.MODERATE,
      mood: [ScentMood.RELAXING],
      season: [Season.SPRING],
      longevity: 60
    };

    render(<ScentProfile profile={longNameProfile} />);
    
    const noteElement = screen.getByText(longNameProfile.primary_notes[0].name);
    expect(noteElement).toHaveClass('truncate');
  });

  it('handles extreme intensity values', () => {
    const extremeProfile = {
      name: 'Extreme Profile',
      description: 'A test profile with extreme intensity values',
      primary_notes: [
        { id: '1', name: 'Maximum', intensity: 10, color: '#4CAF50' },
        { id: '2', name: 'Minimum', intensity: 1, color: '#FFA726' }
      ],
      middle_notes: [],
      base_notes: [],
      intensity: ScentIntensity.STRONG,
      mood: [ScentMood.RELAXING],
      season: [Season.SPRING],
      longevity: 60
    };

    render(<ScentProfile profile={extremeProfile} />);

    const maxNote = screen.getByText('Maximum');
    const minNote = screen.getByText('Minimum');
    
    expect(maxNote).toHaveAttribute('title', 'Intensity: 10/10');
    expect(minNote).toHaveAttribute('title', 'Intensity: 1/10');
  });

  it('handles duplicate notes across different note types', () => {
    const duplicateProfile = {
      name: 'Duplicate Profile',
      description: 'A test profile with duplicate notes',
      primary_notes: [{ id: '1', name: 'Vanilla', intensity: 8, color: '#4CAF50' }],
      middle_notes: [{ id: '2', name: 'Vanilla', intensity: 5, color: '#2196F3' }],
      base_notes: [{ id: '3', name: 'Vanilla', intensity: 3, color: '#9C27B0' }],
      intensity: ScentIntensity.MODERATE,
      mood: [ScentMood.RELAXING],
      season: [Season.SPRING],
      longevity: 60
    };

    render(<ScentProfile profile={duplicateProfile} />);

    const vanillaNotes = screen.getAllByText('Vanilla');
    expect(vanillaNotes).toHaveLength(3);
    
    // Verify different intensities are displayed correctly
    expect(vanillaNotes[0]).toHaveAttribute('title', 'Intensity: 8/10');
    expect(vanillaNotes[1]).toHaveAttribute('title', 'Intensity: 5/10');
    expect(vanillaNotes[2]).toHaveAttribute('title', 'Intensity: 3/10');
  });

  it('handles special characters in note names', () => {
    const specialCharsProfile = {
      name: 'Special Chars Profile',
      description: 'A test profile with special characters in note names',
      primary_notes: [
        { id: '1', name: 'Ylang-Ylang', intensity: 7, color: '#4CAF50' },
        { id: '2', name: 'Patchouli & Musk', intensity: 6, color: '#FFA726' },
        { id: '3', name: '®Special™ Blend', intensity: 5, color: '#9C27B0' }
      ],
      middle_notes: [],
      base_notes: [],
      intensity: ScentIntensity.MODERATE,
      mood: [ScentMood.RELAXING],
      season: [Season.SPRING],
      longevity: 60
    };

    render(<ScentProfile profile={specialCharsProfile} />);

    specialCharsProfile.primary_notes.forEach(note => {
      expect(screen.getByText(note.name)).toBeInTheDocument();
    });
  });

  it('handles extremely long mood lists', () => {
    const longMoodProfile = {
      name: 'Long Mood Profile',
      description: 'A test profile with extremely long mood lists',
      primary_notes: [{ id: '1', name: 'Vanilla', intensity: 5, color: '#4CAF50' }],
      middle_notes: [],
      base_notes: [],
      intensity: ScentIntensity.MODERATE,
      mood: Array(20).fill(0).map((_, i) => `Mood${i}`),
      season: [Season.SPRING],
      longevity: 60
    };

    render(<ScentProfile profile={longMoodProfile} />);

    // Verify that moods are displayed in a scrollable container
    const moodContainer = screen.getByTestId('mood-container');
    expect(moodContainer).toHaveClass('overflow-x-auto');
  });

  it('handles rapid intensity changes', () => {
    const { rerender } = render(
      <ScentProfile
        profile={{
          name: 'Rapid Intensity Profile',
          description: 'A test profile with rapid intensity changes',
          primary_notes: [{ id: '1', name: 'Test', intensity: 5, color: '#4CAF50' }],
          middle_notes: [],
          base_notes: [],
          intensity: ScentIntensity.LIGHT,
          mood: [ScentMood.RELAXING],
          season: [Season.SPRING],
          longevity: 60
        }}
      />
    );

    // Rapidly change intensity multiple times
    ['MODERATE', 'STRONG', 'LIGHT', 'MODERATE'].forEach(intensity => {
      rerender(
        <ScentProfile
          profile={{
            name: 'Rapid Intensity Profile',
            description: 'A test profile with rapid intensity changes',
            primary_notes: [{ id: '1', name: 'Test', intensity: 5, color: '#4CAF50' }],
            middle_notes: [],
            base_notes: [],
            intensity: intensity as ScentIntensity,
            mood: [ScentMood.RELAXING],
            season: [Season.SPRING],
            longevity: 60
          }}
        />
      );
    });

    // Verify final state is correct
    expect(screen.getByText('MODERATE Intensity')).toBeInTheDocument();
  });

  it('handles missing optional properties', () => {
    const minimalProfile = {
      name: 'Minimal Profile',
      description: '',
      primary_notes: [{ id: '1', name: 'Test', intensity: 5, color: '#4CAF50' }],
      middle_notes: [],
      base_notes: [],
      intensity: ScentIntensity.MODERATE,
      mood: [],
      season: [],
      longevity: 60
    };

    render(<ScentProfile profile={minimalProfile} />);

    expect(screen.queryByTestId('mood-container')).not.toBeInTheDocument();
    expect(screen.queryByTestId('season-container')).not.toBeInTheDocument();
  });
});
