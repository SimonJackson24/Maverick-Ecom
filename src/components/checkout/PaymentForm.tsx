import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { PaymentMethod } from '../../types/commerce';

interface PaymentFormProps {
  onSubmit: (values: PaymentMethod) => void;
}

const validationSchema = Yup.object({
  cardNumber: Yup.string()
    .required('Required')
    .matches(/^[0-9]{16}$/, 'Must be 16 digits'),
  expiryMonth: Yup.string()
    .required('Required')
    .matches(/^(0[1-9]|1[0-2])$/, 'Must be a valid month (01-12)'),
  expiryYear: Yup.string()
    .required('Required')
    .matches(/^[0-9]{4}$/, 'Must be a valid year (YYYY)'),
  cvv: Yup.string()
    .required('Required')
    .matches(/^[0-9]{3,4}$/, 'Must be 3 or 4 digits'),
  nameOnCard: Yup.string().required('Required'),
});

export const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      nameOnCard: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values as PaymentMethod);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700">
          Name on card
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="nameOnCard"
            {...formik.getFieldProps('nameOnCard')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
          {formik.touched.nameOnCard && formik.errors.nameOnCard && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.nameOnCard}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
          Card number
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="cardNumber"
            maxLength={16}
            placeholder="0000 0000 0000 0000"
            {...formik.getFieldProps('cardNumber')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
          {formik.touched.cardNumber && formik.errors.cardNumber && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.cardNumber}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-x-4">
        <div className="col-span-1">
          <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700">
            Month
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="expiryMonth"
              maxLength={2}
              placeholder="MM"
              {...formik.getFieldProps('expiryMonth')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            {formik.touched.expiryMonth && formik.errors.expiryMonth && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.expiryMonth}</p>
            )}
          </div>
        </div>

        <div className="col-span-1">
          <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700">
            Year
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="expiryYear"
              maxLength={4}
              placeholder="YYYY"
              {...formik.getFieldProps('expiryYear')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            {formik.touched.expiryYear && formik.errors.expiryYear && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.expiryYear}</p>
            )}
          </div>
        </div>

        <div className="col-span-1">
          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
            CVV
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="cvv"
              maxLength={4}
              placeholder="123"
              {...formik.getFieldProps('cvv')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            {formik.touched.cvv && formik.errors.cvv && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.cvv}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Place order
        </button>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-gray-500">Secure payment provided by Stripe</span>
          </div>
        </div>
      </div>
    </form>
  );
};
