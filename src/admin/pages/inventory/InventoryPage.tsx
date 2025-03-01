import React from 'react';
import { Grid, Paper, Typography, Box, CircularProgress, Tabs, Tab } from '@mui/material';
import { useInventory } from '../../hooks/useInventory';
import InventoryStats from './components/InventoryStats';
import RecentTransactions from './components/RecentTransactions';
import LowStockProducts from './components/LowStockProducts';
import StockManagement from './components/StockManagement';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`inventory-tabpanel-${index}`}
      aria-labelledby={`inventory-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const InventoryPage: React.FC = () => {
  const { inventoryStats, loading, error } = useInventory();
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">Error loading inventory data</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="inventory tabs">
          <Tab label="Overview" />
          <Tab label="Stock Management" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={2}>
              <InventoryStats stats={inventoryStats} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2}>
              <RecentTransactions transactions={inventoryStats?.recentTransactions || []} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2}>
              <LowStockProducts products={inventoryStats?.topLowStock || []} />
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <StockManagement />
      </TabPanel>
    </Box>
  );
};

export default InventoryPage;
