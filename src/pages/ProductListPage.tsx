import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import { GET_PRODUCTS_BY_CATEGORY } from '../services/queries';
import ProductGrid from '../components/products/ProductGrid';
import { ProductFilters } from '../components/products/ProductFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import type { Product, ProductFilter } from '../types/commerce';

interface FilterState {
  [key: string]: string[];
}

const ProductListPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({});

  const { loading, error, data } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: { 
      categoryId,
      filters: Object.entries(selectedFilters).map(([attribute_code, values]) => ({
        attribute_code,
        values
      }))
    },
    skip: !categoryId,
  });

  const handleFilterChange = (filterId: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: prev[filterId] ? 
        prev[filterId].includes(value) ?
          prev[filterId].filter(v => v !== value) :
          [...prev[filterId], value] :
        [value]
    }));
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-red-500">Error loading products. Please try again later.</p>
      </div>
    );
  }

  const products = data?.category?.products?.items || [];
  const categoryName = data?.category?.name || 'All Products';
  const availableFilters = data?.category?.filters || [];

  return (
    <>
      <Helmet>
        <title>{categoryName} | The Wick & Wax Co.</title>
        <meta 
          name="description" 
          content={`Browse our collection of ${categoryName.toLowerCase()}. Handcrafted with care and sustainable materials.`} 
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">{categoryName}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
          <div className="lg:col-span-1">
            <ProductFilters
              filters={availableFilters}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              mobileFiltersOpen={mobileFiltersOpen}
              setMobileFiltersOpen={setMobileFiltersOpen}
            />
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductListPage;
