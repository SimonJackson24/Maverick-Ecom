import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  ListSubheader,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Inventory,
  Collections,
  Category,
  LocalMall,
  People,
  Settings,
  Notifications,
  AccountCircle,
  Email,
  Analytics,
  Campaign,
  Extension,
  LocalShipping,
  Payment,
  Security,
  Store,
  LocalFireDepartment,
  SupportAgent,
  Subscriptions,
  ContentPaste,
  Language,
  Storage,
  CloudUpload,
  Tune,
  Business,
  Receipt,
  CurrencyExchange,
  LocationOn,
  Shield,
  Code,
  Speed,
  Api,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../common/Logo';

const DRAWER_WIDTH = 280;

// Group menu items by category
const menuGroups = [
  {
    header: 'Overview',
    items: [
      { text: 'Dashboard', icon: Dashboard, path: '/admin/dashboard' },
    ]
  },
  {
    header: 'Catalog',
    items: [
      { text: 'Products', icon: Inventory, path: '/admin/products' },
      { text: 'Collections', icon: Collections, path: '/admin/collections' },
      { text: 'Categories', icon: Category, path: '/admin/categories' },
      { text: 'Scents', icon: LocalFireDepartment, path: '/admin/scents' },
    ]
  },
  {
    header: 'Sales',
    items: [
      { text: 'Orders', icon: LocalMall, path: '/admin/orders' },
      { text: 'Customers', icon: People, path: '/admin/customers' },
      { text: 'Subscriptions', icon: Subscriptions, path: '/admin/subscriptions' },
    ]
  },
  {
    header: 'Content',
    items: [
      { text: 'Pages', icon: ContentPaste, path: '/admin/content/pages' },
      { text: 'Blog', icon: ContentPaste, path: '/admin/content/blog' },
      { text: 'Navigation', icon: ContentPaste, path: '/admin/content/navigation' },
    ]
  },
  {
    header: 'Marketing',
    items: [
      { text: 'Campaigns', icon: Campaign, path: '/admin/marketing/campaigns' },
      { text: 'Email', icon: Email, path: '/admin/marketing/email' },
      { text: 'Analytics', icon: Analytics, path: '/admin/marketing/analytics' },
      { text: 'SEO', icon: Campaign, path: '/admin/marketing/seo' },
    ]
  },
  {
    header: 'Support',
    items: [
      { text: 'Tickets', icon: SupportAgent, path: '/admin/support/tickets' },
      { text: 'Knowledge Base', icon: SupportAgent, path: '/admin/support/knowledge-base' },
      { text: 'FAQ', icon: SupportAgent, path: '/admin/support/faq' },
    ]
  },
  {
    header: 'Settings',
    items: [
      { text: 'General', icon: Tune, path: '/admin/settings/general' },
      { text: 'Store', icon: Store, path: '/admin/settings/store' },
      { text: 'Company', icon: Business, path: '/admin/settings/company' },
      { text: 'User', icon: AccountCircle, path: '/admin/settings/user' },
      { text: 'Payment', icon: Payment, path: '/admin/settings/payment' },
      { text: 'Shipping', icon: LocalShipping, path: '/admin/settings/shipping' },
      { text: 'Tax', icon: Receipt, path: '/admin/settings/tax' },
      { text: 'Currency', icon: CurrencyExchange, path: '/admin/settings/currency' },
      { text: 'Location', icon: LocationOn, path: '/admin/settings/location' },
      { text: 'Email', icon: Email, path: '/admin/settings/email' },
      { text: 'Notifications', icon: Notifications, path: '/admin/settings/notifications' },
      { text: 'Integrations', icon: Extension, path: '/admin/settings/integrations' },
      { text: 'Security', icon: Security, path: '/admin/settings/security' },
      { text: 'Privacy', icon: Shield, path: '/admin/settings/privacy' },
      { text: 'API', icon: Api, path: '/admin/settings/api' },
      { text: 'Localization', icon: Language, path: '/admin/settings/localization' },
      { text: 'Storage', icon: Storage, path: '/admin/settings/storage' },
      { text: 'Backup', icon: CloudUpload, path: '/admin/settings/backup' },
      { text: 'Performance', icon: Speed, path: '/admin/settings/performance' },
      { text: 'Developer', icon: Code, path: '/admin/settings/developer' },
    ]
  }
];

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      handleDrawerToggle();
    }
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: DRAWER_WIDTH }}>
      <Box sx={{ p: 2 }}>
        <Logo />
      </Box>
      <Divider />
      {menuGroups.map((group, index) => (
        <List
          key={group.header}
          subheader={
            <ListSubheader
              sx={{
                bgcolor: 'background.paper',
                color: 'text.secondary',
                fontWeight: 'bold',
                lineHeight: '48px'
              }}
            >
              {group.header}
            </ListSubheader>
          }
        >
          {group.items.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path || 
                (item.path.includes('/admin/settings') && location.pathname.startsWith(item.path))}
              sx={{
                pl: 3,
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon>
                <item.icon 
                  color={location.pathname === item.path || 
                    (item.path.includes('/admin/settings') && location.pathname.startsWith(item.path)) 
                    ? 'primary' 
                    : 'inherit'} 
                />
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  variant: 'body2',
                  sx: { fontWeight: location.pathname === item.path ? 'bold' : 'normal' }
                }}
              />
            </ListItem>
          ))}
          {index < menuGroups.length - 1 && <Divider sx={{ my: 1 }} />}
        </List>
      ))}
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(10px)',
          background: 'rgba(31, 41, 55, 0.8)',
        }}
      >
        <Toolbar sx={{ marginLeft: { sm: `${DRAWER_WIDTH}px` } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton 
            color="inherit"
            sx={{ 
              '&:hover': { 
                bgcolor: 'rgba(255, 255, 255, 0.05)',
              },
              mr: 1 
            }}
          >
            <Notifications />
          </IconButton>
          <IconButton 
            color="inherit"
            sx={{ 
              '&:hover': { 
                bgcolor: 'rgba(255, 255, 255, 0.05)',
              }
            }}
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.default',
              height: '100vh',
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: (theme) => theme.zIndex.drawer,
              backgroundImage: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Header;
