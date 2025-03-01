import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import InventoryAlertCard from '../../components/inventory/InventoryAlertCard';
import InventorySettingsForm from '../../components/inventory/InventorySettingsForm';
import { useInventoryAlerts, useInventorySettings, useInventoryActions } from '../../hooks/useInventory';

const InventoryAlertsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { alerts, loading: alertsLoading } = useInventoryAlerts();
  const { settings, loading: settingsLoading, updateSettings } = useInventorySettings();
  const { acknowledgeAlert, resolveAlert } = useInventoryActions();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await acknowledgeAlert(alertId);
      setSuccessMessage('Alert acknowledged successfully');
    } catch (error) {
      setErrorMessage('Failed to acknowledge alert');
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      await resolveAlert(alertId);
      setSuccessMessage('Alert resolved successfully');
    } catch (error) {
      setErrorMessage('Failed to resolve alert');
    }
  };

  const handleSaveSettings = async (newSettings: any) => {
    try {
      await updateSettings(newSettings);
      setSuccessMessage('Settings updated successfully');
    } catch (error) {
      setErrorMessage('Failed to update settings');
    }
  };

  if (alertsLoading || settingsLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Inventory Management
        </Typography>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Active Alerts" />
          <Tab label="Settings" />
        </Tabs>
      </Box>

      {successMessage && (
        <Alert
          severity="success"
          onClose={() => setSuccessMessage('')}
          sx={{ mb: 2 }}
        >
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert
          severity="error"
          onClose={() => setErrorMessage('')}
          sx={{ mb: 2 }}
        >
          {errorMessage}
        </Alert>
      )}

      {activeTab === 0 && (
        <Stack spacing={2}>
          {alerts.length === 0 ? (
            <Alert severity="info">No active inventory alerts</Alert>
          ) : (
            alerts.map((alert) => (
              <InventoryAlertCard
                key={alert.id}
                alert={alert}
                onAcknowledge={handleAcknowledgeAlert}
                onResolve={handleResolveAlert}
              />
            ))
          )}
        </Stack>
      )}

      {activeTab === 1 && settings && (
        <InventorySettingsForm
          settings={settings}
          onSave={handleSaveSettings}
        />
      )}
    </Container>
  );
};

export default InventoryAlertsPage;
