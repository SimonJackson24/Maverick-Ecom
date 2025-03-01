import React, { createContext, useContext, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_WISHLISTS,
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
  CREATE_WISHLIST,
  UPDATE_WISHLIST,
  DELETE_WISHLIST,
} from '../graphql/wishlist';
import { trackWishlistAction } from '../services/analytics/wishlistAnalytics';

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  addedAt: string;
}

interface Wishlist {
  id: string;
  name: string;
  items: WishlistItem[];
  itemsCount: number;
  sharingCode?: string;
  createdAt: string;
  updatedAt: string;
}

interface WishlistContextType {
  wishlists: Wishlist[];
  selectedWishlist: Wishlist | null;
  loading: boolean;
  error: Error | null;
  addToWishlist: (productId: string, wishlistId: string) => Promise<void>;
  removeFromWishlist: (itemId: string, wishlistId: string) => Promise<void>;
  createWishlist: (name: string) => Promise<Wishlist>;
  updateWishlist: (id: string, name: string) => Promise<Wishlist>;
  deleteWishlist: (id: string) => Promise<void>;
  selectWishlist: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedWishlist, setSelectedWishlist] = useState<Wishlist | null>(null);
  const { data, loading, error } = useQuery<{ wishlists: Wishlist[] }>(GET_WISHLISTS);
  
  const [addToWishlistMutation] = useMutation(ADD_TO_WISHLIST);
  const [removeFromWishlistMutation] = useMutation(REMOVE_FROM_WISHLIST);
  const [createWishlistMutation] = useMutation<{ createWishlist: Wishlist }>(CREATE_WISHLIST);
  const [updateWishlistMutation] = useMutation<{ updateWishlist: Wishlist }>(UPDATE_WISHLIST);
  const [deleteWishlistMutation] = useMutation(DELETE_WISHLIST);

  const wishlists = data?.wishlists || [];

  const addToWishlist = async (productId: string, wishlistId: string) => {
    try {
      await addToWishlistMutation({
        variables: { productId, wishlistId },
        refetchQueries: [{ query: GET_WISHLISTS }]
      });
      trackWishlistAction('add_item', { productId, wishlistId });
    } catch (err) {
      console.error('Error adding item to wishlist:', err);
      throw err;
    }
  };

  const removeFromWishlist = async (itemId: string, wishlistId: string) => {
    try {
      await removeFromWishlistMutation({
        variables: { itemId, wishlistId },
        refetchQueries: [{ query: GET_WISHLISTS }]
      });
      trackWishlistAction('remove_item', { itemId, wishlistId });
    } catch (err) {
      console.error('Error removing item from wishlist:', err);
      throw err;
    }
  };

  const createWishlist = async (name: string): Promise<Wishlist> => {
    try {
      const { data } = await createWishlistMutation({
        variables: { name },
        refetchQueries: [{ query: GET_WISHLISTS }]
      });
      trackWishlistAction('create_wishlist', { name });
      return data?.createWishlist;
    } catch (err) {
      console.error('Error creating wishlist:', err);
      throw err;
    }
  };

  const updateWishlist = async (id: string, name: string): Promise<Wishlist> => {
    try {
      const { data } = await updateWishlistMutation({
        variables: { id, name },
        refetchQueries: [{ query: GET_WISHLISTS }]
      });
      trackWishlistAction('update_wishlist', { id, name });
      return data?.updateWishlist;
    } catch (err) {
      console.error('Error updating wishlist:', err);
      throw err;
    }
  };

  const deleteWishlist = async (id: string) => {
    try {
      await deleteWishlistMutation({
        variables: { id },
        refetchQueries: [{ query: GET_WISHLISTS }]
      });
    } catch (err) {
      console.error('Error deleting wishlist:', err);
      throw err;
    }
  };

  const selectWishlist = (id: string) => {
    const wishlist = wishlists.find((w: Wishlist) => w.id === id);
    setSelectedWishlist(wishlist || null);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlists,
        selectedWishlist,
        loading,
        error,
        addToWishlist,
        removeFromWishlist,
        createWishlist,
        updateWishlist,
        deleteWishlist,
        selectWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
