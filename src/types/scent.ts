export enum ScentMood {
  RELAXING = 'RELAXING',
  ENERGIZING = 'ENERGIZING',
  ROMANTIC = 'ROMANTIC',
  FRESH = 'FRESH',
  COZY = 'COZY'
}

export enum Season {
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  FALL = 'FALL',
  WINTER = 'WINTER'
}

export enum ScentIntensity {
  LIGHT = 'LIGHT',
  MODERATE = 'MODERATE',
  STRONG = 'STRONG'
}

export interface ScentNote {
  name: string;
  intensity: number;
  id: string;
  color: string;
}

export interface ScentProfile {
  name: string;
  description: string;
  primary_notes: ScentNote[];
  middle_notes: ScentNote[];
  base_notes: ScentNote[];
  intensity: ScentIntensity;
  mood: ScentMood[];
  season: Season[];
  longevity: number;
}

export interface ScentCategory {
  id: string;
  name: string;
  description: string;
  parent_id?: string;
  products_count: number;
  children?: ScentCategory[];
}

export interface CustomerScentPreferences {
  favorite_notes: string[];
  preferred_intensity: ScentIntensity[];
  seasonal_preferences: Season[];
  avoided_notes: string[];
}

export interface ScentRecommendation {
  product_id: string;
  sku: string;
  name: string;
  match_score: number; // 0-100
  matching_attributes: {
    notes: string[];
    intensity: boolean;
    mood: string[];
    season: string[];
  };
}

export interface ScentBasedUpsell {
  source_product: {
    id: string;
    sku: string;
    name: string;
    scent_profile: ScentProfile;
  };
  recommended_products: Array<{
    product: {
      id: string;
      sku: string;
      name: string;
      scent_profile: ScentProfile;
    };
    match_reason: string;
    complementary_score: number;
  }>;
}

export interface ScentProfileInput {
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  intensity: ScentIntensity;
  mood: ScentMood[];
  seasons: Season[];
}

export interface ScentAttribute {
  id: string;
  name: string;
  category: string;
  intensity: ScentIntensity;
  notes: ScentNote[];
}

export interface ScentAttributeInput {
  name: string;
  category: string;
  intensity: ScentIntensity;
  notes: ScentNote[];
}

export interface ScentRule {
  id: string;
  name: string;
  description: string;
  conditions: ScentRuleCondition[];
  actions: ScentRuleAction[];
  priority: number;
  isActive: boolean;
}

export interface ScentRuleInput {
  name: string;
  description: string;
  conditions: ScentRuleCondition[];
  actions: ScentRuleAction[];
  priority: number;
  isActive: boolean;
}

export interface ScentRuleCondition {
  type: 'note' | 'intensity' | 'mood' | 'season';
  operator: 'equals' | 'contains' | 'not_equals' | 'not_contains';
  value: string | string[];
}

export interface ScentRuleAction {
  type: 'boost_score' | 'reduce_score' | 'set_score';
  value: number;
}

export interface SeasonalMapping {
  season: Season;
  notes: string[];
  moods: ScentMood[];
  intensities: ScentIntensity[];
}

export interface UserPreferences {
  preferredScents: {
    topNotes: string[];
    middleNotes: string[];
    baseNotes: string[];
  };
  preferredIntensity: ScentIntensity;
  preferredCategory: string;
  excludedNotes: string[];
  seasonalPreferences: Season[];
  moodPreferences: ScentMood[];
}
