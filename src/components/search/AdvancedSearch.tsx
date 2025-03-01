import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SCENT_CATEGORIES } from '../../graphql/scent';
import { useAdvancedSearch } from '../../hooks/useAdvancedSearch';
import { ProductGrid } from '../products/ProductGrid';
import { Pagination } from '../common/Pagination';
import {
  ScentIntensity,
  Season,
  ScentMood,
  ScentCategory,
} from '../../types/scent';
import { SearchFilters } from '../../services/search/AdvancedSearchService';

export const AdvancedSearch: React.FC = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const {
    filters,
    searchResults,
    isLoading,
    error,
    setFilters,
    resetFilters,
    popularSearches,
    currentPage,
    totalPages,
    setPage,
  } = useAdvancedSearch();

  const { data: categoriesData } = useQuery(GET_SCENT_CATEGORIES);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ query: e.target.value });
  };

  const handleNoteToggle = (note: string) => {
    const newNotes = filters.scentNotes?.includes(note)
      ? filters.scentNotes.filter((n) => n !== note)
      : [...(filters.scentNotes || []), note];
    setFilters({ scentNotes: newNotes });
  };

  const handleIntensityToggle = (intensity: ScentIntensity) => {
    const newIntensity = filters.intensity?.includes(intensity)
      ? filters.intensity.filter((i) => i !== intensity)
      : [...(filters.intensity || []), intensity];
    setFilters({ intensity: newIntensity });
  };

  const handleMoodToggle = (mood: ScentMood) => {
    const newMood = filters.mood?.includes(mood)
      ? filters.mood.filter((m) => m !== mood)
      : [...(filters.mood || []), mood];
    setFilters({ mood: newMood });
  };

  const handleSeasonToggle = (season: Season) => {
    const newSeason = filters.season?.includes(season)
      ? filters.season.filter((s) => s !== season)
      : [...(filters.season || []), season];
    setFilters({ season: newSeason });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    setFilters({
      priceRange: {
        ...filters.priceRange,
        [type]: numValue,
      },
    });
  };

  const handleInStockToggle = () => {
    setFilters({ inStock: !filters.inStock });
  };

  const handleSortChange = (value: SearchFilters['sortBy']) => {
    setFilters({ sortBy: value });
  };

  const renderScentNotes = (category: ScentCategory) => (
    <div key={category.id} className="space-y-2">
      <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
      <div className="flex flex-wrap gap-2">
        {category.children?.map((subcategory) => (
          <button
            key={subcategory.id}
            onClick={() => handleNoteToggle(subcategory.name)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
              ${
                filters.scentNotes?.includes(subcategory.name)
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
          >
            {subcategory.name}
          </button>
        ))}
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50 text-red-700">
        <h3 className="font-semibold mb-2">Search Error</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Search Products</h1>
        <select
          value={filters.sortBy}
          onChange={(e) => handleSortChange(e.target.value as SearchFilters['sortBy'])}
          className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="relevance">Most Relevant</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="popularity">Most Popular</option>
        </select>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          value={filters.query || ''}
          onChange={handleSearchChange}
          placeholder="Search for candles..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700"
        >
          Filters
        </button>
      </div>

      {/* Popular Searches */}
      {popularSearches.length > 0 && !filters.query && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Popular Searches</h2>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((search) => (
              <button
                key={search}
                onClick={() => setFilters({ query: search })}
                className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-700"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters */}
      {Object.values(filters).some((value) => 
        Array.isArray(value) ? value.length > 0 : value
      ) && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-500">Active Filters</h2>
            <button
              onClick={resetFilters}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Clear all
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {/* Render active filters here */}
          </div>
        </div>
      )}

      {/* Filters Panel */}
      {isFiltersOpen && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Scent Notes */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Scent Notes</h2>
              {categoriesData?.scentCategories.map(renderScentNotes)}
            </div>

            {/* Intensity */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Intensity</h2>
              <div className="flex flex-wrap gap-2">
                {['LIGHT', 'MODERATE', 'STRONG'].map((intensity) => (
                  <button
                    key={intensity}
                    onClick={() => handleIntensityToggle(intensity as ScentIntensity)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                      ${
                        filters.intensity?.includes(intensity as ScentIntensity)
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                  >
                    {intensity}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Mood</h2>
              <div className="flex flex-wrap gap-2">
                {['RELAXING', 'ENERGIZING', 'ROMANTIC', 'FRESH', 'COZY', 'EXOTIC'].map(
                  (mood) => (
                    <button
                      key={mood}
                      onClick={() => handleMoodToggle(mood as ScentMood)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                        ${
                          filters.mood?.includes(mood as ScentMood)
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                    >
                      {mood}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Season */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Season</h2>
              <div className="flex flex-wrap gap-2">
                {['SPRING', 'SUMMER', 'FALL', 'WINTER'].map((season) => (
                  <button
                    key={season}
                    onClick={() => handleSeasonToggle(season as Season)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                      ${
                        filters.season?.includes(season as Season)
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                  >
                    {season}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Price Range</h2>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={filters.priceRange?.min ?? ''}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  placeholder="Min"
                  className="w-24 px-2 py-1 rounded border border-gray-300"
                />
                <span>to</span>
                <input
                  type="number"
                  value={filters.priceRange?.max ?? ''}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  placeholder="Max"
                  className="w-24 px-2 py-1 rounded border border-gray-300"
                />
              </div>
            </div>

            {/* In Stock */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Availability</h2>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={handleInStockToggle}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 rounded-lg aspect-w-1 aspect-h-1"
            />
          ))}
        </div>
      ) : searchResults ? (
        <>
          <ProductGrid products={searchResults.products} />
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};
