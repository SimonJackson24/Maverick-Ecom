import React from 'react';
import { Product } from '../../types/commerce';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';

interface ProductGridProps {
  products: Product[];
  showScentProfile?: boolean;
  className?: string;
  loading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  showScentProfile = false,
  className = '',
  loading,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200" />
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showScentProfile={showScentProfile}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
