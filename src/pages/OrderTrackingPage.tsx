import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  GET_CUSTOMER_ORDERS, 
  GET_ORDER_DETAILS,
  REORDER_ITEMS 
} from '../graphql/orders';
import { formatDate } from '../utils/dateUtils';
import { 
  TruckIcon, 
  ShoppingCartIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

const OrderTrackingTimeline: React.FC<{ shipments: any[] }> = ({ shipments }) => {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {shipments.map((shipment, index) => (
          <li key={shipment.id}>
            <div className="relative pb-8">
              {index < shipments.length - 1 && (
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center ring-8 ring-white">
                    <TruckIcon className="h-5 w-5 text-primary-600" aria-hidden="true" />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      {shipment.tracking.status} via {shipment.tracking.carrier}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Tracking: {shipment.tracking.number}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const OrderTrackingPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber?: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const { data: ordersData, loading: ordersLoading } = useQuery(GET_CUSTOMER_ORDERS, {
    variables: { pageSize, currentPage },
    skip: Boolean(orderNumber),
  });

  const { data: orderData, loading: orderLoading } = useQuery(GET_ORDER_DETAILS, {
    variables: { orderNumber },
    skip: !orderNumber,
  });

  const [reorderItems, { loading: reorderLoading }] = useMutation(REORDER_ITEMS, {
    onCompleted: () => {
      navigate('/cart');
    },
  });

  const loading = ordersLoading || orderLoading;
  const order = orderData?.customer?.order;
  const orders = ordersData?.customer?.orders;

  const handleReorder = async (orderNumber: string) => {
    try {
      await reorderItems({ variables: { orderNumber } });
    } catch (error) {
      console.error('Error reordering items:', error);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 p-6 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (orderNumber && !order) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">Order Not Found</h2>
          <p className="mt-1 text-sm text-gray-500">
            We couldn't find the order you're looking for. Please check the order number and try again.
          </p>
          <div className="mt-6">
            <Link
              to="/orders"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View All Orders
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderNumber && order) {
    return (
      <>
        <Helmet>
          <title>Order #{orderNumber} | The Wick & Wax Co</title>
          <meta
            name="description"
            content={`Track your order #${orderNumber} from The Wick & Wax Co. View order status, shipping details, and delivery updates.`}
          />
        </Helmet>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-8">
            <Link
              to="/orders"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              ← Back to Orders
            </Link>
          </div>

          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
            <div className="px-4 py-6 sm:px-6">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-medium leading-6 text-gray-900">
                  Order #{order.number}
                </h1>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Placed on {formatDate(order.order_date)}
              </div>
            </div>

            <div className="border-t border-gray-100 px-4 py-6 sm:px-6">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Shipping Information
              </h2>
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Delivery Address</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>{order.shipping_address.firstname} {order.shipping_address.lastname}</p>
                    <p>{order.shipping_address.street}</p>
                    <p>
                      {order.shipping_address.city}, {order.shipping_address.region}{' '}
                      {order.shipping_address.postcode}
                    </p>
                    <p>{order.shipping_address.telephone}</p>
                  </div>
                </div>

                {order.shipments && order.shipments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Tracking Information</h3>
                    <div className="mt-2">
                      <OrderTrackingTimeline shipments={order.shipments} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 px-4 py-6 sm:px-6">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Order Items</h2>
              <ul role="list" className="mt-4 divide-y divide-gray-100">
                {order.items.map((item: any) => (
                  <li key={item.id} className="py-4">
                    <div className="flex items-center gap-x-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          <Link to={`/product/${item.product_url_key}`}>
                            {item.product_name}
                          </Link>
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Qty: {item.quantity_ordered} × ${item.product_sale_price.value}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ${(item.quantity_ordered * item.product_sale_price.value).toFixed(2)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${order.total.subtotal.value}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Shipping</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${order.total.total_shipping.value}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Tax</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${order.total.total_tax.value}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <dt className="text-base font-medium text-gray-900">Order Total</dt>
                  <dd className="text-base font-medium text-gray-900">
                    ${order.total.grand_total.value}
                  </dd>
                </div>
              </dl>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => handleReorder(order.number)}
                  disabled={reorderLoading}
                  className="w-full rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reorderLoading ? 'Adding to Cart...' : 'Reorder Items'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Orders | The Wick & Wax Co</title>
        <meta
          name="description"
          content="View and track your orders from The Wick & Wax Co. Check order status, shipping information, and reorder your favorite items."
        />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Order History
        </h1>

        {orders?.items.length === 0 ? (
          <div className="mt-16 text-center">
            <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h2>
            <p className="mt-1 text-sm text-gray-500">
              Start shopping to create your first order
            </p>
            <div className="mt-6">
              <Link
                to="/products"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Browse Products
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Order #
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Date
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Status
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Total
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {orders.items.map((order: any) => (
                          <tr key={order.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {order.number}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {formatDate(order.order_date)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <OrderStatusBadge status={order.status} />
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              ${order.total.grand_total.value}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <Link
                                to={`/orders/${order.number}`}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                View Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {orders.page_info.total_pages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {orders.page_info.total_pages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === orders.page_info.total_pages}
                  className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
