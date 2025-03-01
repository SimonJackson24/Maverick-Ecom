import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GDPRService } from '../services/GDPRService';
import { useAuth } from '../store/AuthContext';

const GDPRRights: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const gdprService = GDPRService.getInstance();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [marketingPreferences, setMarketingPreferences] = useState({
    marketing: false,
    newsletter: false,
    productUpdates: false,
  });

  const handleExportData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const data = await gdprService.exportData(user.id);
      if (data) {
        // Create and download file
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gdpr-data-${user.id}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setMessage('Your data has been exported successfully.');
      }
    } catch (err) {
      setError('Failed to export your data. Please try again later.');
      console.error('Export data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id || !showDeleteConfirm) return;
    
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await gdprService.deleteAccount(user.id);
      navigate('/');
      // User will be logged out automatically by the AuthContext
      setMessage('Your account has been deleted successfully.');
    } catch (err) {
      setError('Failed to delete your account. Please try again later.');
      console.error('Delete account error:', err);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleUpdatePreferences = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await gdprService.updateMarketingPreferences(user.id, marketingPreferences);
      setMessage('Your marketing preferences have been updated successfully.');
    } catch (err) {
      setError('Failed to update your preferences. Please try again later.');
      console.error('Update preferences error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Privacy Rights</h1>
        
        {message && (
          <div className="mb-4 p-4 rounded-md bg-green-50 text-green-700">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-4 rounded-md bg-red-50 text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {/* Data Export Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Export Your Data</h2>
            <p className="text-gray-600 mb-4">
              Download a copy of your personal data in JSON format. This includes your profile information,
              order history, and other data we store about you.
            </p>
            <button
              onClick={handleExportData}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Exporting...' : 'Export Data'}
            </button>
          </section>

          {/* Marketing Preferences Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Marketing Preferences</h2>
            <p className="text-gray-600 mb-4">
              Control how we communicate with you and use your data for marketing purposes.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="marketing"
                    name="marketing"
                    type="checkbox"
                    checked={marketingPreferences.marketing}
                    onChange={(e) => setMarketingPreferences(prev => ({
                      ...prev,
                      marketing: e.target.checked
                    }))}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="marketing" className="font-medium text-gray-700">Marketing Communications</label>
                  <p className="text-gray-500">Receive marketing emails about our products and services.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="newsletter"
                    name="newsletter"
                    type="checkbox"
                    checked={marketingPreferences.newsletter}
                    onChange={(e) => setMarketingPreferences(prev => ({
                      ...prev,
                      newsletter: e.target.checked
                    }))}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="newsletter" className="font-medium text-gray-700">Newsletter</label>
                  <p className="text-gray-500">Subscribe to our weekly newsletter.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="productUpdates"
                    name="productUpdates"
                    type="checkbox"
                    checked={marketingPreferences.productUpdates}
                    onChange={(e) => setMarketingPreferences(prev => ({
                      ...prev,
                      productUpdates: e.target.checked
                    }))}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="productUpdates" className="font-medium text-gray-700">Product Updates</label>
                  <p className="text-gray-500">Receive notifications about product updates and new releases.</p>
                </div>
              </div>

              <button
                onClick={handleUpdatePreferences}
                disabled={loading}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Preferences'}
              </button>
            </div>
          </section>

          {/* Delete Account Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Delete Your Account</h2>
            <p className="text-gray-600 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Account
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-red-600 font-medium">
                  Are you sure you want to delete your account? This action cannot be undone.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {loading ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default GDPRRights;
