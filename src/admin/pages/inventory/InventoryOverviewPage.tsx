import React from 'react';
import { Box, Grid, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { useInventory } from '../../hooks/useInventory';

export const InventoryOverviewPage = () => {
  const { inventoryStats, loading, error } = useInventory();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={2}>
        <Alert severity="error">
          {error.message || 'An error occurred while loading inventory data'}
        </Alert>
      </Box>
    );
  }

  const stats = {
    lowStockCount: inventoryStats?.lowStockCount ?? 0,
    totalProducts: inventoryStats?.totalProducts ?? 0,
    pendingRestocks: inventoryStats?.pendingRestocks ?? 0
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Low Stock Items
            </Typography>
            <Typography variant="h3" color="error">
              {stats.lowStockCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Total Products
            </Typography>
            <Typography variant="h3">
              {stats.totalProducts}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Pending Restocks
            </Typography>
            <Typography variant="h3" color="warning.main">
              {stats.pendingRestocks}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InventoryOverviewPage;
