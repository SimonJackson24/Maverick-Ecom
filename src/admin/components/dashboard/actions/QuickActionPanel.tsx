import React from 'react';
import {
  Card,
  Typography,
  Box,
  Grid,
  IconButton,
  Button,
  Tooltip,
  Divider,
  Badge,
} from '@mui/material';
import {
  Add,
  LocalShipping,
  Inventory,
  People,
  AttachMoney,
  Discount,
  Campaign,
  Settings,
  Notifications,
  Warning,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  badge?: number;
  disabled?: boolean;
}

const defaultActions: QuickAction[] = [
  {
    id: 'new-order',
    label: 'New Order',
    description: 'Create a new manual order',
    icon: <Add />,
    path: '/admin/orders/new',
    color: 'primary',
  },
  {
    id: 'ship-orders',
    label: 'Ship Orders',
    description: '5 orders ready to ship',
    icon: <LocalShipping />,
    path: '/admin/orders?status=ready_to_ship',
    color: 'success',
    badge: 5,
  },
  {
    id: 'low-stock',
    label: 'Low Stock',
    description: '3 products need restock',
    icon: <Warning />,
    path: '/admin/products?filter=low_stock',
    color: 'warning',
    badge: 3,
  },
  {
    id: 'new-product',
    label: 'Add Product',
    description: 'Create a new product',
    icon: <Inventory />,
    path: '/admin/products/new',
    color: 'info',
  },
  {
    id: 'customers',
    label: 'Customers',
    description: 'View customer list',
    icon: <People />,
    path: '/admin/customers',
    color: 'primary',
  },
  {
    id: 'promotions',
    label: 'Promotions',
    description: 'Manage discounts',
    icon: <Discount />,
    path: '/admin/promotions',
    color: 'secondary',
  },
  {
    id: 'campaigns',
    label: 'Campaigns',
    description: 'Email campaigns',
    icon: <Campaign />,
    path: '/admin/marketing/campaigns',
    color: 'info',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'System settings',
    icon: <Settings />,
    path: '/admin/settings',
    color: 'primary',
  },
];

interface QuickActionPanelProps {
  actions?: QuickAction[];
  loading?: boolean;
  error?: Error | null;
  onActionClick?: (action: QuickAction) => void;
}

const QuickActionPanel: React.FC<QuickActionPanelProps> = ({
  actions = defaultActions,
  loading = false,
  error = null,
  onActionClick,
}) => {
  const navigate = useNavigate();

  const handleActionClick = (action: QuickAction) => {
    if (action.disabled) return;
    if (onActionClick) {
      onActionClick(action);
    } else {
      navigate(action.path);
    }
  };

  if (loading) {
    return (
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Box sx={{ height: 100, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ width: 40, height: 40, bgcolor: 'background.paper', borderRadius: 1 }} />
                  <Box sx={{ width: '60%', height: 20, bgcolor: 'background.paper' }} />
                  <Box sx={{ width: '40%', height: 16, bgcolor: 'background.paper' }} />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ p: 3 }}>
        <Typography color="error" gutterBottom>
          Error loading quick actions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error.message}
        </Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        {actions.map((action) => (
          <Grid item xs={12} sm={6} md={3} key={action.id}>
            <Tooltip title={action.disabled ? 'This action is currently unavailable' : action.description}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.default',
                  borderRadius: 1,
                  cursor: action.disabled ? 'not-allowed' : 'pointer',
                  opacity: action.disabled ? 0.5 : 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: action.disabled ? 'background.default' : 'background.paper',
                    transform: action.disabled ? 'none' : 'translateY(-2px)',
                  },
                }}
                onClick={() => handleActionClick(action)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Badge badgeContent={action.badge} color={action.color} max={99}>
                    <IconButton
                      size="small"
                      color={action.color}
                      sx={{
                        bgcolor: `${action.color}.soft`,
                        '&:hover': {
                          bgcolor: `${action.color}.soft`,
                        },
                      }}
                    >
                      {action.icon}
                    </IconButton>
                  </Badge>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {action.label}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </Box>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default QuickActionPanel;
