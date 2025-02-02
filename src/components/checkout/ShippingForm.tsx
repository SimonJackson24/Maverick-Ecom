import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ShippingAddress } from '../../types/commerce';

interface ShippingFormProps {
  initialValues?: Partial<ShippingAddress>;
  onSubmit: (values: ShippingAddress) => void;
}

const validationSchema = Yup.object({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  streetAddress1: Yup.string().required('Required'),
  city: Yup.string().required('Required'),
  region: Yup.string().required('Required'),
  postcode: Yup.string().required('Required'),
  telephone: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
});

export const ShippingForm: React.FC<ShippingFormProps> = ({ initialValues, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      firstName: initialValues?.firstName || '',
      lastName: initialValues?.lastName || '',
      company: initialValues?.company || '',
      streetAddress1: initialValues?.streetAddress1 || '',
      streetAddress2: initialValues?.streetAddress2 || '',
      city: initialValues?.city || '',
      region: initialValues?.region || '',
      postcode: initialValues?.postcode || '',
      telephone: initialValues?.telephone || '',
      email: initialValues?.email || '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values as ShippingAddress);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First name
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="firstName"
              {...formik.getFieldProps('firstName')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.firstName}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last name
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="lastName"
              {...formik.getFieldProps('lastName')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="mt-1">
            <input
              type="email"
              id="email"
              {...formik.getFieldProps('email')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
            )}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Company (optional)
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="company"
              {...formik.getFieldProps('company')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="streetAddress1" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="streetAddress1"
              {...formik.getFieldProps('streetAddress1')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            {formik.touched.streetAddress1 && formik.errors.streetAddress1 && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.streetAddress1}</p>
            )}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="streetAddress2" className="block text-sm font-medium text-gray-700">
            Apartment, suite, etc. (optional)
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="streetAddress2"
              {...formik.getFieldProps('streetAddress2')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="city"
              {...formik.getFieldProps('city')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            {formik.touched.city && formik.errors.city && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.city}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700">
            State / Province
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="region"
              {...formik.getFieldProps('region')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            {formik.touched.region && formik.errors.region && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.region}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
            Postal code
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="postcode"
              {...formik.getFieldProps('postcode')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            {formik.touched.postcode && formik.errors.postcode && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.postcode}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <div className="mt-1">
            <input
              type="tel"
              id="telephone"
              {...formik.getFieldProps('telephone')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            {formik.touched.telephone && formik.errors.telephone && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.telephone}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Continue to shipping
        </button>
      </div>
    </form>
  );
};
