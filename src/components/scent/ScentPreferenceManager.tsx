import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { 
  UPDATE_CUSTOMER_SCENT_PREFERENCES,
  GET_SCENT_CATEGORIES 
} from '../../graphql/scent';
import { useAnalytics } from '../../hooks/useAnalytics';
import type { 
  CustomerScentPreferences,
  ScentIntensity,
  Season,
  ScentCategory 
} from '../../types/scent';

interface ScentPreferenceManagerProps {
  onPreferencesUpdated?: (preferences: CustomerScentPreferences) => void;
}

export const ScentPreferenceManager: React.FC<ScentPreferenceManagerProps> = ({
  onPreferencesUpdated
}) => {
  const analytics = useAnalytics();
  const [preferences, setPreferences] = useState<CustomerScentPreferences>({
    favorite_notes: [],
    preferred_intensity: [],
    seasonal_preferences: [],
    avoided_notes: []
  });

  // Fetch scent categories for the note selection
  const { data: categoriesData } = useQuery(GET_SCENT_CATEGORIES);
  
  // Update preferences mutation
  const [updatePreferences, { loading }] = useMutation(
    UPDATE_CUSTOMER_SCENT_PREFERENCES,
    {
      onCompleted: (data) => {
        if (data?.updateCustomerScentPreferences?.success) {
          onPreferencesUpdated?.(data.updateCustomerScentPreferences.customer.scent_preferences);
          analytics.track('scent_preferences_updated', {
            preferences: data.updateCustomerScentPreferences.customer.scent_preferences
          });
        }
      }
    }
  );

  const intensityOptions: ScentIntensity[] = ['LIGHT', 'MODERATE', 'STRONG'];
  const seasonOptions: Season[] = ['SPRING', 'SUMMER', 'FALL', 'WINTER'];

  const handleNoteToggle = (note: string, type: 'favorite' | 'avoided') => {
    setPreferences(prev => {
      const key = type === 'favorite' ? 'favorite_notes' : 'avoided_notes';
      const current = prev[key];
      const updated = current.includes(note)
        ? current.filter(n => n !== note)
        : [...current, note];

      analytics.track('scent_note_preference_changed', {
        note,
        type,
        action: current.includes(note) ? 'removed' : 'added'
      });

      return {
        ...prev,
        [key]: updated
      };
    });
  };

  const handleIntensityToggle = (intensity: ScentIntensity) => {
    setPreferences(prev => {
      const current = prev.preferred_intensity;
      const updated = current.includes(intensity)
        ? current.filter(i => i !== intensity)
        : [...current, intensity];

      analytics.track('scent_intensity_preference_changed', {
        intensity,
        action: current.includes(intensity) ? 'removed' : 'added'
      });

      return {
        ...prev,
        preferred_intensity: updated
      };
    });
  };

  const handleSeasonToggle = (season: Season) => {
    setPreferences(prev => {
      const current = prev.seasonal_preferences;
      const updated = current.includes(season)
        ? current.filter(s => s !== season)
        : [...current, season];

      analytics.track('scent_season_preference_changed', {
        season,
        action: current.includes(season) ? 'removed' : 'added'
      });

      return {
        ...prev,
        seasonal_preferences: updated
      };
    });
  };

  const handleSave = () => {
    updatePreferences({
      variables: {
        input: preferences
      }
    });
  };

  const renderNoteSelector = (category: ScentCategory, type: 'favorite' | 'avoided') => (
    <div key={category.id} className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">{category.name}</h4>
      <div className="flex flex-wrap gap-2">
        {category.children?.map(subcategory => (
          <button
            key={subcategory.id}
            onClick={() => handleNoteToggle(subcategory.name, type)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
              ${preferences[type === 'favorite' ? 'favorite_notes' : 'avoided_notes'].includes(subcategory.name)
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            {subcategory.name}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-6 bg-white rounded-lg shadow-sm">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Scent Preferences</h2>
        <p className="text-sm text-gray-500">
          Customize your scent preferences to get personalized recommendations
        </p>
      </div>

      {/* Favorite Notes */}
      <div className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">Favorite Notes</h3>
        <div className="space-y-4">
          {categoriesData?.scentCategories.map(category =>
            renderNoteSelector(category, 'favorite')
          )}
        </div>
      </div>

      {/* Avoided Notes */}
      <div className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">Notes to Avoid</h3>
        <div className="space-y-4">
          {categoriesData?.scentCategories.map(category =>
            renderNoteSelector(category, 'avoided')
          )}
        </div>
      </div>

      {/* Intensity Preferences */}
      <div className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">Preferred Intensity</h3>
        <div className="flex flex-wrap gap-2">
          {intensityOptions.map(intensity => (
            <button
              key={intensity}
              onClick={() => handleIntensityToggle(intensity)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${preferences.preferred_intensity.includes(intensity)
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              {intensity}
            </button>
          ))}
        </div>
      </div>

      {/* Seasonal Preferences */}
      <div className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">Seasonal Preferences</h3>
        <div className="flex flex-wrap gap-2">
          {seasonOptions.map(season => (
            <button
              key={season}
              onClick={() => handleSeasonToggle(season)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${preferences.seasonal_preferences.includes(season)
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              {season}
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`w-full px-4 py-2 rounded-md text-sm font-medium text-white
            ${loading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};
