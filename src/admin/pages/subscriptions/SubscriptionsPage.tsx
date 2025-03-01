import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Chip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Edit as EditIcon, Pause as PauseIcon, PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { Permission } from '../../types/permissions';
import { Subscription, SubscriptionStatus } from '../../../types/subscription';
import SubscriptionService from '../../../services/SubscriptionService';
import RequirePermission from '../../components/auth/RequirePermission';
import AdminLayout from '../../components/layout/AdminLayout';

const SubscriptionsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<SubscriptionStatus | 'ALL'>('ALL');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const subscriptionService = SubscriptionService.getInstance();

  const fetchSubscriptions = async (status?: SubscriptionStatus) => {
    try {
      setLoading(true);
      const data = await subscriptionService.listSubscriptions(
        status ? { status } : undefined
      );
      setSubscriptions(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: SubscriptionStatus | 'ALL') => {
    setSelectedTab(newValue);
    fetchSubscriptions(newValue === 'ALL' ? undefined : newValue);
  };

  const handlePauseResume = async (subscription: Subscription) => {
    try {
      if (subscription.status === SubscriptionStatus.ACTIVE) {
        await subscriptionService.pauseSubscription(subscription.id);
      } else if (subscription.status === SubscriptionStatus.PAUSED) {
        await subscriptionService.resumeSubscription(subscription.id);
      }
      await fetchSubscriptions(selectedTab === 'ALL' ? undefined : selectedTab);
    } catch (err) {
      setError('Failed to update subscription status');
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'customerId', headerName: 'Customer', width: 150 },
    { field: 'planId', headerName: 'Plan', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === SubscriptionStatus.ACTIVE
              ? 'success'
              : params.value === SubscriptionStatus.PAUSED
              ? 'warning'
              : 'error'
          }
        />
      ),
    },
    {
      field: 'currentPeriodEnd',
      headerName: 'Next Billing',
      width: 150,
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <RequirePermission permissions={[Permission.MANAGE_SUBSCRIPTIONS]}>
            <IconButton
              onClick={() => handlePauseResume(params.row)}
              size="small"
            >
              {params.row.status === SubscriptionStatus.ACTIVE ? (
                <PauseIcon />
              ) : (
                <PlayArrowIcon />
              )}
            </IconButton>
          </RequirePermission>
          <RequirePermission permissions={[Permission.MANAGE_SUBSCRIPTIONS]}>
            <IconButton size="small">
              <EditIcon />
            </IconButton>
          </RequirePermission>
        </Box>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Subscriptions
        </Typography>
        <RequirePermission permissions={[Permission.MANAGE_SUBSCRIPTION_PLANS]}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
          >
            Create New Plan
          </Button>
        </RequirePermission>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                sx={{ mb: 2 }}
              >
                <Tab label="All" value="ALL" />
                <Tab label="Active" value={SubscriptionStatus.ACTIVE} />
                <Tab label="Paused" value={SubscriptionStatus.PAUSED} />
                <Tab label="Cancelled" value={SubscriptionStatus.CANCELLED} />
              </Tabs>

              <DataGrid
                rows={subscriptions}
                columns={columns}
                loading={loading}
                autoHeight
                pagination
                error={error}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                pageSizeOptions={[10, 25, 50]}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default SubscriptionsPage;
