import React from 'react';
import { RouteObject } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SettingsIcon from '@mui/icons-material/Settings';
import AnalyticsIcon from '@mui/icons-material/Analytics';

import DashboardPage from './pages/DashboardPage';
import InventoryAlertsPage from './pages/inventory/InventoryAlertsPage';
import FulfillmentPage from './pages/fulfillment/FulfillmentPage';
import SettingsLayout from './pages/settings/SettingsLayout';
import InventoryLayout from './layouts/InventoryLayout';
import InventoryOverviewPage from './pages/inventory/InventoryOverviewPage';
import InventorySettingsPage from './pages/inventory/InventorySettingsPage';
import InventoryPage from './pages/inventory/InventoryPage';
import StockAlertsPage from './pages/inventory/StockAlertsPage';
import AnalyticsSettings from './pages/settings/AnalyticsSettings';
import UpdateSettings from './pages/settings/UpdateSettings';

export interface AdminRoute extends RouteObject {
  path: string;
  label: string;
  icon?: React.ReactNode;
  children?: AdminRoute[];
}

export const adminRoutes: AdminRoute[] = [
  {
    path: '/',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    element: <DashboardPage />,
  },
  {
    path: '/admin/inventory',
    label: 'Inventory',
    icon: <InventoryIcon />,
    element: <InventoryLayout />,
    children: [
      {
        path: '',
        element: <InventoryPage />,
      },
      {
        path: 'settings',
        label: 'Settings',
        element: <InventorySettingsPage />,
      },
      {
        path: 'alerts',
        label: 'Stock Alerts',
        element: <StockAlertsPage />,
      },
    ],
  },
  {
    path: '/fulfillment',
    label: 'Fulfillment',
    icon: <LocalShippingIcon />,
    element: <FulfillmentPage />,
  },
  {
    path: '/admin/settings',
    label: 'Settings',
    icon: <SettingsIcon />,
    element: <SettingsLayout />,
    children: [
      {
        path: 'analytics',
        label: 'Analytics',
        icon: <AnalyticsIcon />,
        element: <AnalyticsSettings />,
      },
      {
        path: 'updates',
        element: <UpdateSettings />,
      },
    ],
  },
];
