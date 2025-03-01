import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_INVENTORY_SETTINGS = gql`
  query GetInventorySettings {
    inventorySettings {
      id
      enableLowStockAlerts
      defaultLowStockThreshold
      enableAutoReorder
      autoReorderThreshold
      autoReorderQuantity
      enableBatchTracking
      enableLocationTracking
      enableSupplierTracking
      enableCostTracking
      enableExpiryTracking
    }
  }
`;

const UPDATE_INVENTORY_SETTINGS = gql`
  mutation UpdateInventorySettings($input: UpdateInventorySettingsInput!) {
    updateInventorySettings(input: $input) {
      id
      enableLowStockAlerts
      defaultLowStockThreshold
      enableAutoReorder
      autoReorderThreshold
      autoReorderQuantity
      enableBatchTracking
      enableLocationTracking
      enableSupplierTracking
      enableCostTracking
      enableExpiryTracking
    }
  }
`;

const InventorySettings: React.FC = () => {
  const { data, loading, error } = useQuery(GET_INVENTORY_SETTINGS);
  const [updateSettings] = useMutation(UPDATE_INVENTORY_SETTINGS);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [settings, setSettings] = useState({
    enableLowStockAlerts: true,
    defaultLowStockThreshold: 10,
    enableAutoReorder: false,
    autoReorderThreshold: 5,
    autoReorderQuantity: 20,
    enableBatchTracking: false,
    enableLocationTracking: true,
    enableSupplierTracking: true,
    enableCostTracking: true,
    enableExpiryTracking: false,
  });

  React.useEffect(() => {
    if (data?.inventorySettings) {
      setSettings(data.inventorySettings);
    }
  }, [data]);

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : parseInt(event.target.value) || 0;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateSettings({
        variables: {
          input: settings
        }
      });
      setSuccessMessage('Settings updated successfully');
    } catch (err) {
      setErrorMessage('Failed to update settings');
      console.error('Error updating settings:', err);
    }
  };

  if (loading) return <Box p={3}>Loading settings...</Box>;
  if (error) return <Alert severity="error">Error loading settings</Alert>;

  return (
    <Box p={3}>
      <Paper elevation={2}>
        <Box p={3}>
          <Typography variant="h5" gutterBottom>
            Inventory Settings
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={3}>
            {/* Stock Alerts Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Stock Alerts
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableLowStockAlerts}
                        onChange={handleChange('enableLowStockAlerts')}
                      />
                    }
                    label="Enable Low Stock Alerts"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Default Low Stock Threshold"
                    type="number"
                    value={settings.defaultLowStockThreshold}
                    onChange={handleChange('defaultLowStockThreshold')}
                    disabled={!settings.enableLowStockAlerts}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Auto Reorder Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Auto Reorder
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableAutoReorder}
                        onChange={handleChange('enableAutoReorder')}
                      />
                    }
                    label="Enable Auto Reorder"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Auto Reorder Threshold"
                    type="number"
                    value={settings.autoReorderThreshold}
                    onChange={handleChange('autoReorderThreshold')}
                    disabled={!settings.enableAutoReorder}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Auto Reorder Quantity"
                    type="number"
                    value={settings.autoReorderQuantity}
                    onChange={handleChange('autoReorderQuantity')}
                    disabled={!settings.enableAutoReorder}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Tracking Features Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Tracking Features
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableBatchTracking}
                        onChange={handleChange('enableBatchTracking')}
                      />
                    }
                    label="Enable Batch Tracking"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableLocationTracking}
                        onChange={handleChange('enableLocationTracking')}
                      />
                    }
                    label="Enable Location Tracking"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableSupplierTracking}
                        onChange={handleChange('enableSupplierTracking')}
                      />
                    }
                    label="Enable Supplier Tracking"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableCostTracking}
                        onChange={handleChange('enableCostTracking')}
                      />
                    }
                    label="Enable Cost Tracking"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableExpiryTracking}
                        onChange={handleChange('enableExpiryTracking')}
                      />
                    }
                    label="Enable Expiry Tracking"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Box mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Save Settings
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
      >
        <Alert severity="error" onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InventorySettings;
