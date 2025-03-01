import React from 'react';
import { motion } from 'framer-motion';
import StatsCard from '../../components/dashboard/StatsCard';
import {
  AttachMoney,
  ShoppingBag,
  People,
  Inventory,
  Add,
  LocalShipping,
  Settings,
  Campaign,
} from '@mui/icons-material';
import { Grid, Box, Typography } from '@mui/material';
import PageLayout from '../../components/layout/PageLayout';
import RevenueMetrics from '../../components/dashboard/metrics/RevenueMetrics';
import OrderMetrics from '../../components/dashboard/metrics/OrderMetrics';
import ProductMetrics from '../../components/dashboard/metrics/ProductMetrics';
import CustomerMetrics from '../../components/dashboard/metrics/CustomerMetrics';
import QuickActionPanel from '../../components/dashboard/actions/QuickActionPanel';
import AlertNotificationCenter from '../../components/dashboard/notifications/AlertNotificationCenter';
import RecentActivityTimeline from '../../components/dashboard/activity/RecentActivityTimeline';
import DataExportTools from '../../components/dashboard/export/DataExportTools';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_STATS } from '../../../graphql/queries/admin';
import { DashboardStats, DashboardFilters, DashboardSettings } from '../../../types/admin';
import { Helmet } from 'react-helmet-async';

const defaultFilters: DashboardFilters = {
  dateRange: {
    start: new Date(),
    end: new Date(),
  },
  comparison: 'month',
};

const defaultSettings: DashboardSettings = {
  defaultView: 'overview',
  refreshInterval: 300000, // 5 minutes
  visibleMetrics: ['revenue', 'orders', 'products', 'customers'],
  chartPreferences: {
    type: 'line',
    showLegend: true,
    colors: ['#3B82F6', '#10B981', '#6366F1']
  }
};

