import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';

const EmailSettings: React.FC = () => {
  const [settings, setSettings] = React.useState({
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: 'Wick & Wax Co.',
    enableSSL: true,
    enableEmailNotifications: true,
    orderConfirmationTemplate: '',
    shippingConfirmationTemplate: '',
    orderStatusTemplate: '',
    abandonedCartTemplate: '',
    welcomeEmailTemplate: '',
    passwordResetTemplate: '',
    reviewRequestTemplate: '',
    newsletterTemplate: '',
    emailFooterText: '',
    enableEmailTracking: true,
    bounceHandling: 'automatic',
    maxRetriesCount: 3,
    retryIntervalMinutes: 30,
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectChange = (field: string) => (event: React.ChangeEvent<{ value: unknown }>) => {
    setSettings((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving email settings:', settings);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Email Settings
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Configure email server settings and notification templates
      </Typography>

      <Grid container spacing={3}>
        {/* SMTP Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                SMTP Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="SMTP Host"
                    value={settings.smtpHost}
                    onChange={handleChange('smtpHost')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="SMTP Port"
                    type="number"
                    value={settings.smtpPort}
                    onChange={handleChange('smtpPort')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="SMTP Username"
                    value={settings.smtpUsername}
                    onChange={handleChange('smtpUsername')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="SMTP Password"
                    type="password"
                    value={settings.smtpPassword}
                    onChange={handleChange('smtpPassword')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableSSL}
                        onChange={handleChange('enableSSL')}
                      />
                    }
                    label="Enable SSL/TLS"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Email Identity */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Email Identity
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="From Email"
                    value={settings.fromEmail}
                    onChange={handleChange('fromEmail')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="From Name"
                    value={settings.fromName}
                    onChange={handleChange('fromName')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Footer Text"
                    multiline
                    rows={3}
                    value={settings.emailFooterText}
                    onChange={handleChange('emailFooterText')}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Email Templates */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Email Templates
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Order Confirmation Template"
                    multiline
                    rows={4}
                    value={settings.orderConfirmationTemplate}
                    onChange={handleChange('orderConfirmationTemplate')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Shipping Confirmation Template"
                    multiline
                    rows={4}
                    value={settings.shippingConfirmationTemplate}
                    onChange={handleChange('shippingConfirmationTemplate')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Order Status Update Template"
                    multiline
                    rows={4}
                    value={settings.orderStatusTemplate}
                    onChange={handleChange('orderStatusTemplate')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Abandoned Cart Template"
                    multiline
                    rows={4}
                    value={settings.abandonedCartTemplate}
                    onChange={handleChange('abandonedCartTemplate')}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notification Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableEmailNotifications}
                        onChange={handleChange('enableEmailNotifications')}
                      />
                    }
                    label="Enable Email Notifications"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableEmailTracking}
                        onChange={handleChange('enableEmailTracking')}
                      />
                    }
                    label="Enable Email Tracking"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Bounce Handling</InputLabel>
                    <Select
                      value={settings.bounceHandling}
                      onChange={handleSelectChange('bounceHandling')}
                      label="Bounce Handling"
                    >
                      <MenuItem value="automatic">Automatic</MenuItem>
                      <MenuItem value="manual">Manual</MenuItem>
                      <MenuItem value="disabled">Disabled</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Max Retries Count"
                    type="number"
                    value={settings.maxRetriesCount}
                    onChange={handleChange('maxRetriesCount')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Retry Interval (minutes)"
                    type="number"
                    value={settings.retryIntervalMinutes}
                    onChange={handleChange('retryIntervalMinutes')}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default EmailSettings;
