import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdvancedSearchService, SearchFilters, SearchResult } from '../services/search/AdvancedSearchService';
import { useDebounce } from './useDebounce';

interface UseAdvancedSearchProps {
  initialFilters?: Partial<SearchFilters>;
  pageSize?: number;
}

interface UseAdvancedSearchReturn {
  filters: SearchFilters;
  searchResults: SearchResult | null;
  isLoading: boolean;
  error: Error | null;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  suggestions: string[];
  popularSearches: string[];
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
}

const defaultFilters: SearchFilters = {
  scentNotes: [],
  intensity: [],
  categories: [],
  priceRange: {},
  mood: [],
  season: [],
  inStock: true,
  sortBy: 'relevance'
};

export function useAdvancedSearch({
  initialFilters = {},
  pageSize = 20
}: UseAdvancedSearchProps = {}): UseAdvancedSearchReturn {
  const [filters, setFiltersState] = useState<SearchFilters>({
    ...defaultFilters,
    ...initialFilters
  });
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();
  const searchService = AdvancedSearchService.getInstance();
  const debouncedFilters = useDebounce(filters, 300);

  // Update URL with search params
  useEffect(() => {
    const searchParams = new URLSearchParams();
    Object.entries(debouncedFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (subValue !== undefined && subValue !== null) {
            searchParams.append(`${key}_${subKey}`, String(subValue));
          }
        });
      } else if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    searchParams.append('page', String(currentPage));
    
    const newSearch = searchParams.toString();
    if (newSearch !== location.search.slice(1)) {
      navigate({ search: newSearch }, { replace: true });
    }
  }, [debouncedFilters, currentPage, navigate, location]);

  // Perform search when filters change
  useEffect(() => {
    const performSearch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const results = await searchService.search(
          '',
          debouncedFilters,
          currentPage,
          pageSize
        );
        setSearchResults(results);
        
        // Track search interaction
        await searchService.trackSearchInteraction({
          query: '',
          filters: debouncedFilters,
          resultCount: results.totalCount
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Search failed'));
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedFilters, currentPage, pageSize]);

  // Load popular searches
  useEffect(() => {
    const loadPopularSearches = async () => {
      try {
        const searches = await searchService.getPopularSearches();
        setPopularSearches(searches);
      } catch (error) {
        console.error('Failed to load popular searches:', error);
      }
    };

    loadPopularSearches();
  }, []);

  const setFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters
    }));
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
    setCurrentPage(1);
  }, []);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const totalPages = Math.ceil((searchResults?.totalCount || 0) / pageSize);

  return {
    filters,
    searchResults,
    isLoading,
    error,
    setFilters,
    resetFilters,
    suggestions,
    popularSearches,
    currentPage,
    totalPages,
    setPage
  };
}
