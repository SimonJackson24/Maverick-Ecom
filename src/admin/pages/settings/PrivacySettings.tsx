import React, { useState, useEffect } from 'react';
import { GDPRConfig } from '../../../types/gdpr';
import { Switch } from '@headlessui/react';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const defaultConfig: GDPRConfig = {
  retentionPeriods: {
    userAccounts: 730, // 2 years
    orderHistory: 1825, // 5 years
    activityLogs: 90,
    marketingData: 365,
  },
  dataProtection: {
    encryptionEnabled: true,
    dataBackupEnabled: true,
    backupFrequency: 1,
    backupRetention: 30,
  },
  cookies: {
    consentRequired: true,
    consentValidityPeriod: 180,
    defaultPreferences: {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    },
  },
  privacyNotices: {
    privacyPolicyLastUpdated: new Date().toISOString(),
    cookiePolicyLastUpdated: new Date().toISOString(),
    termsLastUpdated: new Date().toISOString(),
  },
  thirdPartyProcessors: [
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      purpose: 'Analytics',
      enabled: true,
      dataShared: ['Usage Data', 'IP Address'],
    },
  ],
  dpo: {
    name: '',
    email: '',
    phone: '',
  },
  breach: {
    notificationEmail: '',
    notificationPhone: '',
    escalationThreshold: 'medium',
  },
};

