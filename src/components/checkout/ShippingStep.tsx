import React, { useState } from 'react';
import { useGuestCheckout } from '../../store/GuestCheckoutContext';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ShippingMethod {
  carrier_code: string;
  carrier_title: string;
  method_code: string;
  method_title: string;
  amount: {
    value: number;
    currency: string;
  };
}

export const ShippingStep: React.FC<{
  availableShippingMethods: ShippingMethod[];
}> = ({ availableShippingMethods }) => {
  const { state, setShippingAddress, setShippingMethod } = useGuestCheckout();
  const [formData, setFormData] = useState({
    firstname: state.shippingAddress?.firstname || '',
    lastname: state.shippingAddress?.lastname || '',
    street1: state.shippingAddress?.street[0] || '',
    street2: state.shippingAddress?.street[1] || '',
    city: state.shippingAddress?.city || '',
    region: state.shippingAddress?.region || '',
    postcode: state.shippingAddress?.postcode || '',
    countryCode: state.shippingAddress?.countryCode || 'US',
    telephone: state.shippingAddress?.telephone || '',
  });

  const [selectedMethod, setSelectedMethod] = useState(
    state.shippingMethod?.carrierCode
      ? `${state.shippingMethod.carrierCode}_${state.shippingMethod.methodCode}`
      : ''
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await setShippingAddress({
        firstname: formData.firstname,
        lastname: formData.lastname,
        street: [formData.street1, formData.street2].filter(Boolean),
        city: formData.city,
        region: formData.region,
        postcode: formData.postcode,
        countryCode: formData.countryCode,
        telephone: formData.telephone,
      });

      if (selectedMethod) {
        const [carrierCode, methodCode] = selectedMethod.split('_');
        await setShippingMethod(carrierCode, methodCode);
      }
    } catch (error) {
      console.error('Error saving shipping information:', error);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:max-w-7xl">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
          <p className="mt-1 text-sm text-gray-500">
            Please enter your shipping address and select a shipping method.
          </p>
        </div>

        {state.error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon
                  className="h-5 w-5 text-red-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{state.error}</h3>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-gray-700"
              >
                First name
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                required
                value={formData.firstname}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-700"
              >
                Last name
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                required
                value={formData.lastname}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="street1"
                className="block text-sm font-medium text-gray-700"
              >
                Street address
              </label>
              <input
                type="text"
                id="street1"
                name="street1"
                required
                value={formData.street1}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="street2"
                className="block text-sm font-medium text-gray-700"
              >
                Apartment, suite, etc.
              </label>
              <input
                type="text"
                id="street2"
                name="street2"
                value={formData.street2}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="region"
                className="block text-sm font-medium text-gray-700"
              >
                State / Province
              </label>
              <input
                type="text"
                id="region"
                name="region"
                required
                value={formData.region}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="postcode"
                className="block text-sm font-medium text-gray-700"
              >
                ZIP / Postal code
              </label>
              <input
                type="text"
                id="postcode"
                name="postcode"
                required
                value={formData.postcode}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="telephone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone number
              </label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                required
                value={formData.telephone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Shipping Method</h3>
            <div className="mt-4 space-y-4">
              {availableShippingMethods.map((method) => (
                <div key={`${method.carrier_code}_${method.method_code}`} className="flex items-center">
                  <input
                    id={`${method.carrier_code}_${method.method_code}`}
                    name="shipping_method"
                    type="radio"
                    required
                    checked={selectedMethod === `${method.carrier_code}_${method.method_code}`}
                    onChange={(e) => setSelectedMethod(e.target.id)}
                    className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label
                    htmlFor={`${method.carrier_code}_${method.method_code}`}
                    className="ml-3 flex items-center justify-between flex-1"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {method.carrier_title} - {method.method_title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {method.carrier_code === 'ups' ? '2-5 business days' : 'Delivery time varies'}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {method.amount.currency} {method.amount.value.toFixed(2)}
                    </p>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Back to Cart
            </button>
            <button
              type="submit"
              disabled={state.loading}
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.loading ? 'Saving...' : 'Continue to Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
