import React, { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useMutation } from '@apollo/client';
import { UPDATE_CUSTOMER_SETTINGS, CHANGE_PASSWORD } from '../../graphql/customer';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    stockAlerts: true,
  });

  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');

  const [updateSettings, { loading, error }] = useMutation(UPDATE_CUSTOMER_SETTINGS);
  const [changePassword, { loading: changingPassword }] = useMutation(CHANGE_PASSWORD);

  const handleSettingChange = async (setting: string, checked: boolean) => {
    try {
      await updateSettings({
        variables: {
          input: {
            ...settings,
            [setting]: checked,
          },
        },
      });
      setSettings(prev => ({ ...prev, [setting]: checked }));
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      await changePassword({
        variables: {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
      });
      setPasswordDialog(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password');
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Account Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Email Preferences
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              disabled={loading}
            />
          }
          label="Email Notifications"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.orderUpdates}
              onChange={(e) => handleSettingChange('orderUpdates', e.target.checked)}
              disabled={loading}
            />
          }
          label="Order Updates"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.promotionalEmails}
              onChange={(e) => handleSettingChange('promotionalEmails', e.target.checked)}
              disabled={loading}
            />
          }
          label="Promotional Emails"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.stockAlerts}
              onChange={(e) => handleSettingChange('stockAlerts', e.target.checked)}
              disabled={loading}
            />
          }
          label="Stock Alerts"
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="h6" gutterBottom>
          Security
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setPasswordDialog(true)}
          disabled={loading}
        >
          Change Password
        </Button>
      </Box>

      <Dialog
        open={passwordDialog}
        onClose={() => setPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button
            onClick={handlePasswordChange}
            variant="contained"
            disabled={changingPassword}
            startIcon={changingPassword ? <CircularProgress size={20} /> : null}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsPage;
