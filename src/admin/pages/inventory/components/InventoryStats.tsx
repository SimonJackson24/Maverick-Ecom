import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { InventoryStatsResponse } from '../../../../graphql/types/inventory';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color = 'primary.main' }) => (
  <Box p={2} sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        <Box sx={{ color }}>{icon}</Box>
      </Grid>
      <Grid item>
        <Typography variant="h6">{value}</Typography>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
      </Grid>
    </Grid>
  </Box>
);

interface Props {
  stats: InventoryStatsResponse['inventoryStats'];
}

const InventoryStats: React.FC<Props> = ({ stats }) => {
  if (!stats) return null;

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>Inventory Overview</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<InventoryIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Stock"
            value={stats.totalStock}
            icon={<LocalShippingIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Low Stock"
            value={stats.lowStockCount}
            icon={<WarningIcon />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Out of Stock"
            value={stats.outOfStockCount}
            icon={<ErrorIcon />}
            color="error.main"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default InventoryStats;
