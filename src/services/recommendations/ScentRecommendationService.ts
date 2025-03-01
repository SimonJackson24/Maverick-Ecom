import { Product } from '../../types/product';
import { UserPreferences } from '../../types/user';

interface ScentProfile {
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  intensity: number;
  category: string;
}

interface RecommendationScore {
  productId: string;
  score: number;
  matchingNotes: string[];
  matchingCategories: string[];
}

export class ScentRecommendationService {
  private static instance: ScentRecommendationService;
  private readonly similarityThreshold = 0.5;
  private readonly maxRecommendations = 10;

  private constructor() {}

  public static getInstance(): ScentRecommendationService {
    if (!ScentRecommendationService.instance) {
      ScentRecommendationService.instance = new ScentRecommendationService();
    }
    return ScentRecommendationService.instance;
  }

  public async getPersonalizedRecommendations(
    userId: string,
    currentProduct?: Product
  ): Promise<Product[]> {
    try {
      const userPreferences = await this.getUserPreferences(userId);
      const allProducts = await this.getAllProducts();
      const recommendations = this.calculateRecommendations(
        allProducts,
        userPreferences,
        currentProduct
      );
      return recommendations;
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return [];
    }
  }

  public async getSimilarProducts(product: Product): Promise<Product[]> {
    try {
      const allProducts = await this.getAllProducts();
      const scentProfile = this.extractScentProfile(product);
      const similarProducts = this.findSimilarProducts(
        allProducts,
        scentProfile,
        product.id
      );
      return similarProducts;
    } catch (error) {
      console.error('Error getting similar products:', error);
      return [];
    }
  }

  private async getUserPreferences(userId: string): Promise<UserPreferences> {
    // Fetch user preferences from API
    const response = await fetch(`/api/users/${userId}/preferences`);
    if (!response.ok) {
      throw new Error('Failed to fetch user preferences');
    }
    return response.json();
  }

  private async getAllProducts(): Promise<Product[]> {
    // Fetch all products from API
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  }

  private extractScentProfile(product: Product): ScentProfile {
    return {
      topNotes: product.scentProfile?.topNotes || [],
      middleNotes: product.scentProfile?.middleNotes || [],
      baseNotes: product.scentProfile?.baseNotes || [],
      intensity: product.scentProfile?.intensity || 0,
      category: product.category,
    };
  }

  private calculateSimilarityScore(
    profile1: ScentProfile,
    profile2: ScentProfile
  ): RecommendationScore {
    let score = 0;
    const matchingNotes: string[] = [];
    const matchingCategories: string[] = [];

    // Compare notes
    const compareNotes = (notes1: string[], notes2: string[]) => {
      const matches = notes1.filter((note) => notes2.includes(note));
      matchingNotes.push(...matches);
      return matches.length / Math.max(notes1.length, notes2.length, 1);
    };

    // Calculate scores for each note type
    const topNotesScore = compareNotes(profile1.topNotes, profile2.topNotes) * 0.4;
    const middleNotesScore = compareNotes(profile1.middleNotes, profile2.middleNotes) * 0.3;
    const baseNotesScore = compareNotes(profile1.baseNotes, profile2.baseNotes) * 0.3;

    // Calculate intensity similarity (0-1 scale)
    const intensityDiff = Math.abs(profile1.intensity - profile2.intensity) / 5;
    const intensityScore = 1 - intensityDiff;

    // Category matching
    if (profile1.category === profile2.category) {
      matchingCategories.push(profile1.category);
      score += 0.2;
    }

    // Combine scores
    score += (topNotesScore + middleNotesScore + baseNotesScore) * 0.8;
    score = Math.min(Math.max(score, 0), 1); // Normalize to 0-1

    return {
      productId: '', // Will be set by calling function
      score,
      matchingNotes: [...new Set(matchingNotes)],
      matchingCategories,
    };
  }

  private findSimilarProducts(
    products: Product[],
    targetProfile: ScentProfile,
    excludeId?: string
  ): Product[] {
    const scores: RecommendationScore[] = products
      .filter((product) => product.id !== excludeId)
      .map((product) => {
        const profile = this.extractScentProfile(product);
        const similarity = this.calculateSimilarityScore(targetProfile, profile);
        return {
          ...similarity,
          productId: product.id,
        };
      });

    // Sort by score and filter by threshold
    const recommendedProducts = scores
      .filter((score) => score.score >= this.similarityThreshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, this.maxRecommendations)
      .map((score) => products.find((p) => p.id === score.productId)!)
      .filter(Boolean);

    return recommendedProducts;
  }

  private calculateRecommendations(
    products: Product[],
    preferences: UserPreferences,
    currentProduct?: Product
  ): Product[] {
    // Convert user preferences to a scent profile
    const userProfile: ScentProfile = {
      topNotes: preferences.preferredScents || [],
      middleNotes: preferences.preferredScents || [],
      baseNotes: preferences.preferredScents || [],
      intensity: preferences.preferredIntensity || 3,
      category: preferences.preferredCategory || '',
    };

    // Get recommendations based on user profile
    const recommendations = this.findSimilarProducts(
      products,
      userProfile,
      currentProduct?.id
    );

    return recommendations;
  }

  public async updateUserPreferences(
    userId: string,
    interaction: {
      productId: string;
      action: 'view' | 'like' | 'purchase';
    }
  ): Promise<void> {
    try {
      await fetch(`/api/users/${userId}/preferences/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interaction),
      });
    } catch (error) {
      console.error('Error updating user preferences:', error);
    }
  }
}
