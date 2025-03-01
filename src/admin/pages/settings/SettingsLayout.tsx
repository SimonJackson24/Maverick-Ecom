import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
  Box,
  Typography,
  Grid,
} from '@mui/material';
import {
  Settings as GeneralIcon,
  Security as SecurityIcon,
  PrivacyTip as PrivacyIcon,
  Inventory as ProductIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Email as EmailIcon,
  Analytics as AnalyticsIcon,
  Extension as IntegrationIcon,
  Store as StoreIcon,
  Palette as ThemeIcon,
  Notifications as NotificationIcon,
  Language as SeoIcon,
} from '@mui/icons-material';
import { CloudUploadOutlined } from '@ant-design/icons';
import PageLayout from '../../components/layout/PageLayout';

interface SettingsMenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  category: 'general' | 'store' | 'integrations';
}

const settingsMenuItems: SettingsMenuItem[] = [
  // General Settings
  { path: 'general', label: 'General', icon: <GeneralIcon />, category: 'general' },
  { path: 'security', label: 'Security', icon: <SecurityIcon />, category: 'general' },
  { path: 'privacy', label: 'Privacy', icon: <PrivacyIcon />, category: 'general' },
  { path: 'theme', label: 'Theme', icon: <ThemeIcon />, category: 'general' },
  { path: 'notifications', label: 'Notifications', icon: <NotificationIcon />, category: 'general' },
  { path: 'analytics', label: 'Analytics', icon: <AnalyticsIcon />, category: 'general' },
  { path: 'updates', label: 'Updates', icon: <CloudUploadOutlined />, category: 'general' },

  // Store Settings
  { path: 'store', label: 'Store', icon: <StoreIcon />, category: 'store' },
  { path: 'products', label: 'Products', icon: <ProductIcon />, category: 'store' },
  { path: 'shipping', label: 'Shipping', icon: <ShippingIcon />, category: 'store' },
  { path: 'payment', label: 'Payment', icon: <PaymentIcon />, category: 'store' },
  { path: 'seo', label: 'SEO', icon: <SeoIcon />, category: 'store' },

  // Integrations
  { path: 'email', label: 'Email', icon: <EmailIcon />, category: 'integrations' },
  { path: 'integrations', label: 'Integrations', icon: <IntegrationIcon />, category: 'integrations' },
];

const SettingsLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split('/').pop() || '';

  const handleMenuItemClick = (path: string) => {
    navigate(`/admin/settings/${path}`);
  };

  const renderMenuSection = (category: string, items: SettingsMenuItem[]) => (
    <>
      <Typography variant="subtitle2" color="textSecondary" sx={{ px: 2, py: 1 }}>
        {category.toUpperCase()}
      </Typography>
      <List>
        {items.map((item) => (
          <ListItem
            button
            key={item.path}
            selected={currentPath === item.path}
            onClick={() => handleMenuItemClick(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </>
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <Paper sx={{ height: '100%' }}>
          {renderMenuSection('General', settingsMenuItems.filter(item => item.category === 'general'))}
          {renderMenuSection('Store', settingsMenuItems.filter(item => item.category === 'store'))}
          {renderMenuSection('Integrations', settingsMenuItems.filter(item => item.category === 'integrations'))}
        </Paper>
      </Grid>
      <Grid item xs={12} md={9}>
        <Paper sx={{ p: 2 }}>
          <Outlet />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SettingsLayout;
