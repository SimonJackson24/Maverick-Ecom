import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ScentPreferenceManager } from '../ScentPreferenceManager';
import { 
  GET_SCENT_CATEGORIES,
  UPDATE_CUSTOMER_SCENT_PREFERENCES 
} from '../../../graphql/scent';
import { useAnalytics } from '../../../hooks/useAnalytics';

// Mock the analytics hook
jest.mock('../../../hooks/useAnalytics', () => ({
  useAnalytics: jest.fn()
}));

const mockAnalytics = {
  track: jest.fn()
};

const mockCategories = {
  scentCategories: [
    {
      id: '1',
      name: 'Floral',
      description: 'Floral scents',
      children: [
        {
          id: '1-1',
          name: 'Lavender',
          description: 'Lavender notes',
          products_count: 5
        },
        {
          id: '1-2',
          name: 'Rose',
          description: 'Rose notes',
          products_count: 3
        }
      ]
    },
    {
      id: '2',
      name: 'Woody',
      description: 'Woody scents',
      children: [
        {
          id: '2-1',
          name: 'Sandalwood',
          description: 'Sandalwood notes',
          products_count: 4
        }
      ]
    }
  ]
};

const mocks = [
  {
    request: {
      query: GET_SCENT_CATEGORIES
    },
    result: {
      data: mockCategories
    }
  },
  {
    request: {
      query: UPDATE_CUSTOMER_SCENT_PREFERENCES,
      variables: {
        input: {
          favorite_notes: ['Lavender'],
          avoided_notes: [],
          preferred_intensity: ['MODERATE'],
          seasonal_preferences: ['SPRING']
        }
      }
    },
    result: {
      data: {
        updateCustomerScentPreferences: {
          success: true,
          customer: {
            id: '123',
            scent_preferences: {
              favorite_notes: ['Lavender'],
              avoided_notes: [],
              preferred_intensity: ['MODERATE'],
              seasonal_preferences: ['SPRING']
            }
          }
        }
      }
    }
  }
];

describe('ScentPreferenceManager', () => {
  beforeEach(() => {
    (useAnalytics as jest.Mock).mockReturnValue(mockAnalytics);
    mockAnalytics.track.mockClear();
  });

  it('renders all scent categories and options', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ScentPreferenceManager />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Floral')).toBeInTheDocument();
      expect(screen.getByText('Woody')).toBeInTheDocument();
      expect(screen.getByText('Lavender')).toBeInTheDocument();
      expect(screen.getByText('Rose')).toBeInTheDocument();
      expect(screen.getByText('Sandalwood')).toBeInTheDocument();
    });
  });

  it('allows selecting favorite notes', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ScentPreferenceManager />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Lavender')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Lavender'));

    expect(mockAnalytics.track).toHaveBeenCalledWith('scent_note_preference_changed', {
      note: 'Lavender',
      type: 'favorite',
      action: 'added'
    });
  });

  it('allows selecting intensity preferences', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ScentPreferenceManager />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText('MODERATE'));

    expect(mockAnalytics.track).toHaveBeenCalledWith('scent_intensity_preference_changed', {
      intensity: 'MODERATE',
      action: 'added'
    });
  });

  it('allows selecting seasonal preferences', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ScentPreferenceManager />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText('SPRING'));

    expect(mockAnalytics.track).toHaveBeenCalledWith('scent_season_preference_changed', {
      season: 'SPRING',
      action: 'added'
    });
  });

  it('saves preferences successfully', async () => {
    const onPreferencesUpdated = jest.fn();

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ScentPreferenceManager onPreferencesUpdated={onPreferencesUpdated} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Lavender')).toBeInTheDocument();
    });

    // Select preferences
    fireEvent.click(screen.getByText('Lavender'));
    fireEvent.click(screen.getByText('MODERATE'));
    fireEvent.click(screen.getByText('SPRING'));

    // Save preferences
    fireEvent.click(screen.getByText('Save Preferences'));

    await waitFor(() => {
      expect(mockAnalytics.track).toHaveBeenCalledWith('scent_preferences_updated', {
        preferences: {
          favorite_notes: ['Lavender'],
          avoided_notes: [],
          preferred_intensity: ['MODERATE'],
          seasonal_preferences: ['SPRING']
        }
      });
      expect(onPreferencesUpdated).toHaveBeenCalled();
    });
  });

  it('handles loading state correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ScentPreferenceManager />
      </MockedProvider>
    );

    const saveButton = screen.getByText('Save Preferences');
    fireEvent.click(saveButton);

    expect(saveButton).toBeDisabled();
    expect(screen.getByText('Saving...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Save Preferences')).toBeEnabled();
    });
  });
});
