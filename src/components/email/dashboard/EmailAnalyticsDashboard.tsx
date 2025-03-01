import React from 'react';
import { useQuery } from '@apollo/client';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { GET_CAMPAIGN_METRICS } from '../../../graphql/email';

interface EmailAnalyticsDashboardProps {
  campaignId?: string;
  startDate?: Date;
  endDate?: Date;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const EmailAnalyticsDashboard: React.FC<EmailAnalyticsDashboardProps> = ({
  campaignId,
  startDate,
  endDate
}) => {
  const { data, loading, error } = useQuery(GET_CAMPAIGN_METRICS, {
    variables: { campaignId, startDate, endDate },
    pollInterval: 300000 // Poll every 5 minutes
  });

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div>Error loading analytics: {error.message}</div>;

  const {
    deliveryStats,
    engagementStats,
    conversionStats,
    timeSeriesData
  } = data.campaignMetrics;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Emails Sent"
          value={deliveryStats.sent}
          change={deliveryStats.sentChange}
        />
        <MetricCard
          title="Open Rate"
          value={`${engagementStats.openRate}%`}
          change={engagementStats.openRateChange}
        />
        <MetricCard
          title="Click Rate"
          value={`${engagementStats.clickRate}%`}
          change={engagementStats.clickRateChange}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${conversionStats.conversionRate}%`}
          change={conversionStats.conversionRateChange}
        />
      </div>

      {/* Engagement Over Time Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Engagement Over Time</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="opens"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
              />
              <Area
                type="monotone"
                dataKey="clicks"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Engagement Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Delivery Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Delivered', value: deliveryStats.delivered },
                    { name: 'Bounced', value: deliveryStats.bounced },
                    { name: 'Failed', value: deliveryStats.failed }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deliveryStats.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Device Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={engagementStats.deviceBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {engagementStats.deviceBreakdown.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Click Map */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Click Distribution</h3>
        <div className="space-y-4">
          {engagementStats.clickMap.map((link) => (
            <div key={link.url} className="flex items-center">
              <div className="w-48 truncate">{link.label}</div>
              <div className="flex-1 mx-4 bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 rounded-full h-4"
                  style={{ width: `${link.clickRate}%` }}
                />
              </div>
              <div className="w-16 text-right">{link.clickRate}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h4 className="text-sm font-medium text-gray-500">{title}</h4>
    <div className="mt-2 flex items-baseline">
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <p className={`ml-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {change >= 0 ? '+' : ''}{change}%
      </p>
    </div>
  </div>
);
