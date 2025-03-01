import { Product, ScentProfile } from '../../types/product';
import { analytics } from '../analytics/unifiedAnalytics';

export enum RecommendationType {
  SCENT_BASED = 'scent_based',
  RELATED = 'related',
  FEATURED = 'featured',
  SEASONAL = 'seasonal',
  TRENDING = 'trending'
}

interface RecommendationScore {
  score: number;
  reasons: string[];
}

class UnifiedRecommendations {
  private static instance: UnifiedRecommendations;

  private constructor() {}

  public static getInstance(): UnifiedRecommendations {
    if (!UnifiedRecommendations.instance) {
      UnifiedRecommendations.instance = new UnifiedRecommendations();
    }
    return UnifiedRecommendations.instance;
  }

  public async getRecommendations(
    product: Product,
    types: RecommendationType[],
    limit: number = 10
  ): Promise<Product[]> {
    const allRecommendations = await Promise.all(
      types.map(type => this.getRecommendationsByType(product, type))
    );

    // Merge and deduplicate recommendations
    const mergedRecommendations = this.mergeRecommendations(
      allRecommendations.flat(),
      product.id
    );

    // Track recommendation generation
    analytics.track('recommendations_generated', {
      product_id: product.id,
      types,
      recommendations_count: mergedRecommendations.length
    });

    return mergedRecommendations.slice(0, limit);
  }

  private async getRecommendationsByType(
    product: Product,
    type: RecommendationType
  ): Promise<Product[]> {
    switch (type) {
      case RecommendationType.SCENT_BASED:
        return this.getScentBasedRecommendations(product);
      case RecommendationType.RELATED:
        return this.getRelatedProducts(product);
      case RecommendationType.FEATURED:
        return this.getFeaturedProducts();
      case RecommendationType.SEASONAL:
        return this.getSeasonalRecommendations(product);
      case RecommendationType.TRENDING:
        return this.getTrendingProducts();
      default:
        return [];
    }
  }

  private async getScentBasedRecommendations(product: Product): Promise<Product[]> {
    const scentProfile = product.scent_profile;
    if (!scentProfile) return [];

    return this.findProductsWithSimilarScents(scentProfile);
  }

  private async findProductsWithSimilarScents(profile: ScentProfile): Promise<Product[]> {
    // Implement scent similarity logic
    return [];
  }

  private async getRelatedProducts(product: Product): Promise<Product[]> {
    // Get related products from Adobe Commerce
    return [];
  }

  private async getFeaturedProducts(): Promise<Product[]> {
    // Get featured products from Adobe Commerce
    return [];
  }

  private async getSeasonalRecommendations(product: Product): Promise<Product[]> {
    const currentSeason = this.getCurrentSeason();
    // Get seasonal recommendations
    return [];
  }

  private async getTrendingProducts(): Promise<Product[]> {
    // Get trending products based on analytics data
    return [];
  }

  private mergeRecommendations(
    recommendations: Product[],
    currentProductId: string
  ): Product[] {
    // Remove duplicates and current product
    const uniqueRecommendations = new Map<string, Product>();
    
    recommendations.forEach(product => {
      if (product.id !== currentProductId && !uniqueRecommendations.has(product.id)) {
        uniqueRecommendations.set(product.id, product);
      }
    });

    // Convert back to array and sort by score
    return Array.from(uniqueRecommendations.values())
      .sort((a, b) => this.calculateScore(b).score - this.calculateScore(a).score);
  }

  private calculateScore(product: Product): RecommendationScore {
    const score = {
      score: 0,
      reasons: [] as string[]
    };

    // Base score from product rating
    if (product.rating_summary) {
      score.score += product.rating_summary * 0.4;
      score.reasons.push('Product rating');
    }

    // Popularity score
    if (product.sold_quantity) {
      score.score += Math.min(product.sold_quantity / 100, 5) * 0.3;
      score.reasons.push('Sales popularity');
    }

    // Seasonal relevance
    if (this.isSeasonallyRelevant(product)) {
      score.score += 2;
      score.reasons.push('Seasonal relevance');
    }

    // Stock level impact
    if (product.stock_status === 'IN_STOCK') {
      score.score += 1;
      score.reasons.push('In stock');
    }

    return score;
  }

  private getCurrentSeason(): string {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'SPRING';
    if (month >= 5 && month <= 7) return 'SUMMER';
    if (month >= 8 && month <= 10) return 'FALL';
    return 'WINTER';
  }

  private isSeasonallyRelevant(product: Product): boolean {
    const currentSeason = this.getCurrentSeason();
    return product.scent_profile?.season?.includes(currentSeason) || false;
  }
}

export const recommendations = UnifiedRecommendations.getInstance();
