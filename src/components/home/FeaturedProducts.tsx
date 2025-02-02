import React from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { ProductCard } from '../products/ProductCard';
import type { Product } from '../../types/commerce';

const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts {
    products(
      filter: { category_id: { eq: "featured" } }
      pageSize: 4
    ) {
      items {
        id
        sku
        name
        url_key
        price {
          regularPrice {
            amount {
              value
              currency
            }
          }
        }
        image {
          url
          label
        }
        eco_friendly_features
        stock_status
      }
    }
  }
`;

export const FeaturedProducts: React.FC = () => {
  const { data, loading, error } = useQuery(GET_FEATURED_PRODUCTS);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg bg-gray-200 p-4"
              style={{ height: '300px' }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  const products = data?.products?.items || [];

  return (
    <section aria-labelledby="featured-heading" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <h2
            id="featured-heading"
            className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
          >
            Featured Products
          </h2>
          <Link
            to="/products"
            className="hidden text-sm font-semibold text-primary-600 hover:text-primary-500 sm:block"
          >
            Shop all products<span aria-hidden="true"> →</span>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center sm:hidden">
          <Link
            to="/products"
            className="text-sm font-semibold text-primary-600 hover:text-primary-500"
          >
            Shop all products<span aria-hidden="true"> →</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
