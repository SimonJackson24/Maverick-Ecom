import { SearchProductsInput } from '../types/search';

export function buildElasticsearchQuery(input: SearchProductsInput) {
  const { query, filters } = input;
  
  // Base query
  const baseQuery = {
    bool: {
      must: [] as any[],
      filter: [] as any[]
    }
  };

  // Add text search if query exists
  if (query) {
    baseQuery.bool.must.push({
      multi_match: {
        query,
        fields: [
          'name^3',
          'description^2',
          'scent_profile.notes^2',
          'scent_profile.mood',
          'scent_profile.season'
        ],
        type: 'best_fields',
        fuzziness: 'AUTO'
      }
    });
  }

  // Add filters if they exist
  if (filters) {
    // Scent notes filter
    if (filters.scent_notes?.length) {
      baseQuery.bool.filter.push({
        terms: {
          'scent_profile.notes.keyword': filters.scent_notes
        }
      });
    }

    // Intensity filter
    if (filters.intensity?.length) {
      baseQuery.bool.filter.push({
        terms: {
          'scent_profile.intensity.keyword': filters.intensity
        }
      });
    }

    // Mood filter
    if (filters.mood?.length) {
      baseQuery.bool.filter.push({
        terms: {
          'scent_profile.mood.keyword': filters.mood
        }
      });
    }

    // Season filter
    if (filters.season?.length) {
      baseQuery.bool.filter.push({
        terms: {
          'scent_profile.season.keyword': filters.season
        }
      });
    }

    // Price range filter
    if (filters.price?.from || filters.price?.to) {
      const priceRange: any = {
        range: {
          'price_range.minimum_price.regular_price.value': {}
        }
      };

      if (filters.price.from !== null) {
        priceRange.range['price_range.minimum_price.regular_price.value'].gte = filters.price.from;
      }

      if (filters.price.to !== null) {
        priceRange.range['price_range.minimum_price.regular_price.value'].lte = filters.price.to;
      }

      baseQuery.bool.filter.push(priceRange);
    }

    // Stock status filter
    if (filters.in_stock) {
      baseQuery.bool.filter.push({
        term: {
          'stock_status': 'IN_STOCK'
        }
      });
    }
  }

  // Add aggregations for faceted search
  const aggregations = {
    scent_notes: {
      terms: {
        field: 'scent_profile.notes.keyword',
        size: 50
      }
    },
    intensity: {
      terms: {
        field: 'scent_profile.intensity.keyword',
        size: 10
      }
    },
    mood: {
      terms: {
        field: 'scent_profile.mood.keyword',
        size: 20
      }
    },
    season: {
      terms: {
        field: 'scent_profile.season.keyword',
        size: 10
      }
    },
    price_ranges: {
      range: {
        field: 'price_range.minimum_price.regular_price.value',
        ranges: [
          { from: 0, to: 25 },
          { from: 25, to: 50 },
          { from: 50, to: 100 },
          { from: 100 }
        ]
      }
    }
  };

  return {
    query: baseQuery,
    aggs: aggregations,
    _source: [
      'id',
      'sku',
      'name',
      'url_key',
      'thumbnail',
      'price_range',
      'stock_status',
      'scent_profile',
      'rating_summary',
      'sold_quantity',
      'created_at'
    ]
  };
}
