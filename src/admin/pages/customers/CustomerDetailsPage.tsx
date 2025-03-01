import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Tab,
  Tabs,
  CircularProgress,
  Button,
} from '@mui/material';
import { Permission } from '../../types/permissions';
import RequirePermission from '../../components/auth/RequirePermission';
import AdminLayout from '../../components/layout/AdminLayout';

interface CustomerDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  status: 'active' | 'inactive' | 'blocked';
}

const CustomerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await customerService.getCustomerDetails(id);
        // setCustomer(response);
        
        // Mock data for now
        setCustomer({
          id: id || '',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          createdAt: new Date().toISOString(),
          totalOrders: 5,
          totalSpent: 499.99,
          loyaltyPoints: 250,
          status: 'active',
        });
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch customer details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomerDetails();
    }
  }, [id]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (error || !customer) {
    return (
      <AdminLayout>
        <Box p={3}>
          <Typography color="error">{error || 'Customer not found'}</Typography>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Customer Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <Typography variant="h5">
                      {customer.firstName} {customer.lastName}
                    </Typography>
                    <Typography color="textSecondary">{customer.email}</Typography>
                  </Grid>
                  <Grid item>
                    <RequirePermission permissions={[Permission.MANAGE_CUSTOMERS]}>
                      <Button variant="contained" color="primary">
                        Edit Customer
                      </Button>
                    </RequirePermission>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="Overview" />
                  <Tab label="Orders" />
                  <Tab label="Subscriptions" />
                  <Tab label="Loyalty" />
                </Tabs>
              </Box>

              {activeTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Customer Information
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography>
                            <strong>Customer ID:</strong> {customer.id}
                          </Typography>
                          <Typography>
                            <strong>Phone:</strong> {customer.phone || 'Not provided'}
                          </Typography>
                          <Typography>
                            <strong>Member Since:</strong>{' '}
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </Typography>
                          <Typography>
                            <strong>Status:</strong>{' '}
                            <span style={{ textTransform: 'capitalize' }}>
                              {customer.status}
                            </span>
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Customer Activity
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography>
                            <strong>Total Orders:</strong> {customer.totalOrders}
                          </Typography>
                          <Typography>
                            <strong>Total Spent:</strong> ${customer.totalSpent.toFixed(2)}
                          </Typography>
                          <Typography>
                            <strong>Loyalty Points:</strong> {customer.loyaltyPoints}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {activeTab === 1 && (
                <Typography>Order history will be displayed here</Typography>
              )}

              {activeTab === 2 && (
                <Typography>Subscription details will be displayed here</Typography>
              )}

              {activeTab === 3 && (
                <Typography>Loyalty program details will be displayed here</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default CustomerDetailsPage;
