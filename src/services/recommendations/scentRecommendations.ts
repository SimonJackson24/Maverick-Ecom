import { useQuery, useMutation } from '@apollo/client';
import {
  GET_PRODUCT_SCENT_PROFILE,
  GET_SIMILAR_SCENTS,
  GET_SCENT_CATEGORIES,
  UPDATE_CUSTOMER_SCENT_PREFERENCES,
} from '../../graphql/scent';
import type {
  ScentProfile,
  ScentCategory,
  CustomerScentPreferences,
  ScentRecommendation,
  ScentBasedUpsell,
  ScentNote,
  ScentMood,
  Season,
  ScentIntensity,
  Product,
} from '../../types/scent';

const MOOD_COMPLEMENTARY_NOTES = {
  RELAXING: ['lavender', 'vanilla', 'chamomile'],
  ENERGIZING: ['citrus', 'mint', 'eucalyptus'],
  ROMANTIC: ['rose', 'jasmine', 'ylang-ylang'],
  FRESH: ['lemon', 'bergamot', 'pine'],
  COZY: ['cinnamon', 'vanilla', 'nutmeg'],
  EXOTIC: ['sandalwood', 'patchouli', 'frankincense']
} as const;

const SEASONAL_COMPLEMENTARY_NOTES = {
  SPRING: ['floral', 'green', 'fresh'],
  SUMMER: ['citrus', 'marine', 'light'],
  FALL: ['spice', 'wood', 'amber'],
  WINTER: ['pine', 'mint', 'warm']
} as const;

const INTENSITY_SCORES = {
  LIGHT: 1,
  MODERATE: 2,
  STRONG: 3
} as const;

const NOTE_PAIRINGS = {
  vanilla: ['cinnamon', 'chocolate', 'caramel'],
  lavender: ['bergamot', 'chamomile', 'ylang-ylang'],
  rose: ['jasmine', 'peony', 'lily']
} as const;

export class ScentRecommendationService {
  private calculateNoteMatchScore(
    productNotes: ScentNote[],
    preferredNotes: string[],
    avoidedNotes: string[]
  ): number {
    let score = 0;
    const totalNotes = productNotes.length;

    productNotes.forEach(note => {
      if (preferredNotes.includes(note.name)) {
        score += (note.intensity / 10) * 2; // Preferred notes count double
      } else if (avoidedNotes.includes(note.name)) {
        score -= note.intensity / 10;
      } else {
        score += note.intensity / 20; // Neutral notes count half
      }
    });

    return (score / totalNotes) * 100;
  }

  private calculateIntensityMatch(
    productIntensity: ScentIntensity,
    preferredIntensities: ScentIntensity[]
  ): number {
    return preferredIntensities.includes(productIntensity) ? 100 : 0;
  }

  private calculateSeasonalMatch(
    productSeasons: Season[],
    preferredSeasons: Season[]
  ): number {
    const matches = productSeasons.filter(season => 
      preferredSeasons.includes(season)
    ).length;
    return (matches / Math.max(productSeasons.length, preferredSeasons.length)) * 100;
  }

  public calculateOverallMatchScore(
    scentProfile: ScentProfile,
    preferences: CustomerScentPreferences
  ): ScentRecommendation['matching_attributes'] {
    const allNotes = [
      ...scentProfile.primary_notes,
      ...scentProfile.middle_notes,
      ...scentProfile.base_notes,
    ];

    const noteScore = this.calculateNoteMatchScore(
      allNotes,
      preferences.favorite_notes,
      preferences.avoided_notes
    );

    const intensityMatch = this.calculateIntensityMatch(
      scentProfile.intensity,
      preferences.preferred_intensity
    );

    const seasonalMatch = this.calculateSeasonalMatch(
      scentProfile.season,
      preferences.seasonal_preferences
    );

    const matchingNotes = allNotes
      .filter(note => preferences.favorite_notes.includes(note.name))
      .map(note => note.name);

    return {
      notes: matchingNotes,
      intensity: intensityMatch > 50,
      mood: scentProfile.mood,
      season: scentProfile.season.filter(s => 
        preferences.seasonal_preferences.includes(s)
      ),
    };
  }

  public findComplementaryScents(
    sourceProfile: ScentProfile,
    targetProfiles: ScentProfile[]
  ): ScentBasedUpsell['recommended_products'] {
    return targetProfiles.map(profile => {
      // Calculate how well scents complement each other
      const complementaryScore = this.calculateComplementaryScore(
        sourceProfile,
        profile
      );

      // Determine the reason for the match
      const matchReason = this.determineMatchReason(
        sourceProfile,
        profile,
        complementaryScore
      );

      return {
        product: {
          id: '', // This will be filled by the caller
          sku: '', // This will be filled by the caller
          name: '', // This will be filled by the caller
          scent_profile: profile,
        },
        match_reason: matchReason,
        complementary_score: complementaryScore,
      };
    });
  }

  private calculateComplementaryScore(
    source: ScentProfile,
    target: ScentProfile
  ): number {
    let score = 0;

    // Check for complementary moods
    score += this.calculateMoodComplementScore(source.mood, target.mood);

    // Check for seasonal alignment
    score += this.calculateSeasonalComplementScore(source.season, target.season);

    // Check for intensity balance
    score += this.calculateIntensityComplementScore(
      source.intensity,
      target.intensity
    );

    // Check for note harmony
    score += this.calculateNoteHarmonyScore(
      [...source.primary_notes, ...source.middle_notes, ...source.base_notes],
      [...target.primary_notes, ...target.middle_notes, ...target.base_notes]
    );

    return Math.min(100, score);
  }

