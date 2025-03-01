import React from 'react';
import { Product } from '../../types/commerce';
import ProductCard from '../products/ProductCard';

interface ScentBasedUpsellsProps {
  currentItems: {
    product: Product;
    quantity: number;
  }[];
  recommendations: Product[];
  onAddToCart: (product: Product) => void;
}

const ScentBasedUpsells: React.FC<ScentBasedUpsellsProps> = ({
  currentItems,
  recommendations,
  onAddToCart,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900">You might also like</h2>
      <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
        {recommendations.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showScentProfile={true}
            onAddToCart={() => onAddToCart(product)}
          />
        ))}
      </div>
    </div>
  );
};

export default ScentBasedUpsells;
