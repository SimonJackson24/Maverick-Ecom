import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import { GET_PRODUCT_BY_URL_KEY } from '../services/queries';
import { ProductGallery } from '../components/products/ProductGallery';
import { ProductInfo } from '../components/products/ProductInfo';
import { Product } from '../types/commerce';
import { ApiResponse } from '../types/api';
import { monitoring } from '../services/monitoring/MonitoringService';

interface ProductQueryResponse {
  product: Product;
}

export const ProductDetailPage: React.FC = () => {
  const { urlKey } = useParams<{ urlKey: string }>();
  
  const { loading, error, data } = useQuery<ApiResponse<ProductQueryResponse>>(GET_PRODUCT_BY_URL_KEY, {
    variables: { urlKey },
    skip: !urlKey,
    onError: (error) => {
      monitoring.logError('product_query_error', {
        message: error.message,
        componentName: 'ProductDetailPage',
        additionalContext: { urlKey }
      });
    }
  });

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Gallery skeleton */}
          <div className="aspect-h-1 aspect-w-1 w-full">
            <div className="h-full w-full bg-gray-200 animate-pulse rounded-lg" />
          </div>

          {/* Info skeleton */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4" />
              <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 animate-pulse rounded" />
                <div className="h-4 bg-gray-200 animate-pulse rounded" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Product Not Found
          </h1>
          <p className="mt-4 text-base text-gray-500">
            The product you're looking for could not be found or is no longer available.
          </p>
        </div>
      </div>
    );
  }

  const { product } = data.data;

  return (
    <>
      <Helmet>
        <title>{`${product.name} | Wick & Wax Co.`}</title>
        <meta name="description" content={product.meta_description || product.description.html.substring(0, 155)} />
      </Helmet>

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <ProductGallery 
            images={product.media_gallery.map((image, index) => ({
              ...image,
              position: index
            }))} 
          />
          <ProductInfo product={product} />
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
