import React from 'react';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  LocalShipping,
  Warning,
  Pending,
  CheckCircle,
  Cancel,
  Today,
  DateRange,
  CalendarMonth,
} from '@mui/icons-material';

interface OrderStatsProps {
  data?: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
    todayOrders: number;
    todayRevenue: number;
    weeklyOrders: number;
    weeklyRevenue: number;
    monthlyOrders: number;
    monthlyRevenue: number;
  };
  loading?: boolean;
  filterStatus?: string;
}

const OrderStats: React.FC<OrderStatsProps> = ({ 
  data, 
  loading = false,
  filterStatus
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(value);
  };

  const getStats = () => {
    if (filterStatus === 'pending') {
      return [
        {
          title: 'Pending Orders',
          value: data?.pending || 0,
          icon: <Pending sx={{ color: 'warning.main' }} />,
          format: (value: number) => value.toString(),
        },
        {
          title: "Today's Pending",
          value: data?.todayOrders || 0,
          icon: <Today sx={{ color: 'info.main' }} />,
          format: (value: number) => value.toString(),
        },
        {
          title: 'Weekly Pending',
          value: data?.weeklyOrders || 0,
          icon: <DateRange sx={{ color: 'primary.main' }} />,
          format: (value: number) => value.toString(),
        },
        {
          title: 'Monthly Pending',
          value: data?.monthlyOrders || 0,
          icon: <CalendarMonth sx={{ color: 'success.main' }} />,
          format: (value: number) => value.toString(),
        },
      ];
    }

    return [
      {
        title: 'Total Orders',
        value: data?.total || 0,
        icon: <ShoppingCart sx={{ color: 'primary.main' }} />,
        format: (value: number) => value.toString(),
      },
      {
        title: 'Pending Orders',
        value: data?.pending || 0,
        icon: <Pending sx={{ color: 'warning.main' }} />,
        format: (value: number) => value.toString(),
      },
      {
        title: 'Completed Orders',
        value: data?.completed || 0,
        icon: <CheckCircle sx={{ color: 'success.main' }} />,
        format: (value: number) => value.toString(),
      },
      {
        title: 'Cancelled Orders',
        value: data?.cancelled || 0,
        icon: <Cancel sx={{ color: 'error.main' }} />,
        format: (value: number) => value.toString(),
      },
    ];
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {getStats().map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              bgcolor: 'background.default',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {stat.icon}
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                {stat.title}
              </Typography>
            </Box>
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
              {stat.format(stat.value)}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default OrderStats;