const AdminDashboard: React.FC = () => {
  const [filters, setFilters] = React.useState<DashboardFilters>(defaultFilters);
  const [settings] = React.useState<DashboardSettings>(defaultSettings);
  const [expandedMetric, setExpandedMetric] = React.useState<string | null>(null);

  const { loading, error, data, refetch } = useQuery(GET_DASHBOARD_STATS, {
    variables: {
      filters,
    },
    pollInterval: settings.refreshInterval,
  });

  const handleMetricExpand = (metric: string) => {
    setExpandedMetric(expandedMetric === metric ? null : metric);
  };

  const stats: DashboardStats = data?.dashboardStats || {};

  const statsData = [
    {
      title: 'Total Revenue',
      value: `£${stats.revenue?.total?.toLocaleString()}`,
      trend: stats.revenue?.percentageChange,
      icon: <AttachMoney />,
      quickActions: [
        {
          label: 'View Revenue Report',
          icon: <AttachMoney />,
          path: '/admin/reports/revenue',
          description: 'View detailed revenue analysis'
        },
        {
          label: 'Export Data',
          icon: <Add />,
          path: '/admin/reports/export',
          description: 'Export revenue data'
        }
      ]
    },
    {
      title: 'Orders',
      value: stats.orders?.total?.toString(),
      trend: stats.orders?.percentageChange,
      icon: <ShoppingBag />,
      quickActions: [
        {
          label: 'View All Orders',
          icon: <ShoppingBag />,
          path: '/admin/orders',
          description: 'View and manage all orders'
        },
        {
          label: 'Create Order',
          icon: <Add />,
          path: '/admin/orders/new',
          description: 'Create a new manual order'
        },
        {
          label: 'Pending Orders',
          icon: <ShoppingBag />,
          path: '/admin/orders?status=pending',
          description: 'View orders awaiting processing'
        }
      ]
    },
    {
      title: 'Customers',
      value: stats.customers?.total?.toString(),
      trend: stats.customers?.percentageChange,
      icon: <People />,
      quickActions: [
        {
          label: 'View All Customers',
          icon: <People />,
          path: '/admin/customers',
          description: 'View and manage customer accounts'
        },
        {
          label: 'Add Customer',
          icon: <Add />,
          path: '/admin/customers/new',
          description: 'Create a new customer account'
        },
        {
          label: 'Customer Support',
          icon: <People />,
          path: '/admin/support',
          description: 'View customer support tickets'
        }
      ]
    },
    {
      title: 'Products',
      value: stats.products?.total?.toString(),
      trend: ((stats.products?.total - stats.products?.outOfStock) / stats.products?.total * 100) - 100,
      icon: <Inventory />,
      quickActions: [
        {
          label: 'View All Products',
          icon: <Inventory />,
          path: '/admin/products',
          description: 'View and manage all products'
        },
        {
          label: 'Add Product',
          icon: <Add />,
          path: '/admin/products/new',
          description: 'Create a new product'
        },
        {
          label: 'Low Stock Items',
          icon: <Inventory />,
          path: '/admin/products?filter=low-stock',
          description: 'View products with low inventory'
        }
      ]
    },
  ];

  return (
    <PageLayout title="Dashboard">
      <Helmet>
        <title>Dashboard | Wick & Wax Co Admin</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Quick Actions and Stats */}
        <Box sx={{ mb: 4 }}>
          <QuickActionPanel
            actions={[
              {
                id: 'new-order',
                label: 'New Order',
                description: 'Create a new order',
                icon: <Add />,
                path: '/admin/orders/new',
                color: 'primary'
              },
              {
                id: 'ship-orders',
                label: 'Ship Orders',
                description: `${stats.orders?.shipping || 0} orders to ship`,
                icon: <LocalShipping />,
                path: '/admin/orders?status=ready_to_ship',
                color: 'info',
                badge: stats.orders?.shipping
              },
              {
                id: 'settings',
                label: 'Settings',
                description: 'System settings',
                icon: <Settings />,
                path: '/admin/settings',
                color: 'secondary'
              },
              {
                id: 'marketing',
                label: 'Marketing',
                description: 'Campaign management',
                icon: <Campaign />,
                path: '/admin/marketing',
                color: 'success'
              }
            ]}
          />

          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              {statsData.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={stat.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <StatsCard {...stat} />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* Detailed Metrics Section */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              {/* Metrics Grid */}
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                  gap: 3,
                  mb: 3,
                  position: 'relative'
                }}
              >
                <motion.div
                  layout
                  style={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                    gap: '24px',
                    gridColumn: expandedMetric ? '1 / -1' : 'auto',
                    width: '100%'
                  }}
                >
                  {settings.visibleMetrics.map((metric) => {
                    const isExpanded = expandedMetric === metric;
                    const getMetricComponent = () => {
                      switch (metric) {
                        case 'revenue':
                          return (
                            <RevenueMetrics
                              data={stats.revenue}
                              settings={settings}
                              isExpanded={isExpanded}
                              onExpand={() => handleMetricExpand('revenue')}
                            />
                          );
                        case 'orders':
                          return (
                            <OrderMetrics
                              data={stats.orders}
                              settings={settings}
                              isExpanded={isExpanded}
                              onExpand={() => handleMetricExpand('orders')}
                            />
                          );
                        case 'products':
                          return (
                            <ProductMetrics
                              data={stats.products}
                              settings={settings}
                              isExpanded={isExpanded}
                              onExpand={() => handleMetricExpand('products')}
                            />
                          );
                        case 'customers':
                          return (
                            <CustomerMetrics
                              data={stats.customers}
                              settings={settings}
                              isExpanded={isExpanded}
                              onExpand={() => handleMetricExpand('customers')}
                            />
                          );
                        default:
                          return null;
                      }
                    };

                    return (
                      <Box
                        key={metric}
                        sx={{
                          gridColumn: isExpanded ? '1 / -1' : 'auto',
                          width: '100%',
                          position: 'relative',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {getMetricComponent()}
                      </Box>
                    );
                  })}
                </motion.div>
              </Box>

              {/* Recent Activity Timeline */}
              <RecentActivityTimeline
                activities={[]}
                loading={loading}
                error={error}
                onRefresh={refetch}
              />
            </Grid>

            <Grid item xs={12} lg={4}>
              {/* Notifications and Export Tools */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <AlertNotificationCenter
                  alerts={[]}
                  loading={loading}
                  error={error}
                  onRefresh={refetch}
                />

                <DataExportTools
                  availableFields={[
                    'order_id',
                    'customer_name',
                    'product_name',
                    'amount',
                    'status',
                    'date'
                  ]}
                  recentJobs={[]}
                  loading={loading}
                  onExport={async () => {}}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </PageLayout>
  );
};

export default AdminDashboard;
