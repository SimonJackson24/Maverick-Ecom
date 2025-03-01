import React, { useState } from 'react';
import { DashboardFilters, DashboardSettings } from '../../../types/admin';
import { Menu, Transition } from '@headlessui/react';
import {
  AdjustmentsHorizontalIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

interface DashboardHeaderProps {
  filters: DashboardFilters;
  settings: DashboardSettings;
  onFilterChange: (filters: DashboardFilters) => void;
  onSettingsChange: (settings: DashboardSettings) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  filters,
  settings,
  onFilterChange,
  onSettingsChange,
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleDateChange = (dates: { start: Date; end: Date }) => {
    onFilterChange({
      ...filters,
      dateRange: dates,
    });
  };

  const handleComparisonChange = (comparison: string) => {
    onFilterChange({
      ...filters,
      comparison,
    });
  };

  const handleMetricVisibilityChange = (metric: string) => {
    const newVisibleMetrics = settings.visibleMetrics.includes(metric)
      ? settings.visibleMetrics.filter((m) => m !== metric)
      : [...settings.visibleMetrics, metric];

    onSettingsChange({
      ...settings,
      visibleMetrics: newVisibleMetrics,
    });
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        
        {/* Date Range Selector */}
        <div className="relative">
          <button
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
            {filters.dateRange.start.toLocaleDateString()} - {filters.dateRange.end.toLocaleDateString()}
          </button>

          <Transition
            show={isDatePickerOpen}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <div className="absolute mt-2 w-96 bg-white rounded-md shadow-lg p-4 z-10">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={filters.dateRange.start.toISOString().split('T')[0]}
                    onChange={(e) =>
                      handleDateChange({
                        start: new Date(e.target.value),
                        end: filters.dateRange.end,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={filters.dateRange.end.toISOString().split('T')[0]}
                    onChange={(e) =>
                      handleDateChange({
                        start: filters.dateRange.start,
                        end: new Date(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Compare To</label>
                <select
                  value={filters.comparison}
                  onChange={(e) => handleComparisonChange(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="day">Previous Day</option>
                  <option value="week">Previous Week</option>
                  <option value="month">Previous Month</option>
                  <option value="year">Previous Year</option>
                </select>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Metrics Visibility Menu */}
        <Menu as="div" className="relative">
          <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <ChartBarIcon className="h-5 w-5 mr-2 text-gray-400" />
            Metrics
          </Menu.Button>

          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg p-2 z-10">
              {['revenue', 'orders', 'products', 'customers', 'inventory', 'marketing', 'system'].map(
                (metric) => (
                  <Menu.Item key={metric}>
                    {({ active }) => (
                      <button
                        onClick={() => handleMetricVisibilityChange(metric)}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } group flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded-md`}
                      >
                        <input
                          type="checkbox"
                          checked={settings.visibleMetrics.includes(metric)}
                          onChange={() => {}}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-3"
                        />
                        {metric.charAt(0).toUpperCase() + metric.slice(1)}
                      </button>
                    )}
                  </Menu.Item>
                )
              )}
            </Menu.Items>
          </Transition>
        </Menu>

        {/* Settings Menu */}
        <Menu as="div" className="relative">
          <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Cog6ToothIcon className="h-5 w-5 mr-2 text-gray-400" />
            Settings
          </Menu.Button>

          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg p-2 z-10">
              <Menu.Item>
                {({ active }) => (
                  <div className="px-4 py-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Refresh Interval (seconds)
                    </label>
                    <input
                      type="number"
                      value={settings.refreshInterval / 1000}
                      onChange={(e) =>
                        onSettingsChange({
                          ...settings,
                          refreshInterval: parseInt(e.target.value) * 1000,
                        })
                      }
                      min="5"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div className="px-4 py-2">
                    <label className="block text-sm font-medium text-gray-700">Chart Type</label>
                    <select
                      value={settings.chartPreferences.type}
                      onChange={(e) =>
                        onSettingsChange({
                          ...settings,
                          chartPreferences: {
                            ...settings.chartPreferences,
                            type: e.target.value,
                          },
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="line">Line</option>
                      <option value="bar">Bar</option>
                      <option value="area">Area</option>
                    </select>
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div className="px-4 py-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.chartPreferences.showLegend}
                        onChange={(e) =>
                          onSettingsChange({
                            ...settings,
                            chartPreferences: {
                              ...settings.chartPreferences,
                              showLegend: e.target.checked,
                            },
                          })
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-3"
                      />
                      <span className="text-sm text-gray-700">Show Chart Legend</span>
                    </label>
                  </div>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
};

export default DashboardHeader;
