import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
} from 'recharts';
import { format } from 'date-fns';

interface AnalyticsData {
  hourlyMetrics: any[];
  dailyMetrics: any[];
  errorAnalysis: any[];
  retryPatterns: any[];
  customerImpact: any[];
  timePerformance: any[];
  queueHealth: any[];
  serviceHealth: any[];
  summary: any;
  errorTimeline: any[];
  cleanupTimeDistribution: any[];
  customerImpactTrends: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const CleanupAnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/cleanup-analytics?timeRange=${timeRange}`);
      const data = await response.json();
      setData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = (format: 'excel' | 'pdf') => {
    // Implement data export logic here
  };

  const scheduleReport = (config: any) => {
    // Implement report scheduling logic here
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
        {error || 'No data available'}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cleanup Analytics Dashboard</h1>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
            <button
              onClick={fetchAnalyticsData}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Refresh
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => exportData('excel')}
              className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md"
            >
              Export Excel
            </button>
            <button
              onClick={() => exportData('pdf')}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md"
            >
              Export PDF
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
            >
              Schedule Reports
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard
          title="Success Rate"
          value={`${data.summary.successRate.toFixed(1)}%`}
          trend={data.summary.successRateTrend}
          icon="✓"
        />
        <SummaryCard
          title="Avg Cleanup Time"
          value={`${data.summary.avgCleanupTime.toFixed(1)}s`}
          trend={data.summary.cleanupTimeTrend}
          icon="⏱"
        />
        <SummaryCard
          title="Queue Size"
          value={data.summary.queueSize}
          trend={data.summary.queueSizeTrend}
          icon="📊"
        />
        <SummaryCard
          title="Error Rate"
          value={`${data.summary.errorRate.toFixed(1)}%`}
          trend={data.summary.errorRateTrend}
          icon="⚠"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Success Rate Over Time */}
        <Card title="Success Rate Over Time">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.hourlyMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
                tickFormatter={(value) => format(new Date(value), 'HH:mm')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => format(new Date(value), 'yyyy-MM-dd HH:mm')}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="avg_success_rate"
                stroke="#0088FE"
                name="Success Rate (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Cleanup Time Distribution */}
        <Card title="Cleanup Time Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.hourlyMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
                tickFormatter={(value) => format(new Date(value), 'HH:mm')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => format(new Date(value), 'yyyy-MM-dd HH:mm')}
              />
              <Legend />
              <Bar
                dataKey="avg_cleanup_time_seconds"
                fill="#00C49F"
                name="Avg. Cleanup Time (s)"
              />
              <Bar
                dataKey="max_cleanup_time_seconds"
                fill="#FF8042"
                name="Max Cleanup Time (s)"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Error Distribution */}
        <Card title="Error Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.errorAnalysis}
                dataKey="occurrence_count"
                nameKey="last_error"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.errorAnalysis.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Retry Pattern Analysis */}
        <Card title="Retry Pattern Analysis">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.retryPatterns}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="retry_count" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="successful_cleanups"
                fill="#00C49F"
                name="Successful"
                stackId="a"
              />
              <Bar
                dataKey="permanent_failures"
                fill="#FF8042"
                name="Failed"
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Queue Health */}
        <Card title="Queue Health">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.queueHealth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
                tickFormatter={(value) => format(new Date(value), 'HH:mm')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => format(new Date(value), 'yyyy-MM-dd HH:mm')}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="message_count"
                stroke="#0088FE"
                name="Queue Size"
              />
              <Line
                type="monotone"
                dataKey="avg_time_in_queue"
                stroke="#00C49F"
                name="Avg. Time in Queue (s)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Customer Impact */}
        <Card title="Customer Impact">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Messages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Success Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Cleanup Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.customerImpact.map((customer: any) => (
                  <tr key={customer.customer_number}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.customer_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.total_messages}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {((customer.successful_cleanups / customer.total_messages) * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.avg_cleanup_time.toFixed(1)}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Performance Heatmap */}
        <Card title="Performance Heatmap">
          <div className="h-[300px]">
            <HeatMap
              data={data.timePerformance}
              xAxis="hour_of_day"
              yAxis="day_of_week"
              value="success_rate"
              labels={{
                x: 'Hour of Day',
                y: 'Day of Week',
                value: 'Success Rate',
              }}
            />
          </div>
        </Card>

        {/* Error Timeline */}
        <Card title="Error Timeline">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data.errorTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => format(new Date(value), 'HH:mm')}
              />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                labelFormatter={(value) => format(new Date(value), 'yyyy-MM-dd HH:mm')}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="error_count"
                fill="#FF8042"
                name="Error Count"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avg_retry_count"
                stroke="#8884d8"
                name="Avg Retries"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        {/* Cleanup Time Distribution */}
        <Card title="Cleanup Time Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.cleanupTimeDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="count"
                fill="#8884d8"
                name="Number of Messages"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Customer Impact Trends */}
        <Card title="Customer Impact Trends">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.customerImpactTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => format(new Date(value), 'HH:mm')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => format(new Date(value), 'yyyy-MM-dd HH:mm')}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="affected_customers"
                stroke="#0088FE"
                name="Affected Customers"
              />
              <Line
                type="monotone"
                dataKey="avg_impact_duration"
                stroke="#00C49F"
                name="Avg Impact Duration (s)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Schedule Report Modal */}
      {showScheduleModal && (
        <ScheduleReportModal
          onClose={() => setShowScheduleModal(false)}
          onSchedule={scheduleReport}
        />
      )}
    </div>
  );
};

// New Components

const SummaryCard: React.FC<{
  title: string;
  value: string | number;
  trend: number;
  icon: string;
}> = ({ title, value, trend, icon }) => (
  <div className="bg-white rounded-lg shadow-lg p-4">
    <div className="flex items-center justify-between">
      <div className="text-2xl">{icon}</div>
      <div className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
      </div>
    </div>
    <div className="mt-2">
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  </div>
);

const HeatMap: React.FC<{
  data: any[];
  xAxis: string;
  yAxis: string;
  value: string;
  labels: {
    x: string;
    y: string;
    value: string;
  };
}> = ({ data, xAxis, yAxis, value, labels }) => {
  // Implementation of custom heatmap visualization
  return (
    <div className="relative h-full">
      {/* Heatmap implementation */}
    </div>
  );
};

const ScheduleReportModal: React.FC<{
  onClose: () => void;
  onSchedule: (config: any) => void;
}> = ({ onClose, onSchedule }) => {
  const [config, setConfig] = useState({
    frequency: 'daily',
    recipients: [''],
    format: 'both',
    metrics: ['all'],
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[500px]">
        <h2 className="text-xl font-bold mb-4">Schedule Report</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Frequency</label>
            <select
              value={config.frequency}
              onChange={(e) => setConfig({ ...config, frequency: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Recipients</label>
            <input
              type="text"
              value={config.recipients.join(', ')}
              onChange={(e) => setConfig({ ...config, recipients: e.target.value.split(',').map(s => s.trim()) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="email@example.com, another@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Format</label>
            <select
              value={config.format}
              onChange={(e) => setConfig({ ...config, format: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="excel">Excel</option>
              <option value="pdf">PDF</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSchedule(config);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

const TimeRangeSelector: React.FC<{
  value: string;
  onChange: (value: any) => void;
}> = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-4 py-2 border rounded-md"
  >
    <option value="24h">Last 24 Hours</option>
    <option value="7d">Last 7 Days</option>
    <option value="30d">Last 30 Days</option>
  </select>
);

const Card: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    {children}
  </div>
);
