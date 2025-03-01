import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { SEARCH_PRODUCTS } from '../../graphql/search';
import ScentProfile from '../scent/ScentProfile'; // Update ScentProfile import to use default export
import { useAnalytics } from '../../hooks/useAnalytics';
import { formatPrice } from '../../utils/price';

interface SearchResultsProps {
  filters: {
    query: string;
    scentNotes: string[];
    intensity: string[];
    mood: string[];
    season: string[];
    priceRange: {
      min: number | null;
      max: number | null;
    };
    inStock: boolean;
  };
  sortBy?: string;
  page: number;
  itemsPerPage: number;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  filters,
  sortBy = 'relevance',
  page,
  itemsPerPage
}) => {
  const analytics = useAnalytics();

  const { data, loading, error } = useQuery(SEARCH_PRODUCTS, {
    variables: {
      input: {
        query: filters.query,
        filters: {
          scent_notes: filters.scentNotes,
          intensity: filters.intensity,
          mood: filters.mood,
          season: filters.season,
          price: {
            from: filters.priceRange.min,
            to: filters.priceRange.max
          },
          in_stock: filters.inStock
        },
        sort: sortBy,
        page,
        itemsPerPage
      }
    }
  });

  useEffect(() => {
    if (data?.searchProducts?.items) {
      analytics.track('search_results_viewed', {
        query: filters.query,
        filters,
        results_count: data.searchProducts.total_count,
        page,
        sort_by: sortBy
      });
    }
  }, [data, filters, page, sortBy]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-64 rounded-lg" />
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading search results. Please try again.</p>
      </div>
    );
  }

  if (!data?.searchProducts?.items?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No results found</h3>
        <p className="mt-2 text-sm text-gray-500">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  const handleProductClick = (product: any) => {
    analytics.track('search_result_click', {
      query: filters.query,
      filters,
      product_id: product.id,
      product_name: product.name,
      position: data.searchProducts.items.indexOf(product) + 1 + (page - 1) * itemsPerPage
    });
  };

  return (
    <div>
      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          Showing {(page - 1) * itemsPerPage + 1} - {Math.min(page * itemsPerPage, data.searchProducts.total_count)} of{' '}
          {data.searchProducts.total_count} results
        </p>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.searchProducts.items.map((product: any) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <a
              href={`/product/${product.url_key}`}
              onClick={() => handleProductClick(product)}
              className="block"
            >
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg">
                <img
                  src={product.thumbnail.url}
                  alt={product.thumbnail.label}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {formatPrice(
                    product.price_range.minimum_price.regular_price.value,
                    product.price_range.minimum_price.regular_price.currency
                  )}
                </p>

                {/* Stock Status */}
                {product.stock_status === 'IN_STOCK' ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                    In Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-2">
                    Out of Stock
                  </span>
                )}

                {/* Scent Profile */}
                <div className="mt-4">
                  <ScentProfile
                    profile={product.scent_profile}
                    productId={product.id}
                    productName={product.name}
                  />
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data.searchProducts.total_count > itemsPerPage && (
        <div className="mt-8 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            {/* Previous Page */}
            <button
              onClick={() => page > 1 && handlePageChange(page - 1)}
              disabled={page === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium
                ${page === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {[...Array(Math.ceil(data.searchProducts.total_count / itemsPerPage))].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                  ${page === i + 1
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
              >
                {i + 1}
              </button>
            ))}

            {/* Next Page */}
            <button
              onClick={() => 
                page < Math.ceil(data.searchProducts.total_count / itemsPerPage) &&
                handlePageChange(page + 1)
              }
              disabled={page >= Math.ceil(data.searchProducts.total_count / itemsPerPage)}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium
                ${page >= Math.ceil(data.searchProducts.total_count / itemsPerPage)
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};
