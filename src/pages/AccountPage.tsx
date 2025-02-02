import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

const AccountPage: React.FC = () => {
  const { customer, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-semibold text-gray-900">My Account</h1>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Welcome back, {customer?.firstname} {customer?.lastname}
              </p>
            </div>

            {/* Tabs */}
            <div className="mt-6 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`${
                    activeTab === 'orders'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium`}
                >
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`${
                    activeTab === 'addresses'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium`}
                >
                  Addresses
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`${
                    activeTab === 'profile'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium`}
                >
                  Profile
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="mt-6">
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  {customer?.orders?.items?.length ? (
                    customer.orders.items.map((order) => (
                      <div key={order.id} className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">
                            Order #{order.number}
                          </h3>
                          <p className="text-sm text-gray-500">{order.order_date}</p>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Status: <span className="font-medium">{order.status}</span>
                          </p>
                          <p className="text-sm text-gray-500">
                            Total:{' '}
                            <span className="font-medium">
                              {order.total.grand_total.value}{' '}
                              {order.total.grand_total.currency}
                            </span>
                          </p>
                        </div>
                        <div className="mt-4">
                          <Link
                            to={`/account/orders/${order.id}`}
                            className="text-sm font-medium text-primary-600 hover:text-primary-500"
                          >
                            View order details
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">You haven't placed any orders yet.</p>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  {customer?.addresses?.length ? (
                    customer.addresses.map((address) => (
                      <div key={address.id} className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">
                            {address.firstname} {address.lastname}
                          </h3>
                          <div className="space-x-2">
                            {address.default_shipping && (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Default Shipping
                              </span>
                            )}
                            {address.default_billing && (
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                Default Billing
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">{address.street.join(', ')}</p>
                          <p className="text-sm text-gray-500">
                            {address.city}, {address.region.region} {address.postcode}
                          </p>
                          <p className="text-sm text-gray-500">{address.telephone}</p>
                        </div>
                        <div className="mt-4 space-x-4">
                          <Link
                            to={`/account/addresses/${address.id}/edit`}
                            className="text-sm font-medium text-primary-600 hover:text-primary-500"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="text-sm font-medium text-red-600 hover:text-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">You haven't added any addresses yet.</p>
                  )}
                  <div className="mt-6">
                    <Link
                      to="/account/addresses/new"
                      className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      Add new address
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                      <dl className="mt-4 space-y-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Name</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {customer?.firstname} {customer?.lastname}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Email</dt>
                          <dd className="mt-1 text-sm text-gray-900">{customer?.email}</dd>
                        </div>
                      </dl>
                      <div className="mt-6">
                        <Link
                          to="/account/profile/edit"
                          className="text-sm font-medium text-primary-600 hover:text-primary-500"
                        >
                          Edit profile
                        </Link>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Password</h3>
                      <div className="mt-4">
                        <Link
                          to="/account/password/change"
                          className="text-sm font-medium text-primary-600 hover:text-primary-500"
                        >
                          Change password
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
