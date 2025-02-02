import React from 'react';
import { Link } from 'react-router-dom';

const careSteps = [
  {
    title: 'First Burn',
    description:
      'Allow the wax to melt completely across the surface on the first burn. This typically takes 2-3 hours and prevents tunneling, ensuring even burning throughout the life of your candle.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Trim the Wick',
    description:
      'Before each use, trim the wooden wick to about 1/8 inch. This prevents smoking and ensures a clean, even burn. Use our eco-friendly wick trimmer for best results.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.331 4.331 0 0010.607 12m3.736 0l7.794 4.5-.802.215a4.5 4.5 0 01-2.48-.043l-5.326-1.629a4.324 4.324 0 01-2.068-1.379M14.343 12l-2.882 1.664" />
      </svg>
    ),
  },
  {
    title: 'Burn Time',
    description:
      'Never burn your candle for more than 4 hours at a time. This prevents overheating and extends the life of your candle. Always place on a heat-resistant surface.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      </svg>
    ),
  },
  {
    title: 'Storage',
    description:
      'Store your candles in a cool, dry place away from direct sunlight. Cover when not in use to protect the natural fragrances and prevent dust accumulation.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
];

const tips = [
  'Never leave a burning candle unattended',
  'Keep away from drafts, children, and pets',
  'Stop burning when 1/2 inch of wax remains',
  'Allow wax to cool completely before moving',
];

export const CandleCare: React.FC = () => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-lg font-semibold text-primary-600">Candle Care Guide</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Get the Most from Your Eco-Friendly Candles
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Follow these simple steps to ensure your sustainable candles burn cleanly and last longer.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Care Steps */}
            <div className="space-y-8">
              {careSteps.map((step) => (
                <div key={step.title} className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-500 text-white">
                      {step.icon}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-base text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Safety Tips and Visual Guide */}
            <div className="space-y-8">
              <div className="overflow-hidden rounded-lg bg-gray-50 p-6">
                <h3 className="text-lg font-medium text-gray-900">Important Safety Tips</h3>
                <ul className="mt-4 space-y-3">
                  {tips.map((tip) => (
                    <li key={tip} className="flex items-start">
                      <svg
                        className="mt-1 h-5 w-5 flex-shrink-0 text-primary-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-3 text-base text-gray-500">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
                <img
                  src="/images/candle-care-guide.jpg"
                  alt="Visual guide for candle care"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/candle-care"
            className="text-base font-semibold text-primary-600 hover:text-primary-500"
          >
            Learn more about candle care <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
