import React from 'react';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { DashboardStats, DashboardSettings } from '../../../../types/admin';
import { defaultChartOptions } from '../../../../lib/chart';
import { merge } from 'lodash';
import { 
  Card, 
  Box, 
  Typography, 
  IconButton, 
  Tooltip, 
  Chip, 
  Grid,
  LinearProgress,
  Skeleton,
  Divider
} from '@mui/material';
import { 
  ExpandMore, 
  Info, 
  People,
  PersonAdd,
  TrendingUp,
  TrendingDown,
  Mail,
  Star,
  ShoppingBag,
  Loyalty
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface CustomerMetricsProps {
  data: DashboardStats['customers'] | null;
  settings: DashboardSettings;
  isExpanded: boolean;
  onExpand: () => void;
  loading?: boolean;
  error?: Error | null;
}

const CustomerMetrics: React.FC<CustomerMetricsProps> = ({
  data,
  settings,
  isExpanded,
  onExpand,
  loading = false,
  error = null,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card sx={{ p: 3, height: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="text" width={180} height={40} />
          <Skeleton variant="rectangular" height={200} />
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ p: 3, height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography color="error" variant="body1">
            Error loading customer data: {error.message}
          </Typography>
        </Box>
      </Card>
    );
  }

  if (!data || !data.breakdown) {
    return (
      <Card sx={{ p: 3, height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography color="text.secondary">
            No customer data available
          </Typography>
        </Box>
      </Card>
    );
  }

  const chartData = {
    labels: data.breakdown.map((item) => item.period),
    datasets: [
      {
        label: 'Total Customers',
        data: data.breakdown.map((item) => item.count),
        fill: true,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: '#10B981',
        tension: 0.4,
      },
      {
        label: 'New Customers',
        data: data.breakdown.map((item) => item.newCustomers || 0),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3B82F6',
        tension: 0.4,
      }
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
            const label = context.dataset.label || '';
            return `${label}: ${context.raw}`;
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

  const getCustomerInsights = () => {
    const breakdown = data.breakdown;
    const counts = breakdown.map(item => item.count);
    const newCounts = breakdown.map(item => item.newCustomers || 0);
    const average = counts.reduce((a, b) => a + b, 0) / counts.length;
    const averageNew = newCounts.reduce((a, b) => a + b, 0) / newCounts.length;
    const peak = Math.max(...counts);
    const peakDay = breakdown.find(item => item.count === peak);
    const trend = counts.slice(-3).reduce((a, b) => a + b, 0) / 3 - average;

    return {
      average,
      averageNew,
      peak,
      peakDay,
      trend,
      customerStats: {
        active: data.active || 0,
        new: data.new || 0,
        returning: (data.total || 0) - (data.new || 0),
        loyal: Math.floor((data.total || 0) * 0.2), // Top 20% customers
      }
    };
  };

  const insights = getCustomerInsights();
  const retentionRate = ((insights.customerStats.returning / data.total) * 100);

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
              Customers
            </Typography>
            <Tooltip title="Customer growth and engagement metrics">
              <Info fontSize="small" sx={{ color: 'text.secondary', opacity: 0.7 }} />
            </Tooltip>
          </Box>
          <Typography variant="h4" sx={{ mt: 1, mb: 1, fontWeight: 700 }}>
            {data.total}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              size="small" 
              icon={<PersonAdd sx={{ fontSize: '1rem !important' }} />}
              label={`${data.new} New`}
              color="info"
            />
            <Chip 
              size="small" 
              icon={<People sx={{ fontSize: '1rem !important' }} />}
              label={`${data.active} Active`}
              color="success"
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Send newsletter">
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                navigate('/admin/marketing/email');
              }}
            >
              <Mail />
            </IconButton>
          </Tooltip>
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
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Customer Retention
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={retentionRate}
              color={retentionRate > 70 ? 'success' : retentionRate > 30 ? 'warning' : 'error'}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {retentionRate.toFixed(1)}%
          </Typography>
        </Box>
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
          <Grid container spacing={2} sx={{ mt: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Average Daily Signups
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {insights.averageNew.toFixed(1)}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Peak Customers
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {insights.peak}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {insights.peakDay?.period}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Growth Rate
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {Math.abs(insights.trend).toFixed(1)}%
                  </Typography>
                  {insights.trend >= 0 ? (
                    <TrendingUp color="success" />
                  ) : (
                    <TrendingDown color="error" />
                  )}
                </Box>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Customer Segments
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Box sx={{ p: 2, bgcolor: 'info.soft', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PersonAdd fontSize="small" color="info" />
                    <Typography variant="body2" color="info.main">
                      New Customers
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="info.main" fontWeight={600}>
                    {insights.customerStats.new}
                  </Typography>
                  <Typography variant="caption" color="info.main">
                    {((insights.customerStats.new / data.total) * 100).toFixed(1)}% of total
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ p: 2, bgcolor: 'success.soft', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ShoppingBag fontSize="small" color="success" />
                    <Typography variant="body2" color="success.main">
                      Active Customers
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="success.main" fontWeight={600}>
                    {insights.customerStats.active}
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    {((insights.customerStats.active / data.total) * 100).toFixed(1)}% of total
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ p: 2, bgcolor: 'warning.soft', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Star fontSize="small" color="warning" />
                    <Typography variant="body2" color="warning.main">
                      Returning Customers
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="warning.main" fontWeight={600}>
                    {insights.customerStats.returning}
                  </Typography>
                  <Typography variant="caption" color="warning.main">
                    {((insights.customerStats.returning / data.total) * 100).toFixed(1)}% of total
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ p: 2, bgcolor: 'primary.soft', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Loyalty fontSize="small" color="primary" />
                    <Typography variant="body2" color="primary.main">
                      Loyal Customers
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="primary.main" fontWeight={600}>
                    {insights.customerStats.loyal}
                  </Typography>
                  <Typography variant="caption" color="primary.main">
                    Top 20% by purchase value
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Quick Insights
            </Typography>
            <Typography variant="body2" color="text.primary">
              {insights.trend >= 0 
                ? '📈 Customer base is growing steadily.'
                : '📉 Customer acquisition has slowed down.'}
              {' '}Peak customer count was {insights.peak} on {insights.peakDay?.period}.
              {insights.customerStats.new > insights.averageNew && ' 🎯 New customer acquisition is above average.'}
              {retentionRate > 70 && ' 🌟 Strong customer retention rate.'}
            </Typography>
          </Box>
        </motion.div>
      )}
    </Card>
  );
};

export default CustomerMetrics;
