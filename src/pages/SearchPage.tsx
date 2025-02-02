import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import { SEARCH_PRODUCTS } from '../services/searchQueries';

interface Filter {
  code: string;
  name: string;
  options: {
    value: string;
    count: number;
    label: string;
  }[];
}

interface Sort {
  field: string;
  direction: 'ASC' | 'DESC';
}

const sortOptions = [
  { label: 'Most Relevant', value: 'relevance-desc' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest First', value: 'created_at-desc' },
];

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const sortParam = searchParams.get('sort') || 'relevance-desc';

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [activeFilters, setActiveFilters] = useState<{ code: string; value: string }[]>([]);

  const { loading, error, data } = useQuery(SEARCH_PRODUCTS, {
    variables: {
      query,
      filters: Object.entries(selectedFilters).reduce(
        (acc, [key, values]) => ({
          ...acc,
          [key]: values,
        }),
        {},
      ),
      sort: {
        field: sortParam.split('-')[0],
        direction: sortParam.split('-')[1].toUpperCase(),
      },
      page,
      pageSize: 24,
    },
    skip: !query,
  });

  useEffect(() => {
    // Update active filters when selected filters change
    const newActiveFilters = Object.entries(selectedFilters).flatMap(([code, values]) =>
      values.map((value) => ({ code, value })),
    );
    setActiveFilters(newActiveFilters);
  }, [selectedFilters]);

  const handleFilterChange = (code: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[code] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return {
        ...prev,
        [code]: updated,
      };
    });
  };

  const handleSortChange = (value: string) => {
    searchParams.set('sort', value);
    navigate({ search: searchParams.toString() });
  };

  const handlePageChange = (newPage: number) => {
    searchParams.set('page', newPage.toString());
    navigate({ search: searchParams.toString() });
  };

  const removeFilter = (code: string, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [code]: prev[code].filter((v) => v !== value),
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
  };

  if (!query) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Search Our Products</h1>
          <p className="mt-4 text-lg text-gray-500">Enter a search term to find products.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Search Results for "{query}" | The Wick & Wax Co.</title>
        <meta
          name="description"
          content={`Search results for "${query}" - Browse our collection of sustainable candles and home fragrances.`}
        />
      </Helmet>

      <div className="bg-white">
        <div>
          {/* Mobile filter dialog */}
          {/* Add mobile filter implementation here */}

          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Search Results for "{query}"
              </h1>

              <div className="flex items-center">
                <select
                  value={sortParam}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <section aria-labelledby="products-heading" className="pb-24 pt-6">
              <h2 id="products-heading" className="sr-only">
                Products
              </h2>

              <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                {/* Filters */}
                <form className="hidden lg:block">
                  <h3 className="sr-only">Categories</h3>

                  {/* Active filters */}
                  {activeFilters.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">Active Filters</h3>
                        <button
                          type="button"
                          onClick={clearAllFilters}
                          className="text-sm font-medium text-primary-600 hover:text-primary-500"
                        >
                          Clear all
                        </button>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {activeFilters.map((filter, index) => (
                          <button
                            key={`${filter.code}-${index}`}
                            type="button"
                            onClick={() => removeFilter(filter.code, filter.value)}
                            className="inline-flex items-center rounded-full bg-gray-100 py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900"
                          >
                            <span>
                              {filter.code}: {filter.value}
                            </span>
                            <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500">
                              <span className="sr-only">Remove filter for {filter.value}</span>
                              <svg
                                className="h-3 w-3"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {data?.searchProducts?.facets.map((filter: Filter) => (
                    <div key={filter.code} className="border-b border-gray-200 py-6">
                      <h3 className="-my-3 flow-root">
                        <span className="font-medium text-gray-900">{filter.name}</span>
                      </h3>
                      <div className="pt-6">
                        <div className="space-y-4">
                          {filter.options.map((option) => (
                            <div key={option.value} className="flex items-center">
                              <input
                                id={`filter-${filter.code}-${option.value}`}
                                name={`${filter.code}[]`}
                                value={option.value}
                                type="checkbox"
                                checked={(selectedFilters[filter.code] || []).includes(option.value)}
                                onChange={() => handleFilterChange(filter.code, option.value)}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                              <label
                                htmlFor={`filter-${filter.code}-${option.value}`}
                                className="ml-3 text-sm text-gray-600"
                              >
                                {option.label} ({option.count})
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </form>

                {/* Product grid */}
                <div className="lg:col-span-3">
                  {loading ? (
                    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div
                          key={index}
                          className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
                        >
                          <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none sm:h-96" />
                          <div className="flex flex-1 flex-col space-y-2 p-4">
                            <div className="h-4 w-3/4 rounded bg-gray-200" />
                            <div className="h-4 w-1/2 rounded bg-gray-200" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-medium text-gray-900">Error loading results</h3>
                      <p className="mt-2 text-sm text-gray-500">Please try again later.</p>
                    </div>
                  ) : data?.searchProducts?.items.length === 0 ? (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-medium text-gray-900">No results found</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Try adjusting your search or filters to find what you're looking for.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
                        {data?.searchProducts?.items.map((product: any) => (
                          <div
                            key={product.id}
                            className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
                          >
                            <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none sm:h-96">
                              <img
                                src={product.images[0]?.url}
                                alt={product.images[0]?.alt}
                                className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                              />
                            </div>
                            <div className="flex flex-1 flex-col space-y-2 p-4">
                              <h3 className="text-sm font-medium text-gray-900">
                                <a href={`/product/${product.urlKey}`}>
                                  <span aria-hidden="true" className="absolute inset-0" />
                                  {product.name}
                                </a>
                              </h3>
                              <p className="text-sm text-gray-500">{product.shortDescription}</p>
                              <div className="flex flex-1 flex-col justify-end">
                                <p className="text-base font-medium text-gray-900">
                                  ${product.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {data?.searchProducts?.pageInfo && (
                        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
                          <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={!data.searchProducts.pageInfo.hasPreviousPage}
                            className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <div className="text-sm text-gray-700">
                            Page {data.searchProducts.pageInfo.currentPage} of{' '}
                            {data.searchProducts.pageInfo.totalPages}
                          </div>
                          <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={!data.searchProducts.pageInfo.hasNextPage}
                            className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
