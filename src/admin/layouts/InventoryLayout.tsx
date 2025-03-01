import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import {
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  NotificationsActive as AlertsIcon,
} from '@mui/icons-material';

const InventoryLayout: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getTabValue = () => {
    if (currentPath.endsWith('/settings')) return 1;
    if (currentPath.endsWith('/alerts')) return 2;
    return 0;
  };

  return (
    <Box>
      <Paper sx={{ mb: 2 }}>
        <Tabs 
          value={getTabValue()} 
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<InventoryIcon />}
            iconPosition="start"
            label="Overview"
            component={Link}
            to="/admin/inventory"
          />
          <Tab
            icon={<SettingsIcon />}
            iconPosition="start"
            label="Settings"
            component={Link}
            to="/admin/inventory/settings"
          />
          <Tab
            icon={<AlertsIcon />}
            iconPosition="start"
            label="Stock Alerts"
            component={Link}
            to="/admin/inventory/alerts"
          />
        </Tabs>
      </Paper>
      <Box sx={{ p: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default InventoryLayout;
