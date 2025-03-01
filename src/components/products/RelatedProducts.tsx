import React from 'react';
import { Product } from '../../types/commerce';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  showScentProfile?: boolean;
  className?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  products,
  title = 'Related Products',
  subtitle,
  showScentProfile = false,
  className = '',
}) => {
  if (!products.length) return null;

  return (
    <section className={`mt-16 ${className}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h2>
        {subtitle && (
          <p className="mt-4 text-base text-gray-500">{subtitle}</p>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showScentProfile={showScentProfile}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
