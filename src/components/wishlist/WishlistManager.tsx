import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_WISHLISTS,
  CREATE_WISHLIST,
  UPDATE_WISHLIST,
} from '../../graphql/wishlist';
import { trackWishlistEvent } from '../../services/analytics/wishlistAnalytics';

interface WishlistManagerProps {
  onSelectWishlist: (id: string) => void;
  selectedWishlistId?: string;
}

interface Wishlist {
  id: string;
  name: string;
  items_count: number;
  sharing_code: string;
}

export const WishlistManager: React.FC<WishlistManagerProps> = ({
  onSelectWishlist,
  selectedWishlistId,
}) => {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isShareOpen, setIsShareOpen] = React.useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = React.useState(false);
  const [newWishlistName, setNewWishlistName] = React.useState('');
  const [analyticsData, setAnalyticsData] = React.useState<any>(null);

  const { data, loading } = useQuery(GET_WISHLISTS);
  const [createWishlist] = useMutation(CREATE_WISHLIST);
  const [updateWishlist] = useMutation(UPDATE_WISHLIST);

  const wishlists = data?.customer?.wishlists || [];
  const selectedWishlist = wishlists.find((w: Wishlist) => w.id === selectedWishlistId);

  const handleCreateWishlist = async () => {
    try {
      const { data } = await createWishlist({
        variables: {
          name: newWishlistName,
          visibility: 'PRIVATE'
        }
      });
      
      await trackWishlistEvent({
        eventType: 'create_wishlist',
        wishlistId: data.createWishlist.wishlist.id,
        wishlistName: newWishlistName,
        timestamp: new Date().toISOString(),
      });

      setIsCreateOpen(false);
      setNewWishlistName('');
    } catch (error) {
      console.error('Error creating wishlist:', error);
    }
  };

  const handleShareWishlist = async () => {
    if (!selectedWishlist) return;

    try {
      await updateWishlist({
        variables: {
          wishlistId: selectedWishlist.id,
          name: selectedWishlist.name,
          visibility: 'PUBLIC'
        }
      });

      await trackWishlistEvent({
        eventType: 'share_wishlist',
        wishlistId: selectedWishlist.id,
        wishlistName: selectedWishlist.name,
        timestamp: new Date().toISOString(),
      });

      const shareUrl = `${window.location.origin}/wishlist/shared/${selectedWishlist.sharing_code}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `${selectedWishlist.name} - The Wick & Wax Co Wishlist`,
          text: 'Check out my wishlist from The Wick & Wax Co!',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        // Show toast notification
      }

      setIsShareOpen(false);
    } catch (error) {
      console.error('Error sharing wishlist:', error);
    }
  };

  const handleViewAnalytics = async () => {
    if (!selectedWishlist) return;

    try {
      const analytics = await getWishlistAnalytics(selectedWishlist.id);
      setAnalyticsData(analytics);
      setIsAnalyticsOpen(true);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleWishlistSelect = (w: Wishlist) => {
    onSelectWishlist(w.id);
  };

  if (loading) {
    return <div className="animate-pulse">Loading wishlists...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={selectedWishlistId}
            onChange={(e) => onSelectWishlist(e.target.value)}
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
          >
            {wishlists.map((wishlist: Wishlist) => (
              <option key={wishlist.id} value={wishlist.id}>
                {wishlist.name} ({wishlist.items_count})
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            New Wishlist
          </button>
        </div>

        {selectedWishlist && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsShareOpen(true)}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <ShareIcon className="mr-2 h-4 w-4" />
              Share
            </button>
            <button
              onClick={handleViewAnalytics}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <ChartBarIcon className="mr-2 h-4 w-4" />
              Analytics
            </button>
          </div>
        )}
      </div>

      {/* Create Wishlist Dialog */}
      <Dialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Create New Wishlist
            </Dialog.Title>
            <div className="mt-4">
              <input
                type="text"
                value={newWishlistName}
                onChange={(e) => setNewWishlistName(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Wishlist Name"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWishlist}
                disabled={!newWishlistName.trim()}
                className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog
        open={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg rounded-lg bg-white p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Wishlist Analytics
            </Dialog.Title>
            {analyticsData && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Total Items</p>
                    <p className="text-2xl font-semibold">{analyticsData.totalItems}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Total Value</p>
                    <p className="text-2xl font-semibold">${analyticsData.totalValue}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Share Count</p>
                    <p className="text-2xl font-semibold">{analyticsData.shareCount}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Conversion Rate</p>
                    <p className="text-2xl font-semibold">{analyticsData.conversionRate}%</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900">Most Added Products</h4>
                  <ul className="mt-2 divide-y divide-gray-200">
                    {analyticsData.mostAddedProducts.map((product: any) => (
                      <li key={product.sku} className="py-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">{product.name}</p>
                          <p className="text-sm font-medium text-gray-900">
                            Added {product.addCount} times
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsAnalyticsOpen(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};
