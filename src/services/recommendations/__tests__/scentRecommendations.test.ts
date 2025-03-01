import { ScentRecommendationService } from '../scentRecommendations';
import {
  ScentProfile,
  ScentNote,
  CustomerScentPreferences,
  ScentIntensity
} from '../../../types/scent';

describe('ScentRecommendationService', () => {
  let service: ScentRecommendationService;

  beforeEach(() => {
    service = new ScentRecommendationService();
  });

  describe('calculateNoteMatchScore', () => {
    const productNotes: ScentNote[] = [
      { name: 'Lavender', intensity: 8 },
      { name: 'Vanilla', intensity: 6 },
      { name: 'Rose', intensity: 4 }
    ];

    it('calculates higher score for preferred notes', () => {
      const score = service['calculateNoteMatchScore'](
        productNotes,
        ['Lavender', 'Vanilla'],
        []
      );
      expect(score).toBeGreaterThan(50);
    });

    it('calculates lower score for avoided notes', () => {
      const score = service['calculateNoteMatchScore'](
        productNotes,
        [],
        ['Lavender', 'Vanilla']
      );
      expect(score).toBeLessThan(50);
    });

    it('handles empty preferences correctly', () => {
      const score = service['calculateNoteMatchScore'](
        productNotes,
        [],
        []
      );
      expect(score).toBe(50);
    });
  });

  describe('calculateIntensityMatch', () => {
    it('returns 100 for matching intensity', () => {
      const score = service['calculateIntensityMatch'](
        'MODERATE',
        ['MODERATE', 'STRONG']
      );
      expect(score).toBe(100);
    });

    it('returns 0 for non-matching intensity', () => {
      const score = service['calculateIntensityMatch'](
        'LIGHT',
        ['MODERATE', 'STRONG']
      );
      expect(score).toBe(0);
    });
  });

  describe('calculateSeasonalMatch', () => {
    it('calculates correct match percentage for overlapping seasons', () => {
      const score = service['calculateSeasonalMatch'](
        ['Spring', 'Summer'],
        ['Summer', 'Fall']
      );
      expect(score).toBe(33.33333333333333); // 1 match out of 3 unique seasons
    });

    it('returns 100 for exact matches', () => {
      const score = service['calculateSeasonalMatch'](
        ['Spring', 'Summer'],
        ['Spring', 'Summer']
      );
      expect(score).toBe(100);
    });

    it('returns 0 for no matches', () => {
      const score = service['calculateSeasonalMatch'](
        ['Spring', 'Summer'],
        ['Fall', 'Winter']
      );
      expect(score).toBe(0);
    });
  });

  describe('calculateOverallMatchScore', () => {
    const scentProfile: ScentProfile = {
      primary_notes: [{ name: 'Lavender', intensity: 8 }],
      middle_notes: [{ name: 'Rose', intensity: 7 }],
      base_notes: [{ name: 'Vanilla', intensity: 9 }],
      intensity: 'MODERATE' as ScentIntensity,
      mood: ['Relaxing'],
      season: ['Spring', 'Summer']
    };

    const preferences: CustomerScentPreferences = {
      favorite_notes: ['Lavender', 'Vanilla'],
      avoided_notes: ['Patchouli'],
      preferred_intensity: ['MODERATE'],
      seasonal_preferences: ['Spring', 'Summer'],
      mood_preferences: ['Relaxing', 'Energizing']
    };

    it('calculates matching attributes correctly', () => {
      const result = service.calculateOverallMatchScore(scentProfile, preferences);

      expect(result.notes).toContain('Lavender');
      expect(result.notes).toContain('Vanilla');
      expect(result.intensity).toBe(true);
      expect(result.season).toEqual(['Spring', 'Summer']);
      expect(result.mood).toEqual(['Relaxing']);
    });

    it('handles empty preferences correctly', () => {
      const emptyPreferences: CustomerScentPreferences = {
        favorite_notes: [],
        avoided_notes: [],
        preferred_intensity: [],
        seasonal_preferences: [],
        mood_preferences: []
      };

      const result = service.calculateOverallMatchScore(scentProfile, emptyPreferences);

      expect(result.notes).toHaveLength(0);
      expect(result.intensity).toBe(false);
      expect(result.season).toHaveLength(0);
      expect(result.mood).toEqual(['Relaxing']);
    });
  });

  describe('findComplementaryScents', () => {
    const sourceProfile: ScentProfile = {
      primary_notes: [{ name: 'Lavender', intensity: 8 }],
      middle_notes: [{ name: 'Rose', intensity: 7 }],
      base_notes: [{ name: 'Vanilla', intensity: 9 }],
      intensity: 'MODERATE',
      mood: ['Relaxing'],
      season: ['Spring', 'Summer']
    };

    const targetProfiles: ScentProfile[] = [
      {
        primary_notes: [{ name: 'Bergamot', intensity: 6 }],
        middle_notes: [{ name: 'Jasmine', intensity: 5 }],
        base_notes: [{ name: 'Sandalwood', intensity: 7 }],
        intensity: 'MODERATE',
        mood: ['Energizing'],
        season: ['Spring', 'Summer']
      }
    ];

    it('returns recommendations with matching scores', () => {
      const results = service.findComplementaryScents(sourceProfile, targetProfiles);

      expect(results).toHaveLength(targetProfiles.length);
      expect(results[0]).toHaveProperty('matching_score');
      expect(results[0]).toHaveProperty('complementary_notes');
    });

    it('calculates higher scores for complementary scents', () => {
      const complementaryProfile: ScentProfile = {
        ...targetProfiles[0],
        mood: ['Relaxing'],
        season: ['Spring', 'Summer']
      };

      const results = service.findComplementaryScents(sourceProfile, [complementaryProfile]);

      expect(results[0].matching_score).toBeGreaterThan(0.5);
    });
  });
});
