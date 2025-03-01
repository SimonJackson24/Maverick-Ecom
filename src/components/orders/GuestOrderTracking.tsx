import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { TRACK_ORDER } from '../../graphql/orders';
import { ExclamationTriangleIcon, TruckIcon } from '@heroicons/react/24/outline';

interface GuestOrderTrackingProps {
  onOrderFound?: (orderNumber: string) => void;
}

export const GuestOrderTracking: React.FC<GuestOrderTrackingProps> = ({ onOrderFound }) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const [trackOrder, { loading, data }] = useLazyQuery(TRACK_ORDER, {
    onError: (error) => {
      setError('Unable to find your order. Please check your order number and email.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!orderNumber.trim() || !email.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await trackOrder({ variables: { orderNumber: orderNumber.trim() } });
      if (onOrderFound) {
        onOrderFound(orderNumber.trim());
      }
    } catch (error) {
      console.error('Error tracking order:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600';
      case 'in_transit':
        return 'text-blue-600';
      case 'pending':
        return 'text-yellow-600';
      case 'exception':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white px-6 py-8 shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg sm:px-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Track Your Order
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Enter your order number and email to track your order status.
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <ExclamationTriangleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="orderNumber"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Order Number
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                placeholder="e.g., 000000123"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email Address
            </label>
            <div className="mt-2">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                placeholder="you@example.com"
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Tracking Order...' : 'Track Order'}
          </button>
        </div>
      </form>

      {data?.customer?.order && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900">
            Order Status: {data.customer.order.status}
          </h3>
          
          {data.customer.order.shipments?.length > 0 && (
            <div className="mt-6 flow-root">
              <ul role="list" className="-mb-8">
                {data.customer.order.shipments.map((shipment: any, index: number) => (
                  <li key={shipment.id}>
                    <div className="relative pb-8">
                      {index < data.customer.order.shipments.length - 1 && (
                        <span
                          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-${getStatusColor(
                              shipment.tracking.status
                            )}-100`}
                          >
                            <TruckIcon
                              className={`h-5 w-5 ${getStatusColor(shipment.tracking.status)}`}
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">
                              {shipment.tracking.status} via {shipment.tracking.carrier}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              Tracking Number: {shipment.tracking.number}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