export function GDPRSettings() {
  const [config, setConfig] = useState<GDPRConfig>(defaultConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/admin/settings/gdpr');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (err) {
      setError('Failed to load GDPR settings');
    }
  };

  const saveConfig = async () => {
    setIsSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/admin/settings/gdpr', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setMessage('Settings saved successfully');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const addThirdPartyProcessor = () => {
    setConfig({
      ...config,
      thirdPartyProcessors: [
        ...config.thirdPartyProcessors,
        {
          id: `processor-${Date.now()}`,
          name: '',
          purpose: '',
          enabled: true,
          dataShared: [],
        },
      ],
    });
  };

  const removeThirdPartyProcessor = (id: string) => {
    setConfig({
      ...config,
      thirdPartyProcessors: config.thirdPartyProcessors.filter(
        (processor) => processor.id !== id
      ),
    });
  };

  const [enabled, setEnabled] = React.useState({
    cookieConsent: true,
    dataCollection: true,
    marketingEmails: false,
    thirdPartySharing: false,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {message && (
          <div className="bg-green-50 p-4 rounded-md">
            <p className="text-green-700">{message}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Data Retention */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-6">Data Retention Periods</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  User Accounts (days)
                </label>
                <input
                  type="number"
                  value={config.retentionPeriods.userAccounts}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      retentionPeriods: {
                        ...config.retentionPeriods,
                        userAccounts: parseInt(e.target.value),
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Order History (days)
                </label>
                <input
                  type="number"
                  value={config.retentionPeriods.orderHistory}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      retentionPeriods: {
                        ...config.retentionPeriods,
                        orderHistory: parseInt(e.target.value),
                      },
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Data Protection */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-6">Data Protection</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Enable Encryption
              </span>
              <Switch
                checked={config.dataProtection.encryptionEnabled}
                onChange={(checked) =>
                  setConfig({
                    ...config,
                    dataProtection: {
                      ...config.dataProtection,
                      encryptionEnabled: checked,
                    },
                  })
                }
                className={`${
                  config.dataProtection.encryptionEnabled
                    ? 'bg-indigo-600'
                    : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Enable encryption</span>
                <span
                  className={`${
                    config.dataProtection.encryptionEnabled
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>
          </div>
        </section>

        {/* Cookie Settings */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-6">Cookie Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Require Consent
              </span>
              <Switch
                checked={config.cookies.consentRequired}
                onChange={(checked) =>
                  setConfig({
                    ...config,
                    cookies: {
                      ...config.cookies,
                      consentRequired: checked,
                    },
                  })
                }
                className={`${
                  config.cookies.consentRequired ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Require consent</span>
                <span
                  className={`${
                    config.cookies.consentRequired
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>
          </div>
        </section>

        {/* Privacy Settings */}
        <section className="bg-white shadow rounded-lg p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Privacy Settings</h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your store's privacy and data collection settings.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="space-y-6">
                {/* Cookie Consent */}
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <h4 className="text-sm font-medium text-gray-900">Cookie Consent Banner</h4>
                    <p className="text-sm text-gray-500">
                      Display a cookie consent banner to visitors and collect their preferences.
                    </p>
                  </div>
                  <Switch
                    checked={enabled.cookieConsent}
                    onChange={(value) => setEnabled({ ...enabled, cookieConsent: value })}
                    className={`${
                      enabled.cookieConsent ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span className="sr-only">Enable cookie consent banner</span>
                    <span
                      aria-hidden="true"
                      className={`${
                        enabled.cookieConsent ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </Switch>
                </div>

                {/* Data Collection */}
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <h4 className="text-sm font-medium text-gray-900">Data Collection</h4>
                    <p className="text-sm text-gray-500">
                      Collect anonymous usage data to improve our services.
                    </p>
                  </div>
                  <Switch
                    checked={enabled.dataCollection}
                    onChange={(value) => setEnabled({ ...enabled, dataCollection: value })}
                    className={`${
                      enabled.dataCollection ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span className="sr-only">Enable data collection</span>
                    <span
                      aria-hidden="true"
                      className={`${
                        enabled.dataCollection ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </Switch>
                </div>

                {/* Marketing Emails */}
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <h4 className="text-sm font-medium text-gray-900">Marketing Emails</h4>
                    <p className="text-sm text-gray-500">
                      Send marketing emails to customers who have opted in.
                    </p>
                  </div>
                  <Switch
                    checked={enabled.marketingEmails}
                    onChange={(value) => setEnabled({ ...enabled, marketingEmails: value })}
                    className={`${
                      enabled.marketingEmails ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span className="sr-only">Enable marketing emails</span>
                    <span
                      aria-hidden="true"
                      className={`${
                        enabled.marketingEmails ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </Switch>
                </div>

                {/* Third Party Data Sharing */}
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <h4 className="text-sm font-medium text-gray-900">Third Party Data Sharing</h4>
                    <p className="text-sm text-gray-500">
                      Share customer data with trusted third-party services.
                    </p>
                  </div>
                  <Switch
                    checked={enabled.thirdPartySharing}
                    onChange={(value) => setEnabled({ ...enabled, thirdPartySharing: value })}
                    className={`${
                      enabled.thirdPartySharing ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span className="sr-only">Enable third party data sharing</span>
                    <span
                      aria-hidden="true"
                      className={`${
                        enabled.thirdPartySharing ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </Switch>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Third-Party Processors */}
        <section className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">Third-Party Processors</h2>
            <button
              type="button"
              onClick={addThirdPartyProcessor}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Processor
            </button>
          </div>
          <div className="space-y-4">
            {config.thirdPartyProcessors.map((processor) => (
              <div
                key={processor.id}
                className="border border-gray-200 rounded-md p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-grow space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        value={processor.name}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            thirdPartyProcessors: config.thirdPartyProcessors.map(
                              (p) =>
                                p.id === processor.id
                                  ? { ...p, name: e.target.value }
                                  : p
                            ),
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Purpose
                      </label>
                      <input
                        type="text"
                        value={processor.purpose}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            thirdPartyProcessors: config.thirdPartyProcessors.map(
                              (p) =>
                                p.id === processor.id
                                  ? { ...p, purpose: e.target.value }
                                  : p
                            ),
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeThirdPartyProcessor(processor.id)}
                    className="ml-4 text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DPO Information */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-6">Data Protection Officer</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={config.dpo.name}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    dpo: {
                      ...config.dpo,
                      name: e.target.value,
                    },
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={config.dpo.email}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    dpo: {
                      ...config.dpo,
                      email: e.target.value,
                    },
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={saveConfig}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GDPRSettings;
