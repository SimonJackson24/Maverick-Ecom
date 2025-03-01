import React from 'react';
import { Line } from 'react-chartjs-2';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { DashboardStats, DashboardSettings } from '../../../../types/admin';
import { defaultChartOptions } from '../../../../lib/chart';
import { merge } from 'lodash';
import { Card, Box, Typography, IconButton, Tooltip } from '@mui/material';
import { ExpandMore, Info } from '@mui/icons-material';

interface RevenueMetricsProps {
  data: DashboardStats['revenue'] | null;
  settings: DashboardSettings;
  isExpanded: boolean;
  onExpand: () => void;
  loading?: boolean;
  error?: Error | null;
}

const RevenueMetrics: React.FC<RevenueMetricsProps> = ({
  data,
  settings,
  isExpanded,
  onExpand,
  loading = false,
  error = null,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Card sx={{ p: 3, height: '100%', opacity: 0.7 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ bgcolor: 'background.default', height: 24, width: 100, borderRadius: 1 }} />
          <Box sx={{ bgcolor: 'background.default', height: 32, width: 150, borderRadius: 1 }} />
          <Box sx={{ bgcolor: 'background.default', height: 200, borderRadius: 1 }} />
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ p: 3, height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography color="error" variant="body1">
            Error loading revenue data: {error.message}
          </Typography>
        </Box>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card sx={{ p: 3, height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography color="text.secondary">No revenue data available</Typography>
        </Box>
      </Card>
    );
  }

  const chartData = {
    labels: data.breakdown.map((item) => item.period),
    datasets: [
      {
        label: 'Revenue',
        data: data.breakdown.map((item) => item.amount),
        fill: true,
        backgroundColor: 'rgba(128, 90, 213, 0.1)',
        borderColor: '#805AD5',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = merge({}, defaultChartOptions, {
    plugins: {
      legend: {
        display: settings.chartPreferences.showLegend,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `Revenue: ${formatCurrency(context.raw)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.04)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  });

  const getRevenueInsights = () => {
    const breakdown = data.breakdown;
    const amounts = breakdown.map(item => item.amount);
    const average = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const peak = Math.max(...amounts);
    const peakDay = breakdown.find(item => item.amount === peak);
    const trend = amounts.slice(-3).reduce((a, b) => a + b, 0) / 3 - average;

    return {
      average,
      peak,
      peakDay,
      trend,
    };
  };

  const insights = getRevenueInsights();

  return (
    <Card 
      sx={{ 
        p: 3, 
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => theme.shadows[4],
        },
      }}
      onClick={onExpand}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" color="text.primary">
              Revenue
            </Typography>
            <Tooltip title="Total revenue for the selected period">
              <Info fontSize="small" sx={{ color: 'text.secondary', opacity: 0.7 }} />
            </Tooltip>
          </Box>
          <Typography variant="h4" sx={{ mt: 1, mb: 1, fontWeight: 700 }}>
            {formatCurrency(data.total)}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                bgcolor: data.percentageChange >= 0 ? 'success.soft' : 'error.soft',
                color: data.percentageChange >= 0 ? 'success.main' : 'error.main',
              }}
            >
              {data.percentageChange >= 0 ? (
                <ArrowUpIcon className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 mr-1" />
              )}
              <Typography variant="body2" fontWeight={600}>
                {Math.abs(data.percentageChange).toFixed(2)}%
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              vs previous period
            </Typography>
          </Box>
        </Box>
        <IconButton 
          size="small"
          sx={{ 
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <ExpandMore />
        </IconButton>
      </Box>

      <motion.div
        layout
        style={{
          height: isExpanded ? 400 : 200,
          transition: 'height 0.3s ease',
        }}
      >
        <Line data={chartData} options={chartOptions} />
      </motion.div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Box sx={{ mt: 4, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            <Card sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Average Daily Revenue
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {formatCurrency(insights.average)}
              </Typography>
            </Card>
            <Card sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Peak Revenue
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {formatCurrency(insights.peak)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {insights.peakDay?.period}
              </Typography>
            </Card>
            <Card sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Recent Trend
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" fontWeight={600}>
                  {formatCurrency(insights.trend)}
                </Typography>
                <Typography 
                  variant="caption" 
                  color={insights.trend >= 0 ? 'success.main' : 'error.main'}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {insights.trend >= 0 ? (
                    <ArrowUpIcon className="w-3 h-3" />
                  ) : (
                    <ArrowDownIcon className="w-3 h-3" />
                  )}
                  vs average
                </Typography>
              </Box>
            </Card>
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Quick Insights
            </Typography>
            <Typography variant="body2" color="text.primary">
              {insights.trend >= 0 
                ? '📈 Revenue is trending upward compared to the period average.'
                : '📉 Revenue is trending below the period average.'}
              {' '}Peak revenue was achieved on {insights.peakDay?.period}.
            </Typography>
          </Box>
        </motion.div>
      )}
    </Card>
  );
};

export default RevenueMetrics;
