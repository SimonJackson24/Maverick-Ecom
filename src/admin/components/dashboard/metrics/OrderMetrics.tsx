import React from 'react';
import { Line } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardStats, DashboardSettings } from '../../../../types/admin';
import { defaultChartOptions } from '../../../../lib/chart';
import { merge } from 'lodash';
import { Card, Box, Typography, IconButton, Tooltip, Chip, Grid, Skeleton } from '@mui/material';
import { ExpandMore, Info, LocalShipping, Inventory, Warning } from '@mui/icons-material';

interface OrderMetricsProps {
  data: DashboardStats['orders'] | null;
  settings: DashboardSettings;
  isExpanded: boolean;
  onExpand: () => void;
  loading?: boolean;
  error?: Error | null;
}

const OrderMetrics: React.FC<OrderMetricsProps> = ({
  data,
  settings,
  isExpanded,
  onExpand,
  loading = false,
  error = null,
}) => {
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
            Error loading order data: {error.message}
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
            No order data available
          </Typography>
        </Box>
      </Card>
    );
  }

  const chartData = {
    labels: data.breakdown.map((item) => item.period),
    datasets: [
      {
        label: 'Orders',
        data: data.breakdown.map((item) => item.count),
        fill: true,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: '#EF4444',
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
            return `Orders: ${context.raw}`;
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

  const getOrderInsights = () => {
    const breakdown = data.breakdown;
    const counts = breakdown.map(item => item.count);
    const average = counts.reduce((a, b) => a + b, 0) / counts.length;
    const peak = Math.max(...counts);
    const peakDay = breakdown.find(item => item.count === peak);
    const trend = counts.slice(-3).reduce((a, b) => a + b, 0) / 3 - average;

    return {
      average,
      peak,
      peakDay,
      trend,
      pendingOrders: data.pending || 0,
      processingOrders: data.processing || 0,
      shippingOrders: data.shipping || 0,
    };
  };

  const insights = getOrderInsights();

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
              Orders
            </Typography>
            <Tooltip title="Total orders and order status breakdown">
              <Info fontSize="small" sx={{ color: 'text.secondary', opacity: 0.7 }} />
            </Tooltip>
          </Box>
          <Typography variant="h4" sx={{ mt: 1, mb: 1, fontWeight: 700 }}>
            {data.total}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              size="small" 
              icon={<Warning sx={{ fontSize: '1rem !important' }} />}
              label={`${data.pending} Pending`}
              color="warning"
            />
            <Chip 
              size="small" 
              icon={<Inventory sx={{ fontSize: '1rem !important' }} />}
              label={`${data.processing} Processing`}
              color="info"
            />
            <Chip 
              size="small" 
              icon={<LocalShipping sx={{ fontSize: '1rem !important' }} />}
              label={`${data.shipping} Shipping`}
              color="success"
            />
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
        initial={false}
        style={{
          height: isExpanded ? 400 : 200,
          width: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25
        }}
      >
        <Box sx={{ height: '100%', position: 'relative' }}>
          <Line data={chartData} options={chartOptions} />
        </Box>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25
            }}
          >
            <Grid container spacing={2} sx={{ mt: 4 }}>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Average Daily Orders
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {insights.average.toFixed(1)}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Peak Orders
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
                    Order Processing Time
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {data.averageProcessingTime || '2.5'} hours
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Status Breakdown
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, bgcolor: 'warning.soft', borderRadius: 1 }}>
                    <Typography variant="body2" color="warning.main" gutterBottom>
                      Pending Orders
                    </Typography>
                    <Typography variant="h6" color="warning.main" fontWeight={600}>
                      {insights.pendingOrders}
                    </Typography>
                    <Typography variant="caption" color="warning.main">
                      Require immediate attention
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, bgcolor: 'info.soft', borderRadius: 1 }}>
                    <Typography variant="body2" color="info.main" gutterBottom>
                      Processing Orders
                    </Typography>
                    <Typography variant="h6" color="info.main" fontWeight={600}>
                      {insights.processingOrders}
                    </Typography>
                    <Typography variant="caption" color="info.main">
                      Being prepared for shipping
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, bgcolor: 'success.soft', borderRadius: 1 }}>
                    <Typography variant="body2" color="success.main" gutterBottom>
                      Shipping Orders
                    </Typography>
                    <Typography variant="h6" color="success.main" fontWeight={600}>
                      {insights.shippingOrders}
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      In transit to customers
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
                  ? '📈 Order volume is trending upward compared to the period average.'
                  : '📉 Order volume is trending below the period average.'}
                {' '}Peak order volume was {insights.peak} orders on {insights.peakDay?.period}.
                {insights.pendingOrders > 5 && ' ⚠️ High number of pending orders requires attention.'}
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default OrderMetrics;
