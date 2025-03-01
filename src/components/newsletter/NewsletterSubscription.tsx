import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SUBSCRIBE_TO_NEWSLETTER } from '../../graphql/newsletter';
import { analytics } from '../../services/analytics/unifiedAnalytics';

interface NewsletterSubscriptionProps {
  location?: string;
  onSuccess?: () => void;
}

export const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({
  location = 'footer',
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState({
    productUpdates: true,
    scentNews: true,
    specialOffers: true,
    sustainability: true
  });
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [subscribeToNewsletter, { loading }] = useMutation(SUBSCRIBE_TO_NEWSLETTER, {
    onCompleted: (data) => {
      if (data.subscribeToNewsletter.success) {
        setSubscribeStatus('success');
        setEmail('');
        analytics.track('newsletter_subscription', {
          location,
          preferences,
          status: 'success'
        });
        onSuccess?.();
      } else {
        setSubscribeStatus('error');
        analytics.track('newsletter_subscription', {
          location,
          preferences,
          status: 'error',
          error: data.subscribeToNewsletter.message
        });
      }
    },
    onError: (error) => {
      setSubscribeStatus('error');
      analytics.track('newsletter_subscription', {
        location,
        preferences,
        status: 'error',
        error: error.message
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeStatus('idle');

    analytics.track('newsletter_subscription_attempt', {
      location,
      preferences
    });

    await subscribeToNewsletter({
      variables: {
        input: {
          email,
          preferences: {
            product_updates: preferences.productUpdates,
            scent_news: preferences.scentNews,
            special_offers: preferences.specialOffers,
            sustainability: preferences.sustainability
          }
        }
      }
    });
  };

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));

    analytics.track('newsletter_preference_changed', {
      location,
      preference: key,
      value: !preferences[key]
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Stay Updated with Wick & Wax Co
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">I'm interested in:</p>
          
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.productUpdates}
                onChange={() => togglePreference('productUpdates')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">New product launches</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.scentNews}
                onChange={() => togglePreference('scentNews')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Scent trends and news</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.specialOffers}
                onChange={() => togglePreference('specialOffers')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Special offers and discounts</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.sustainability}
                onChange={() => togglePreference('sustainability')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Sustainability initiatives</span>
            </label>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
              ${loading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>

        {subscribeStatus === 'success' && (
          <p className="mt-2 text-sm text-green-600">
            Thanks for subscribing! Please check your email to confirm your subscription.
          </p>
        )}

        {subscribeStatus === 'error' && (
          <p className="mt-2 text-sm text-red-600">
            Sorry, there was an error subscribing. Please try again.
          </p>
        )}

        <p className="mt-2 text-xs text-gray-500">
          By subscribing, you agree to receive marketing emails from Wick & Wax Co.
          You can unsubscribe at any time. View our Privacy Policy for more information.
        </p>
      </form>
    </div>
  );
};
