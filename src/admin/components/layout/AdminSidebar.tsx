import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAdminAuth } from '../../../store/AdminAuthContext';
import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  CogIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ChartBarIcon,
  TagIcon,
  TruckIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  FireIcon,
  TicketIcon,
  HeartIcon,
  EnvelopeIcon,
  MegaphoneIcon,
  ChatBubbleLeftRightIcon,
  ChatBubbleOvalLeftIcon,
  ClockIcon,
  CubeIcon,
  ExclamationCircleIcon,
  AdjustmentsHorizontalIcon,
  InboxArrowDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { Box, List, ListItem, ListItemIcon, ListItemText, Collapse, Typography } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import type { Permission } from '../../../types/permissions';
import { permissions } from '../../../types/permissions';

interface AdminSidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

interface NavigationItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  permission?: Permission;
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    icon: <HomeIcon className="h-5 w-5" />,
    path: '/admin/dashboard',
    permission: permissions.VIEW_DASHBOARD
  },
  {
    name: 'Products',
    icon: <ShoppingBagIcon className="h-5 w-5" />,
    path: '/admin/products',
    permission: permissions.VIEW_PRODUCTS,
    children: [
      {
        name: 'All Products',
        icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
        path: '/admin/products',
        permission: permissions.VIEW_PRODUCTS
      },
      {
        name: 'Categories',
        icon: <TagIcon className="h-5 w-5" />,
        path: '/admin/products/categories',
        permission: permissions.MANAGE_CATEGORIES
      },
      {
        name: 'Scents',
        icon: <FireIcon className="h-5 w-5" />,
        path: '/admin/products/scents',
        permission: permissions.MANAGE_SCENTS
      },
      {
        name: 'Collections',
        icon: <HeartIcon className="h-5 w-5" />,
        path: '/admin/products/collections',
        permission: permissions.MANAGE_COLLECTIONS
      }
    ]
  },
  {
    name: 'Inventory',
    icon: <CubeIcon className="h-5 w-5" />,
    path: '/admin/inventory',
    permission: permissions.MANAGE_INVENTORY,
    children: [
      {
        name: 'Overview',
        icon: <ChartBarIcon className="h-5 w-5" />,
        path: '/admin/inventory',
        permission: permissions.MANAGE_INVENTORY
      },
      {
        name: 'Stock Alerts',
        icon: <ExclamationCircleIcon className="h-5 w-5" />,
        path: '/admin/inventory/alerts',
        permission: permissions.MANAGE_INVENTORY
      },
      {
        name: 'Settings',
        icon: <AdjustmentsHorizontalIcon className="h-5 w-5" />,
        path: '/admin/inventory/settings',
        permission: permissions.MANAGE_INVENTORY
      }
    ]
  },
  {
    name: 'Orders',
    icon: <TruckIcon className="h-5 w-5" />,
    path: '/admin/orders',
    permission: permissions.VIEW_ORDERS,
    children: [
      {
        name: 'All Orders',
        icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
        path: '/admin/orders',
        permission: permissions.VIEW_ORDERS
      },
      {
        name: 'Pending Orders',
        icon: <ClockIcon className="h-5 w-5" />,
        path: '/admin/orders/pending',
        permission: permissions.VIEW_ORDERS
      },
      {
        name: 'Fulfillment',
        icon: <InboxArrowDownIcon className="h-5 w-5" />,
        path: '/admin/orders/fulfillment',
        permission: permissions.MANAGE_FULFILLMENT
      }
    ]
  },
  {
    name: 'Customers',
    icon: <UsersIcon className="h-5 w-5" />,
    path: '/admin/customers',
    permission: permissions.VIEW_CUSTOMERS
  },
  {
    name: 'Marketing',
    icon: <MegaphoneIcon className="h-5 w-5" />,
    path: '/admin/marketing',
    permission: permissions.MANAGE_MARKETING,
    children: [
      {
        name: 'Email Campaigns',
        icon: <EnvelopeIcon className="h-5 w-5" />,
        path: '/admin/marketing/email',
        permission: permissions.MANAGE_MARKETING
      },
      {
        name: 'SEO Dashboard',
        icon: <MagnifyingGlassIcon className="h-5 w-5" />,
        path: '/admin/marketing/seo',
        permission: permissions.MANAGE_MARKETING
      }
    ]
  },
  {
    name: 'Support',
    icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />,
    path: '/admin/support',
    permission: permissions.VIEW_SUPPORT,
    children: [
      {
        name: 'Tickets',
        icon: <TicketIcon className="h-5 w-5" />,
        path: '/admin/support/tickets',
        permission: permissions.VIEW_SUPPORT
      },
      {
        name: 'Chat',
        icon: <ChatBubbleOvalLeftIcon className="h-5 w-5" />,
        path: '/admin/support/chat',
        permission: permissions.VIEW_SUPPORT
      }
    ]
  },
  {
    name: 'Settings',
    icon: <CogIcon className="h-5 w-5" />,
    path: '/admin/settings',
    permission: permissions.MANAGE_SETTINGS,
    children: [
      {
        name: 'Security',
        icon: <WrenchScrewdriverIcon className="h-5 w-5" />,
        path: '/admin/settings/security',
        permission: permissions.MANAGE_SETTINGS
      }
    ]
  }
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobile, onClose }) => {
  const { adminUser } = useAdminAuth();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const hasPermission = (permission?: Permission): boolean => {
    if (!permission) return true;
    if (adminUser?.role === 'admin') return true;
    return adminUser?.permissions?.includes(permission) ?? false;
  };

  const handleClick = (item: NavigationItem) => {
    if (item.children) {
      setExpandedItems(prev => 
        prev.includes(item.name) 
          ? prev.filter(name => name !== item.name)
          : [...prev, item.name]
      );
    }
    if (mobile && onClose && !item.children) {
      onClose();
    }
  };

  const renderNavItem = (item: NavigationItem, isChild = false) => {
    if (!hasPermission(item.permission)) return null;

    return (
      <Box key={item.path}>
        <ListItem
          component={NavLink}
          to={item.path}
          onClick={() => handleClick(item)}
          sx={{
            pl: isChild ? 4 : 2,
            py: 1,
            color: 'text.secondary',
            '&.active': {
              color: 'primary.main',
              bgcolor: 'action.selected',
              '& .MuiListItemIcon-root': {
                color: 'primary.main',
              },
            },
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {item.name}
              </Typography>
            }
          />
          {item.children && (
            expandedItems.includes(item.name) ? <ExpandLess /> : <ExpandMore />
          )}
        </ListItem>
        {item.children && (
          <Collapse in={expandedItems.includes(item.name)} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map(child => renderNavItem(child, true))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Box 
      sx={{ 
        width: '100%',
        height: '100%',
        bgcolor: 'background.paper',
        overflowY: 'auto',
        borderRight: 1,
        borderColor: 'divider'
      }}
    >
      <List component="nav" sx={{ pt: 2 }}>
        {navigationItems.map(item => renderNavItem(item))}
      </List>
    </Box>
  );
};

export default AdminSidebar;
