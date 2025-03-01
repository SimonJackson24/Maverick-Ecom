import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useWishlist } from '../store/WishlistContext';
import { useCommerce } from '../store/CommerceContext';
import { WishlistManager } from '../components/wishlist/WishlistManager';
import { useQuery } from '@apollo/client';
import { GET_SHARED_WISHLIST } from '../graphql/wishlist';

interface WishlistItem {
  id: string;
  product: {
    sku: string;
    name: string;
    url_key: string;
    image: {
      url: string;
      label: string;
    };
    price: {
      regularPrice: {
        amount: {
          currency: string;
          value: number;
        };
      };
    };
  };
  description?: string;
}

interface Wishlist {
  id: string;
  name: string;
  items: WishlistItem[];
  items_count: number;
}

interface SharedWishlistData {
  sharedWishlist: Wishlist;
}

interface WishlistManagerProps {
  selectedWishlistId: string;
  onSelectWishlist: (id: string) => void;
}

export const WishlistPage: React.FC = () => {
  const { sharingCode } = useParams<{ sharingCode?: string }>();
  const [selectedWishlistId, setSelectedWishlistId] = useState<string>('');
  const { wishlist: defaultWishlist, loading: wishlistLoading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCommerce();

  // Query for shared wishlist if sharing code is provided
  const { data: sharedData, loading: sharedLoading } = useQuery(
    GET_SHARED_WISHLIST,
    {
      variables: { sharingCode },
      skip: !sharingCode,
    }
  );

  const loading = wishlistLoading || sharedLoading;
  const isSharedView = Boolean(sharingCode);
  const wishlist = isSharedView ? sharedData?.sharedWishlist : 
    (selectedWishlistId ? defaultWishlist?.wishlists.find(w => w.id === selectedWishlistId) : defaultWishlist?.wishlists[0]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {isSharedView ? 'Shared Wishlist' : 'My Wishlist'}
        </h1>
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200" />
              <div className="mt-4 h-4 bg-gray-200 rounded w-3/4" />
              <div className="mt-2 h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!wishlist) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!isSharedView && wishlist.items_count === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="text-center">
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your wishlist is empty
          </h1>
          <p className="mt-4 text-base text-gray-500">
            Browse our collection and add your favorite items to your wishlist.
          </p>
          <div className="mt-6">
            <Link
              to="/products"
              className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = async (sku: string): Promise<void> => {
    try {
      await addToCart(sku, 1);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const getMetaDescription = (isShared: boolean, name: string): string => {
    return isShared
      ? `View a shared wishlist from The Wick & Wax Co.`
      : `View and manage your wishlist at The Wick & Wax Co. Save your favorite eco-friendly candles and bath products for later.`;
  };

  const getTitle = (isShared: boolean, name: string): string => {
    return isShared ? `${name} - Shared Wishlist` : 'My Wishlist';
  };

  return (
    <>
      <Helmet>
        <title>{getTitle(isSharedView, wishlist.name)}</title>
        <meta
          name="description"
          content={getMetaDescription(isSharedView, wishlist.name)}
        />
      </Helmet>

      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
          {!isSharedView && (
            <WishlistManager
              selectedWishlistId={selectedWishlistId}
              onSelectWishlist={setSelectedWishlistId}
            />
          )}

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {isSharedView ? `${wishlist.name} (Shared)` : wishlist.name}
              </h1>
              <p className="text-sm text-gray-500">
                {wishlist.items_count} {wishlist.items_count === 1 ? 'item' : 'items'}
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {wishlist.items.map((item) => (
                <div key={item.id} className="group relative">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg">
                    <img
                      src={item.product.image.url}
                      alt={item.product.image.label}
                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm text-gray-700">
                      <Link to={`/product/${item.product.url_key}`}>
                        {item.product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {item.product.price.regularPrice.amount.currency}{' '}
                      {item.product.price.regularPrice.amount.value.toFixed(2)}
                    </p>
                    {item.description && (
                      <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item.product.sku)}
                        className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        Add to Cart
                      </button>
                      {!isSharedView && (
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(item.id)}
                          className="text-sm font-medium text-gray-500 hover:text-gray-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WishlistPage;
