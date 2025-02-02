import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { FunnelIcon, Squares2X2Icon } from '@heroicons/react/20/solid';
import { GET_PRODUCTS, GET_CATEGORY } from '../services/queries';
import { ProductGrid } from '../components/products/ProductGrid';
import { ProductFilters } from '../components/products/ProductFilters';
import type { Product, Category } from '../types/commerce';

export const ProductListingPage: React.FC = () => {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  // Get filters from URL on component mount
  useEffect(() => {
    const filters: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      filters[key] = value.split(',');
    });
    setSelectedFilters(filters);
  }, []);

  const {
    loading: categoryLoading,
    error: categoryError,
    data: categoryData
  } = useQuery(GET_CATEGORY, {
    variables: { id: categoryId },
    skip: !categoryId
  });

  const {
    loading: productsLoading,
    error: productsError,
    data: productsData
  } = useQuery(GET_PRODUCTS, {
    variables: {
      pageSize: 12,
      currentPage: 1,
      filter: {
        category_id: { eq: categoryId },
        ...Object.entries(selectedFilters).reduce((acc, [key, values]) => ({
          ...acc,
          [key]: { in: values }
        }), {})
      }
    }
  });

  const handleFilterChange = (filterId: string, value: string) => {
    const newFilters = { ...selectedFilters };
    if (!newFilters[filterId]) {
      newFilters[filterId] = [];
    }
    
    const index = newFilters[filterId].indexOf(value);
    if (index === -1) {
      newFilters[filterId].push(value);
    } else {
      newFilters[filterId].splice(index, 1);
    }
    
    if (newFilters[filterId].length === 0) {
      delete newFilters[filterId];
    }

    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, values]) => {
      params.set(key, values.join(','));
    });
    setSearchParams(params);
    
    setSelectedFilters(newFilters);
  };

  const loading = categoryLoading || productsLoading;
  const error = categoryError || productsError;
  const category: Category | null = categoryData?.category || null;
  const products: Product[] = productsData?.products?.items || [];

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Error loading products</h3>
        <p className="mt-1 text-sm text-gray-500">
          Please try refreshing the page
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <ProductFilters
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
        />

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {category?.name || 'All Products'}
            </h1>

            <div className="flex items-center">
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <div className="hidden lg:block">
                <ProductFilters
                  mobileFiltersOpen={mobileFiltersOpen}
                  setMobileFiltersOpen={setMobileFiltersOpen}
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
                />
              </div>

              {/* Product grid */}
              <div className="lg:col-span-3">
                <ProductGrid products={products} loading={loading} />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
