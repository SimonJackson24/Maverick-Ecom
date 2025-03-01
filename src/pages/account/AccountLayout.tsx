import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import {
  Person,
  ShoppingBag,
  Favorite,
  LocationOn,
  Settings,
  ExitToApp,
} from '@mui/icons-material';
import { useAuth } from '../../store/AuthContext';

const navigation = [
  { name: 'Profile', to: '/account/profile', icon: Person },
  { name: 'Orders', to: '/account/orders', icon: ShoppingBag },
  { name: 'Wishlist', to: '/account/wishlist', icon: Favorite },
  { name: 'Addresses', to: '/account/addresses', icon: LocationOn },
  { name: 'Settings', to: '/account/settings', icon: Settings },
];

const AccountLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Account
      </Typography>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Paper sx={{ width: 280, flexShrink: 0 }}>
          <List>
            {navigation.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.to}
                  selected={location.pathname === item.to}
                >
                  <ListItemIcon>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton onClick={logout}>
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Paper>
        <Paper sx={{ flex: 1, p: 3 }}>
          <Outlet />
        </Paper>
      </Box>
    </Container>
  );
};

export default AccountLayout;
