import { Product } from '../../types/product';

export interface SearchFilters {
  scentNotes?: string[];
  intensity?: number[];
  categories?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  mood?: string[];
  season?: string[];
  inStock?: boolean;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'popularity';
}

export interface SearchResult {
  products: Product[];
  totalCount: number;
  facets: {
    scentNotes: Array<{ value: string; count: number }>;
    categories: Array<{ value: string; count: number }>;
    intensity: Array<{ value: number; count: number }>;
    mood: Array<{ value: string; count: number }>;
    season: Array<{ value: string; count: number }>;
  };
}

export class AdvancedSearchService {
  private static instance: AdvancedSearchService;

  private constructor() {}

  public static getInstance(): AdvancedSearchService {
    if (!AdvancedSearchService.instance) {
      AdvancedSearchService.instance = new AdvancedSearchService();
    }
    return AdvancedSearchService.instance;
  }

  public async search(
    query: string,
    filters: SearchFilters,
    page: number = 1,
    pageSize: number = 20
  ): Promise<SearchResult> {
    try {
      const response = await fetch('/api/search/advanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          filters,
          page,
          pageSize,
        }),
      });

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error performing advanced search:', error);
      throw error;
    }
  }

  public async getSearchSuggestions(
    query: string,
    limit: number = 5
  ): Promise<string[]> {
    try {
      const response = await fetch(
        `/api/search/suggestions?query=${encodeURIComponent(
          query
        )}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch search suggestions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return [];
    }
  }

  public async getPopularSearches(limit: number = 5): Promise<string[]> {
    try {
      const response = await fetch(`/api/search/popular?limit=${limit}`);

      if (!response.ok) {
        throw new Error('Failed to fetch popular searches');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting popular searches:', error);
      return [];
    }
  }

  public async trackSearchInteraction(data: {
    query: string;
    filters: SearchFilters;
    resultCount: number;
    selectedProductId?: string;
  }): Promise<void> {
    try {
      await fetch('/api/search/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error tracking search interaction:', error);
    }
  }
}
