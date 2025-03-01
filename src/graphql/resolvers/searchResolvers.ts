import { ApolloError } from 'apollo-server-errors';
import { Redis } from 'ioredis';
import { SearchProductsInput } from '../types/search';
import { buildElasticsearchQuery } from '../utils/searchQueryBuilder';
import { calculateSearchScore } from '../utils/searchScoring';

// Initialize Redis client for caching
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: 1, // Use separate DB for search cache
});

// Cache configuration
const CACHE_TTL = 3600; // 1 hour
const CACHE_PREFIX = 'search:';

export const searchResolvers = {
  Query: {
    async searchProducts(_, { input }: { input: SearchProductsInput }, { dataSources, analytics }) {
      try {
        const cacheKey = buildCacheKey(input);
        
        // Try to get cached results
        const cachedResults = await getCachedResults(cacheKey);
        if (cachedResults) {
          analytics.track('search_cache_hit', {
            query: input.query,
            filters: input.filters
          });
          return cachedResults;
        }

        // Build Elasticsearch query
        const esQuery = buildElasticsearchQuery(input);
        
        // Get search results from Elasticsearch
        const searchResults = await dataSources.elasticsearch.search({
          index: 'products',
          body: esQuery,
          from: (input.page - 1) * input.itemsPerPage,
          size: input.itemsPerPage
        });

        // Get product details from Adobe Commerce
        const productIds = searchResults.hits.hits.map(hit => hit._id);
        const products = await dataSources.products.getProductsByIds(productIds);

        // Calculate search scores and sort results
        const scoredProducts = products.map(product => ({
          ...product,
          search_score: calculateSearchScore(product, input)
        }));

        // Sort results based on input
        const sortedProducts = sortSearchResults(scoredProducts, input.sort);

        // Build facets
        const facets = await buildSearchFacets(searchResults.aggregations);

        const results = {
          items: sortedProducts,
          total_count: searchResults.hits.total.value,
          facets
        };

        // Cache results
        await cacheSearchResults(cacheKey, results);

        // Track search analytics
        analytics.track('search_performed', {
          query: input.query,
          filters: input.filters,
          results_count: results.total_count,
          page: input.page,
          sort: input.sort
        });

        return results;
      } catch (error) {
        console.error('Search error:', error);
        analytics.track('search_error', {
          query: input.query,
          error: error.message
        });
        throw new ApolloError('Error performing search', 'SEARCH_ERROR');
      }
    }
  }
};

// Cache helpers
async function getCachedResults(cacheKey: string) {
  const cached = await redis.get(CACHE_PREFIX + cacheKey);
  return cached ? JSON.parse(cached) : null;
}

async function cacheSearchResults(cacheKey: string, results: any) {
  await redis.setex(
    CACHE_PREFIX + cacheKey,
    CACHE_TTL,
    JSON.stringify(results)
  );
}

function buildCacheKey(input: SearchProductsInput): string {
  return Buffer.from(JSON.stringify({
    q: input.query,
    f: input.filters,
    s: input.sort,
    p: input.page,
    i: input.itemsPerPage
  })).toString('base64');
}

// Sorting helpers
function sortSearchResults(products: any[], sort?: { field: string; direction: string }) {
  if (!sort) return products;

  return [...products].sort((a, b) => {
    switch (sort.field) {
      case 'PRICE':
        return sort.direction === 'ASC'
          ? a.price_range.minimum_price.regular_price.value - b.price_range.minimum_price.regular_price.value
          : b.price_range.minimum_price.regular_price.value - a.price_range.minimum_price.regular_price.value;

      case 'NAME':
        return sort.direction === 'ASC'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);

      case 'NEWEST':
        return sort.direction === 'ASC'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

      case 'RATING':
        return sort.direction === 'ASC'
          ? a.rating_summary - b.rating_summary
          : b.rating_summary - a.rating_summary;

      case 'BEST_SELLING':
        return sort.direction === 'ASC'
          ? a.sold_quantity - b.sold_quantity
          : b.sold_quantity - a.sold_quantity;

      case 'RELEVANCE':
      default:
        return sort.direction === 'ASC'
          ? a.search_score - b.search_score
          : b.search_score - a.search_score;
    }
  });
}

// Facet builder
async function buildSearchFacets(aggregations: any) {
  return {
    scent_notes: aggregations.scent_notes.buckets.map((bucket: any) => ({
      code: bucket.key,
      label: bucket.key,
      count: bucket.doc_count
    })),
    intensity: aggregations.intensity.buckets.map((bucket: any) => ({
      code: bucket.key,
      label: bucket.key,
      count: bucket.doc_count
    })),
    mood: aggregations.mood.buckets.map((bucket: any) => ({
      code: bucket.key,
      label: bucket.key,
      count: bucket.doc_count
    })),
    season: aggregations.season.buckets.map((bucket: any) => ({
      code: bucket.key,
      label: bucket.key,
      count: bucket.doc_count
    })),
    price_ranges: aggregations.price_ranges.buckets.map((bucket: any) => ({
      code: `${bucket.from}-${bucket.to}`,
      label: `$${bucket.from} - $${bucket.to}`,
      count: bucket.doc_count
    }))
  };
}
