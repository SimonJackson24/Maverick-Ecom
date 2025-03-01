import React, { useState, useEffect } from 'react';
import { MessageCleanupService } from '../../../services/support/MessageCleanupService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface CleanupMetrics {
  totalAttempts: number;
  successfulCleanups: number;
  failedCleanups: number;
  retryCount: number;
}

interface FailedCleanup {
  message_id: string;
  group_message_id: string;
  customer_number: string;
  retry_count: number;
  last_error: string;
  status: string;
  chatMessage: {
    content: string;
    timestamp: string;
  };
}

export const MessageCleanupDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<CleanupMetrics | null>(null);
  const [recentFailures, setRecentFailures] = useState<FailedCleanup[]>([]);
  const [isServiceRunning, setIsServiceRunning] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanupService = new MessageCleanupService();

  useEffect(() => {
    loadDashboardData();
    cleanupService.onMetricsUpdate((newMetrics) => {
      setMetrics(newMetrics);
    });
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await cleanupService.getCleanupMetrics();
      setMetrics(data.metrics);
      setRecentFailures(data.recentFailures);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceToggle = () => {
    if (isServiceRunning) {
      cleanupService.stopCleanupService();
    } else {
      cleanupService.startCleanupService();
    }
    setIsServiceRunning(!isServiceRunning);
  };

  const handleForceCleanup = async (messageId: string) => {
    try {
      setSelectedMessage(messageId);
      setIsLoading(true);
      await cleanupService.forceCleanup(messageId);
      await loadDashboardData();
      setError(null);
    } catch (err) {
      setError(`Failed to force cleanup: ${err.message}`);
    } finally {
      setIsLoading(false);
      setSelectedMessage(null);
    }
  };

  const handleResetMetrics = async () => {
    try {
      setIsLoading(true);
      await cleanupService.resetMetrics();
      setError(null);
    } catch (err) {
      setError('Failed to reset metrics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !metrics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Message Cleanup Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={handleServiceToggle}
            className={`px-4 py-2 rounded-md ${
              isServiceRunning
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {isServiceRunning ? 'Stop Service' : 'Start Service'}
          </button>
          <button
            onClick={handleResetMetrics}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
          >
            Reset Metrics
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Metrics Overview */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Attempts"
          value={metrics?.totalAttempts || 0}
          color="blue"
        />
        <MetricCard
          title="Successful Cleanups"
          value={metrics?.successfulCleanups || 0}
          color="green"
        />
        <MetricCard
          title="Failed Cleanups"
          value={metrics?.failedCleanups || 0}
          color="red"
        />
        <MetricCard
          title="Retry Count"
          value={metrics?.retryCount || 0}
          color="yellow"
        />
      </div>

      {/* Metrics Chart */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Cleanup Metrics Over Time</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getChartData(metrics)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="successful"
                stroke="#10B981"
                name="Successful"
              />
              <Line
                type="monotone"
                dataKey="failed"
                stroke="#EF4444"
                name="Failed"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Failures */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Recent Failures</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Retry Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Error
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentFailures.map((failure) => (
                <tr key={failure.message_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {failure.message_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {failure.customer_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {failure.retry_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {failure.last_error}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        failure.status === 'failed_permanent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {failure.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleForceCleanup(failure.message_id)}
                      disabled={isLoading && selectedMessage === failure.message_id}
                      className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                    >
                      {isLoading && selectedMessage === failure.message_id
                        ? 'Cleaning...'
                        : 'Force Cleanup'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: number;
  color: string;
}> = ({ title, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p
            className={`mt-2 text-3xl font-semibold ${
              colorClasses[color as keyof typeof colorClasses]
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

const getChartData = (metrics: CleanupMetrics | null) => {
  if (!metrics) return [];

  return [
    {
      name: 'Current',
      successful: metrics.successfulCleanups,
      failed: metrics.failedCleanups
    }
  ];
};
