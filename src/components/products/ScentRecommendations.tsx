import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/commerce';
import { ScentProfile } from '../../types/scent';
import { useScentRecommendations } from '../../hooks/useScentRecommendations';

interface ScentRecommendationsProps {
  productId: string;
  scentProfile: ScentProfile;
  className?: string;
  onError?: (error: Error) => void;
}

export const ScentRecommendations: React.FC<ScentRecommendationsProps> = ({
  productId,
  scentProfile,
  className,
  onError
}) => {
  const [error, setError] = useState<Error | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    getSimilarScents,
    trackScentInteraction,
    isSimilarLoading: loading,
    similarError: queryError,
    similarScents: recommendations
  } = useScentRecommendations();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && productId) {
      getSimilarScents(productId, { limit: 4 }).catch((error) => {
        setError(error);
        onError?.(error);
      });
    }
  }, [isVisible, productId, getSimilarScents, onError]);

  const handleProductClick = async (product: Product) => {
    try {
      await trackScentInteraction({
        productId: product.id,
        action: 'view'
      });
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  };

  const getIntensityClass = (intensity: number) => {
    switch (true) {
      case intensity <= 2:
        return 'bg-green-100 text-green-800';
      case intensity <= 3:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const renderLoadingState = () => (
    <div
      role="status"
      aria-label="Loading recommendations"
      className="space-y-4"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-gray-200 h-48 rounded-lg"
          data-testid="loading-placeholder"
        />
      ))}
      <span className="sr-only">Loading similar fragrances...</span>
    </div>
  );

  const renderErrorState = () => (
    <div
      role="alert"
      className="p-4 border border-red-200 rounded-lg bg-red-50 text-red-700"
    >
      <h3 className="font-semibold mb-2">Unable to load recommendations</h3>
      <p>{error?.message || 'Please try again later.'}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 text-sm underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
      >
        Refresh page
      </button>
    </div>
  );

  const renderRecommendation = (product: Product) => (
    <li
      key={product.id}
      className="relative"
      data-testid="product-card"
    >
      <Link
        to={`/products/${product.id}`}
        className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
        aria-label={`View ${product.name}`}
        onClick={() => handleProductClick(product)}
      >
        <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
          <img
            src={product.image.url}
            alt={product.image.label}
            className="w-full h-full object-center object-cover"
            loading="lazy"
          />
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-medium text-gray-900">
            {product.name}
          </h3>
          <div
            aria-label={`Scent intensity: ${product.scent_profile.intensity}`}
            className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${getIntensityClass(product.scent_profile.intensity)}`}
            data-testid="intensity-badge"
          >
            {product.scent_profile.intensity}
          </div>
          {product.recommendation && (
            <div className="text-sm text-gray-500">
              {product.recommendation.matching_notes.length > 0 && (
                <p>Matching notes: {product.recommendation.matching_notes.join(', ')}</p>
              )}
              {product.recommendation.explanation && (
                <p className="mt-1">{product.recommendation.explanation}</p>
              )}
            </div>
          )}
          <p className="text-lg font-medium text-gray-900">
            ${product.price.regularPrice.amount.value}
          </p>
        </div>
      </Link>
    </li>
  );

  if (error || queryError) {
    return renderErrorState();
  }

  return (
    <div
      ref={containerRef}
      className={`space-y-6 ${className || ''}`}
      data-testid="recommendations-container"
    >
      <h2
        className="text-2xl font-bold text-gray-900"
        id="recommendations-heading"
      >
        Similar Fragrances You Might Like
      </h2>
      
      {loading ? (
        renderLoadingState()
      ) : (
        <ul
          role="list"
          aria-labelledby="recommendations-heading"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {recommendations.map(renderRecommendation)}
        </ul>
      )}
    </div>
  );
};
