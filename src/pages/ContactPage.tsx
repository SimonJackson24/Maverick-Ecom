import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const offices = [
  {
    city: 'San Francisco',
    address: ['123 Market Street', 'San Francisco, CA 94105'],
    phone: '+1 (415) 555-0123',
    email: 'sf@wickandwax.co',
  },
  {
    city: 'London',
    address: ['456 Oxford Street', 'London, W1C 1AP', 'United Kingdom'],
    phone: '+44 20 7123 4567',
    email: 'london@wickandwax.co',
  },
];

const ContactPage: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      phone: Yup.string(),
      subject: Yup.string().required('Required'),
      message: Yup.string().required('Required').min(10, 'Message must be at least 10 characters'),
    }),
    onSubmit: (values) => {
      // Handle form submission
      console.log(values);
    },
  });

  return (
    <>
      <Helmet>
        <title>Contact Us | The Wick & Wax Co.</title>
        <meta
          name="description"
          content="Get in touch with The Wick & Wax Co. for questions about our sustainable candles, wholesale inquiries, or customer support."
        />
      </Helmet>

      <div className="relative isolate bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
            <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
              <div className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-gray-100 ring-1 ring-gray-900/10 lg:w-1/2">
                <svg
                  className="absolute inset-0 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern
                      id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
                      width={200}
                      height={200}
                      x="100%"
                      y={-1}
                      patternUnits="userSpaceOnUse"
                    >
                      <path d="M130 200V.5M.5 .5H200" fill="none" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" strokeWidth={0} fill="white" />
                  <svg x="100%" y={-1} className="overflow-visible fill-gray-50">
                    <path d="M-470.5 0h201v201h-201Z" strokeWidth={0} />
                  </svg>
                  <rect
                    width="100%"
                    height="100%"
                    strokeWidth={0}
                    fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Get in Touch</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Have questions about our products or interested in wholesale opportunities? We'd love to
                hear from you. Fill out the form below and we'll get back to you as soon as possible.
              </p>
              <dl className="mt-10 space-y-4 text-base leading-7 text-gray-600">
                {offices.map((office) => (
                  <div key={office.city} className="mt-8 first:mt-0">
                    <h3 className="text-lg font-semibold text-gray-900">{office.city}</h3>
                    <address className="mt-4 not-italic">
                      {office.address.map((line) => (
                        <div key={line}>{line}</div>
                      ))}
                      <div className="mt-4">
                        <a
                          href={`tel:${office.phone}`}
                          className="text-primary-600 hover:text-primary-500"
                        >
                          {office.phone}
                        </a>
                      </div>
                      <div className="mt-2">
                        <a
                          href={`mailto:${office.email}`}
                          className="text-primary-600 hover:text-primary-500"
                        >
                          {office.email}
                        </a>
                      </div>
                    </address>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={formik.handleSubmit}
            className="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48"
          >
            <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    First name
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      id="firstName"
                      {...formik.getFieldProps('firstName')}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.firstName}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Last name
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      id="lastName"
                      {...formik.getFieldProps('lastName')}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.lastName}</p>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="email"
                      id="email"
                      {...formik.getFieldProps('email')}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Phone number (optional)
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="tel"
                      id="phone"
                      {...formik.getFieldProps('phone')}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.phone}</p>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Subject
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      id="subject"
                      {...formik.getFieldProps('subject')}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    />
                    {formik.touched.subject && formik.errors.subject && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.subject}</p>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Message
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      id="message"
                      {...formik.getFieldProps('message')}
                      rows={4}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    />
                    {formik.touched.message && formik.errors.message && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.message}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-primary-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Send message
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
