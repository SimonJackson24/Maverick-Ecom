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
  Divider,
  Alert,
} from '@mui/material';

const SecuritySettings: React.FC = () => {
  const [settings, setSettings] = React.useState({
    requireTwoFactor: false,
    passwordExpiryDays: 90,
    sessionTimeoutMinutes: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    passwordRequireSpecialChar: true,
    passwordRequireNumber: true,
    passwordRequireUppercase: true,
    enableSecurityLog: true,
    securityLogRetentionDays: 30,
    enableDeviceTracking: true,
    maxDevicesPerUser: 5,
    ipWhitelist: [] as string[],
    adminIpRestriction: false,
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving security settings:', settings);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Security Settings
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Configure security settings and policies for your admin account
      </Typography>

      <Grid container spacing={3}>
        {/* Authentication Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Authentication
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.requireTwoFactor}
                        onChange={handleChange('requireTwoFactor')}
                      />
                    }
                    label="Require Two-Factor Authentication"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password Expiry (days)"
                    type="number"
                    value={settings.passwordExpiryDays}
                    onChange={handleChange('passwordExpiryDays')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Session Timeout (minutes)"
                    type="number"
                    value={settings.sessionTimeoutMinutes}
                    onChange={handleChange('sessionTimeoutMinutes')}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Password Policy */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Password Policy
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Minimum Password Length"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={handleChange('passwordMinLength')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Maximum Login Attempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={handleChange('maxLoginAttempts')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.passwordRequireSpecialChar}
                        onChange={handleChange('passwordRequireSpecialChar')}
                      />
                    }
                    label="Require Special Characters"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.passwordRequireNumber}
                        onChange={handleChange('passwordRequireNumber')}
                      />
                    }
                    label="Require Numbers"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.passwordRequireUppercase}
                        onChange={handleChange('passwordRequireUppercase')}
                      />
                    }
                    label="Require Uppercase Letters"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Monitoring */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Monitoring
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableSecurityLog}
                        onChange={handleChange('enableSecurityLog')}
                      />
                    }
                    label="Enable Security Logging"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Log Retention Period (days)"
                    type="number"
                    value={settings.securityLogRetentionDays}
                    onChange={handleChange('securityLogRetentionDays')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableDeviceTracking}
                        onChange={handleChange('enableDeviceTracking')}
                      />
                    }
                    label="Enable Device Tracking"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Maximum Devices per User"
                    type="number"
                    value={settings.maxDevicesPerUser}
                    onChange={handleChange('maxDevicesPerUser')}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* IP Restrictions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                IP Restrictions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.adminIpRestriction}
                        onChange={handleChange('adminIpRestriction')}
                      />
                    }
                    label="Enable IP Restrictions for Admin Access"
                  />
                </Grid>
                {settings.adminIpRestriction && (
                  <Grid item xs={12}>
                    <Alert severity="info">
                      IP restrictions are enabled. Make sure to add your current IP address to the
                      whitelist to maintain access.
                    </Alert>
                  </Grid>
                )}
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

export default SecuritySettings;
