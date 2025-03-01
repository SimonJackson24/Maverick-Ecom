import { SearchProductsInput } from '../types/search';

interface Product {
  id: string;
  name: string;
  scent_profile: {
    notes: string[];
    intensity: string[];
    mood: string[];
    season: string[];
  };
  rating_summary: number;
  sold_quantity: number;
  created_at: string;
}

export function calculateSearchScore(product: Product, input: SearchProductsInput): number {
  let score = 0;

  // Base score from Elasticsearch
  score += product._score || 0;

  // Boost score based on filters match
  if (input.filters) {
    score += calculateFilterMatchScore(product, input.filters);
  }

  // Boost based on popularity signals
  score += calculatePopularityScore(product);

  // Seasonal relevance boost
  score += calculateSeasonalScore(product);

  return score;
}

function calculateFilterMatchScore(product: Product, filters: any): number {
  let score = 0;

  // Scent notes match
  if (filters.scent_notes?.length) {
    const matchingNotes = product.scent_profile.notes.filter(note =>
      filters.scent_notes.includes(note)
    );
    score += (matchingNotes.length / filters.scent_notes.length) * 2;
  }

  // Intensity match
  if (filters.intensity?.length) {
    const matchingIntensity = product.scent_profile.intensity.filter(intensity =>
      filters.intensity.includes(intensity)
    );
    score += (matchingIntensity.length / filters.intensity.length) * 1.5;
  }

  // Mood match
  if (filters.mood?.length) {
    const matchingMood = product.scent_profile.mood.filter(mood =>
      filters.mood.includes(mood)
    );
    score += (matchingMood.length / filters.mood.length) * 1.5;
  }

  // Season match
  if (filters.season?.length) {
    const matchingSeason = product.scent_profile.season.filter(season =>
      filters.season.includes(season)
    );
    score += (matchingSeason.length / filters.season.length) * 1.25;
  }

  return score;
}

function calculatePopularityScore(product: Product): number {
  let score = 0;

  // Rating boost (0-5 scale)
  if (product.rating_summary) {
    score += (product.rating_summary / 5) * 1.5;
  }

  // Sales velocity boost
  if (product.sold_quantity) {
    // Log scale to prevent extremely popular items from dominating
    score += Math.log10(product.sold_quantity + 1) * 0.5;
  }

  // Freshness boost (decay over time)
  const ageInDays = (Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24);
  const freshnessScore = Math.max(0, 1 - (ageInDays / 365)); // Linear decay over a year
  score += freshnessScore * 0.5;

  return score;
}

function calculateSeasonalScore(product: Product): number {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();

  // Define seasons (Northern Hemisphere)
  const seasons = {
    SPRING: [2, 3, 4], // March to May
    SUMMER: [5, 6, 7], // June to August
    FALL: [8, 9, 10],  // September to November
    WINTER: [11, 0, 1] // December to February
  };

  // Determine current season
  let currentSeason = '';
  for (const [season, months] of Object.entries(seasons)) {
    if (months.includes(currentMonth)) {
      currentSeason = season;
      break;
    }
  }

  // Boost score if product is seasonally relevant
  if (currentSeason && product.scent_profile.season.includes(currentSeason)) {
    return 1.5;
  }

  return 0;
}
