import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import { GET_PRODUCT_BY_URL_KEY } from '../services/queries';
import { ProductGallery } from '../components/products/ProductGallery';
import { ProductInfo } from '../components/products/ProductInfo';
import type { Product } from '../types/commerce';

export const ProductDetailPage: React.FC = () => {
  const { urlKey } = useParams<{ urlKey: string }>();
  
  const { loading, error, data } = useQuery(GET_PRODUCT_BY_URL_KEY, {
    variables: { urlKey },
    skip: !urlKey,
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

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary-600">404</h2>
          <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Product not found
          </p>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Sorry, we couldn't find the product you're looking for.
          </p>
        </div>
      </div>
    );
  }

  const product: Product = data?.products?.items[0];

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary-600">404</h2>
          <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Product not found
          </p>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Sorry, we couldn't find the product you're looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${product.name} | The Wick & Wax Co`}</title>
        <meta name="description" content={product.meta_description || product.description.html.replace(/<[^>]*>/g, '').slice(0, 160)} />
        <meta property="og:title" content={`${product.name} | The Wick & Wax Co`} />
        <meta property="og:description" content={product.meta_description || product.description.html.replace(/<[^>]*>/g, '').slice(0, 160)} />
        <meta property="og:image" content={product.image.url} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={product.price.regularPrice.amount.value.toString()} />
        <meta property="product:price:currency" content={product.price.regularPrice.amount.currency} />
      </Helmet>

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Product gallery */}
          <ProductGallery images={[product.image, ...product.media_gallery]} />

          {/* Product info */}
          <ProductInfo product={product} />
        </div>
      </div>
    </>
  );
};
