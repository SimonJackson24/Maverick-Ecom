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
  Skeleton
} from '@mui/material';
import { 
  ExpandMore, 
  Info, 
  Inventory, 
  Warning,
  TrendingUp,
  TrendingDown,
  Add
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ProductMetricsProps {
  data: DashboardStats['products'] | null;
  settings: DashboardSettings;
  isExpanded: boolean;
  onExpand: () => void;
  loading?: boolean;
  error?: Error | null;
}

const ProductMetrics: React.FC<ProductMetricsProps> = ({
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
            Error loading product data: {error.message}
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
            No product data available
          </Typography>
        </Box>
      </Card>
    );
  }

  const chartData = {
    labels: data.breakdown.map((item) => item.period),
    datasets: [
      {
        label: 'Products',
        data: data.breakdown.map((item) => item.count),
        fill: true,
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderColor: '#F59E0B',
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
            return `Products: ${context.raw}`;
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

  const getProductInsights = () => {
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
      stockStatus: {
        inStock: data.total - (data.outOfStock || 0),
        outOfStock: data.outOfStock || 0,
        lowStock: data.lowStock || 0,
      }
    };
  };

  const insights = getProductInsights();
  const stockLevel = (insights.stockStatus.inStock / data.total) * 100;

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
              Products
            </Typography>
            <Tooltip title="Product inventory overview">
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
              label={`${data.outOfStock} Out of Stock`}
              color="error"
            />
            <Chip 
              size="small" 
              icon={<Warning sx={{ fontSize: '1rem !important' }} />}
              label={`${data.lowStock} Low Stock`}
              color="warning"
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Add new product">
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                navigate('/admin/products/new');
              }}
            >
              <Add />
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
          Stock Level
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={stockLevel}
              color={stockLevel > 70 ? 'success' : stockLevel > 30 ? 'warning' : 'error'}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {stockLevel.toFixed(1)}%
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
                  Average Products
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {insights.average.toFixed(1)}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Peak Products
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
                  Stock Turnover
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {Math.abs(insights.trend).toFixed(1)}
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
              Stock Status
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, bgcolor: 'success.soft', borderRadius: 1 }}>
                  <Typography variant="body2" color="success.main" gutterBottom>
                    In Stock
                  </Typography>
                  <Typography variant="h6" color="success.main" fontWeight={600}>
                    {insights.stockStatus.inStock}
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    {((insights.stockStatus.inStock / data.total) * 100).toFixed(1)}% of total
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, bgcolor: 'warning.soft', borderRadius: 1 }}>
                  <Typography variant="body2" color="warning.main" gutterBottom>
                    Low Stock
                  </Typography>
                  <Typography variant="h6" color="warning.main" fontWeight={600}>
                    {insights.stockStatus.lowStock}
                  </Typography>
                  <Typography variant="caption" color="warning.main">
                    Need restock soon
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, bgcolor: 'error.soft', borderRadius: 1 }}>
                  <Typography variant="body2" color="error.main" gutterBottom>
                    Out of Stock
                  </Typography>
                  <Typography variant="h6" color="error.main" fontWeight={600}>
                    {insights.stockStatus.outOfStock}
                  </Typography>
                  <Typography variant="caption" color="error.main">
                    Require immediate attention
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
                ? '📈 Product count is trending upward.'
                : '📉 Product count is trending downward.'}
              {' '}Peak product count was {insights.peak} on {insights.peakDay?.period}.
              {insights.stockStatus.outOfStock > 0 && ` ⚠️ ${insights.stockStatus.outOfStock} products are out of stock.`}
              {insights.stockStatus.lowStock > 0 && ` ⚠️ ${insights.stockStatus.lowStock} products are running low.`}
            </Typography>
          </Box>
        </motion.div>
      )}
    </Card>
  );
};

export default ProductMetrics;
