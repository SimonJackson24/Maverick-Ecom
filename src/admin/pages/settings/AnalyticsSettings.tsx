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
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ANALYTICS_SETTINGS } from '../../../graphql/queries/analytics';
import { UPDATE_ANALYTICS_SETTINGS } from '../../../graphql/mutations/analytics';

const AnalyticsSettings: React.FC = () => {
  const { loading, error, data } = useQuery(GET_ANALYTICS_SETTINGS);
  const [updateSettings, { loading: updating }] = useMutation(UPDATE_ANALYTICS_SETTINGS);

  const [settings, setSettings] = React.useState({
    enableGoogleAnalytics: true,
    googleAnalyticsId: '',
    enableHeatmaps: false,
    trackUserBehavior: true,
    anonymizeIp: true,
    enableEcommerce: true,
    enableConversionTracking: true,
    enableABTesting: true,
    maxConcurrentTests: 3,
    trackingDomains: [] as string[],
    excludedPaths: [] as string[],
    customDimensions: [] as string[],
    conversionGoals: [] as string[],
    sampleRate: 100,
    sessionTimeout: 30,
    crossDomainTracking: false,
    userIdTracking: true,
  });

  React.useEffect(() => {
    if (data?.analyticsSettings) {
      setSettings(data.analyticsSettings);
    }
  }, [data]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateSettings({
        variables: {
          input: settings,
        },
      });
    } catch (error) {
      console.error('Failed to update analytics settings:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading analytics settings: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Analytics Settings
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Google Analytics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableGoogleAnalytics}
                    onChange={handleChange('enableGoogleAnalytics')}
                  />
                }
                label="Enable Google Analytics"
              />
            </Grid>
            {settings.enableGoogleAnalytics && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Google Analytics ID"
                  value={settings.googleAnalyticsId}
                  onChange={handleChange('googleAnalyticsId')}
                  helperText="Enter your Google Analytics tracking ID (e.g., UA-XXXXXXXX-X or G-XXXXXXXXXX)"
                />
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tracking Options
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.trackUserBehavior}
                    onChange={handleChange('trackUserBehavior')}
                  />
                }
                label="Track User Behavior"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableHeatmaps}
                    onChange={handleChange('enableHeatmaps')}
                  />
                }
                label="Enable Heatmaps"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.anonymizeIp}
                    onChange={handleChange('anonymizeIp')}
                  />
                }
                label="Anonymize IP Addresses"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableEcommerce}
                    onChange={handleChange('enableEcommerce')}
                  />
                }
                label="Enable E-commerce Tracking"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Advanced Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Sample Rate (%)"
                value={settings.sampleRate}
                onChange={handleChange('sampleRate')}
                InputProps={{ inputProps: { min: 0, max: 100 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Session Timeout (minutes)"
                value={settings.sessionTimeout}
                onChange={handleChange('sessionTimeout')}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.crossDomainTracking}
                    onChange={handleChange('crossDomainTracking')}
                  />
                }
                label="Enable Cross-Domain Tracking"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.userIdTracking}
                    onChange={handleChange('userIdTracking')}
                  />
                }
                label="Enable User ID Tracking"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={updating}
        >
          {updating ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </Box>
    </Box>
  );
};

export default AnalyticsSettings;
