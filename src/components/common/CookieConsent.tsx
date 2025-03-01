import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCookieConsent } from '../../store/CookieConsentContext';

const CookieConsent: React.FC = () => {
  const { consent, hasResponded, updateConsent, acceptAll, rejectAll } = useCookieConsent();
  const [showDetails, setShowDetails] = useState(false);

  if (hasResponded) {
    return null;
  }

  return (
    <>
      {/* Simple Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                Please accept or customize your cookie preferences.
              </p>
            </div>
            <div className="flex flex-shrink-0 gap-4">
              <button
                onClick={() => setShowDetails(true)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Customize
              </button>
              <button
                onClick={acceptAll}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Accept All
              </button>
              <button
                onClick={rejectAll}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reject All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Settings Modal */}
      <Transition show={showDetails} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => setShowDetails(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
            </Transition.Child>

            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>

            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Cookie Preferences
                  </Dialog.Title>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="necessary"
                        name="necessary"
                        type="checkbox"
                        checked={true}
                        disabled
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="necessary" className="font-medium text-gray-700">
                        Necessary Cookies
                      </label>
                      <p className="text-sm text-gray-500">
                        Essential for the website to function properly. These cannot be disabled.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="analytics"
                        name="analytics"
                        type="checkbox"
                        checked={consent.analytics}
                        onChange={(e) => updateConsent({ ...consent, analytics: e.target.checked })}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="analytics" className="font-medium text-gray-700">
                        Analytics Cookies
                      </label>
                      <p className="text-sm text-gray-500">
                        Help us understand how visitors interact with our website.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="marketing"
                        name="marketing"
                        type="checkbox"
                        checked={consent.marketing}
                        onChange={(e) => updateConsent({ ...consent, marketing: e.target.checked })}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="marketing" className="font-medium text-gray-700">
                        Marketing Cookies
                      </label>
                      <p className="text-sm text-gray-500">
                        Used to deliver personalized advertisements and track their performance.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      rejectAll();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      acceptAll();
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CookieConsent;
