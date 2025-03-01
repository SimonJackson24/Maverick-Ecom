import React, { useRef } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SIMILAR_SCENTS } from '../../graphql/scent';
import { useAnalytics } from '../../hooks/useAnalytics';
import ScentProfile from './ScentProfile'; // Update ScentProfile import to use default export
import { formatPrice } from '../../utils/price';

interface ScentRecommendationCarouselProps {
  productSku: string;
  productName: string;
}

export const ScentRecommendationCarousel: React.FC<ScentRecommendationCarouselProps> = ({
  productSku,
  productName
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const analytics = useAnalytics();
  
  const { data, loading, error } = useQuery(GET_SIMILAR_SCENTS, {
    variables: { sku: productSku }
  });

  const handleScroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    
    const scrollAmount = 300;
    const newScrollPosition = carouselRef.current.scrollLeft + 
      (direction === 'left' ? -scrollAmount : scrollAmount);
    
    carouselRef.current.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });

    analytics.track('scent_recommendations_scroll', {
      product_sku: productSku,
      product_name: productName,
      scroll_direction: direction
    });
  };

  const handleProductClick = (recommendedProduct: any) => {
    analytics.track('scent_recommendation_click', {
      source_product_sku: productSku,
      source_product_name: productName,
      recommended_product_sku: recommendedProduct.sku,
      recommended_product_name: recommendedProduct.name,
      match_score: recommendedProduct.match_score
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data?.product?.similar_products?.items?.length) {
    return null;
  }

  const similarProducts = data.product.similar_products.items;

  return (
    <div className="relative">
      <h2 className="text-xl font-medium text-gray-900 mb-6">
        You May Also Like
      </h2>

      {/* Navigation Buttons */}
      <div className="absolute right-0 top-0 space-x-2">
        <button
          onClick={() => handleScroll('left')}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Scroll left"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => handleScroll('right')}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Scroll right"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Carousel */}
      <div
        ref={carouselRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
      >
        {similarProducts.map((product) => (
          <div
            key={product.id}
            className="flex-none w-64 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
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
                <div className="mt-2">
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
    </div>
  );
};
