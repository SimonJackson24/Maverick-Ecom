import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_FEATURED_PRODUCTS } from '../../graphql/products';
import { Product } from '../../types/commerce';
import ProductCard from '../products/ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { monitoring } from '../../services/monitoring/MonitoringService';

export const FeaturedProducts: React.FC = () => {
  const { loading, error, data, refetch } = useQuery<{ featuredProducts: Product[] }>(GET_FEATURED_PRODUCTS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  });

  useEffect(() => {
    if (data?.featuredProducts) {
      monitoring.logMetric('featured_products_loaded', {
        value: data.featuredProducts.length,
        tags: { source: 'homepage' }
      });
    }
  }, [data]);

  const handleRetry = () => {
    monitoring.logMetric('featured_products_retry', {
      value: 1,
      tags: { source: 'homepage' }
    });
    refetch();
  };

  if (loading && !data) {
    return (
      <div 
        className="flex justify-center items-center h-64"
        role="status"
        aria-label="Loading featured products"
      >
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    monitoring.logError('featured_products_error', {
      message: error.message,
      componentName: 'FeaturedProducts',
      additionalContext: { graphQLError: error }
    });

    return (
      <ErrorMessage 
        title="Unable to load featured products"
        message="We're having trouble loading our featured products. Please try again later."
        onRetry={handleRetry}
      />
    );
  }

  const products = data?.featuredProducts || [];

  if (products.length === 0) {
    monitoring.logMetric('featured_products_empty', {
      value: 1,
      tags: { source: 'homepage' }
    });

    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-medium text-gray-900 mb-4">
          Featured Products
        </h2>
        <p className="text-gray-500">
          No featured products available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium text-gray-900">Featured Products</h2>
          <Link
            to="/products"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            View all products
            <span aria-hidden="true"> →</span>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {data?.featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} showScentProfile />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