  private calculateMoodComplementScore(
    sourceMoods: ScentMood[],
    targetMoods: ScentMood[]
  ): number {
    const complementaryPairs = {
      RELAXING: ['ENERGIZING'],
      ENERGIZING: ['RELAXING'],
      ROMANTIC: ['FRESH'],
      FRESH: ['COZY'],
      COZY: ['EXOTIC'],
      EXOTIC: ['FRESH'],
    };

    let score = 0;
    sourceMoods.forEach(sourceMood => {
      if (complementaryPairs[sourceMood]?.some(comp => 
        targetMoods.includes(comp)
      )) {
        score += 25;
      }
    });

    return score;
  }

  private calculateSeasonalComplementScore(
    sourceSeasons: Season[],
    targetSeasons: Season[]
  ): number {
    const adjacentSeasons = {
      SPRING: ['SUMMER'],
      SUMMER: ['FALL'],
      FALL: ['WINTER'],
      WINTER: ['SPRING'],
    };

    let score = 0;
    sourceSeasons.forEach(sourceSeason => {
      if (adjacentSeasons[sourceSeason]?.some(adj => 
        targetSeasons.includes(adj)
      )) {
        score += 20;
      }
    });

    return score;
  }

  private calculateIntensityComplementScore(
    sourceIntensity: ScentIntensity,
    targetIntensity: ScentIntensity
  ): number {
    const intensityValues = {
      LIGHT: 1,
      MODERATE: 2,
      STRONG: 3,
    };

    const diff = Math.abs(
      intensityValues[sourceIntensity] - intensityValues[targetIntensity]
    );
    return diff === 1 ? 30 : diff === 0 ? 20 : 10;
  }

  private calculateNoteHarmonyScore(
    sourceNotes: ScentNote[],
    targetNotes: ScentNote[]
  ): number {
    const harmonicPairs = {
      'vanilla': ['cinnamon', 'chocolate', 'coffee'],
      'lavender': ['bergamot', 'lemon', 'sage'],
      'rose': ['jasmine', 'lily', 'peony'],
      // Add more harmonic pairs as needed
    };

    let score = 0;
    sourceNotes.forEach(sourceNote => {
      if (harmonicPairs[sourceNote.name]) {
        targetNotes.forEach(targetNote => {
          if (harmonicPairs[sourceNote.name].includes(targetNote.name)) {
            score += 5;
          }
        });
      }
    });

    return Math.min(25, score);
  }

  private determineMatchReason(
    source: ScentProfile,
    target: ScentProfile,
    score: number
  ): string {
    if (score >= 90) {
      return 'Perfect complement to your selection';
    } else if (score >= 70) {
      return 'Creates a harmonious blend';
    } else if (score >= 50) {
      return 'Adds an interesting contrast';
    } else {
      return 'Provides a different experience';
    }
  }

  public calculateScentCompatibility(
    source: ScentProfile,
    target: ScentProfile
  ): number {
    let score = 0;
    const weights = {
      notes: 0.4,
      intensity: 0.2,
      mood: 0.2,
      season: 0.2
    };

    // Calculate note compatibility
    const sourceNotes = [
      ...source.primary_notes,
      ...source.middle_notes,
      ...source.base_notes
    ];
    const targetNotes = [
      ...target.primary_notes,
      ...target.middle_notes,
      ...target.base_notes
    ];

    const noteScore = sourceNotes.reduce((acc, note) => {
      if (targetNotes.some(n => n.name === note.name)) {
        return acc + 1;
      }
      return acc;
    }, 0) / sourceNotes.length;

    // Calculate intensity compatibility
    const intensityScore = 1 - Math.abs(
      INTENSITY_SCORES[source.intensity] - INTENSITY_SCORES[target.intensity]
    ) / 2;

    // Calculate mood compatibility
    const moodScore = source.mood.reduce((acc, mood) => {
      if (target.mood.includes(mood)) {
        return acc + 1;
      }
      return acc;
    }, 0) / source.mood.length;

    // Calculate seasonal compatibility
    const seasonalScore = source.season.reduce((acc, season) => {
      if (target.season.includes(season)) {
        return acc + 1;
      }
      return acc;
    }, 0) / source.season.length;

    score = (
      noteScore * weights.notes +
      intensityScore * weights.intensity +
      moodScore * weights.mood +
      seasonalScore * weights.season
    ) * 100;

    return Math.round(score);
  }

  public findComplementaryNotes(
    mood: ScentMood,
    complementaryNotes: string[]
  ): string[] {
    const moodNotes = MOOD_COMPLEMENTARY_NOTES[mood];
    return complementaryNotes.filter(comp => moodNotes.includes(comp));
  }

  public findSeasonalNotes(
    season: Season,
    seasonalNotes: string[]
  ): string[] {
    const seasonNotes = SEASONAL_COMPLEMENTARY_NOTES[season];
    return seasonalNotes.filter(adj => seasonNotes.includes(adj));
  }

  public calculateIntensityMatch(
    source: ScentIntensity,
    target: ScentIntensity
  ): number {
    return 1 - Math.abs(INTENSITY_SCORES[source] - INTENSITY_SCORES[target]) / 2;
  }

  public findComplementaryNotePairings(
    notes: string[]
  ): { source: string; complementary: string[] }[] {
    return notes
      .filter(note => note in NOTE_PAIRINGS)
      .map(note => ({
        source: note,
        complementary: NOTE_PAIRINGS[note as keyof typeof NOTE_PAIRINGS]
      }));
  }
}

export const scentRecommendationService = new ScentRecommendationService();
