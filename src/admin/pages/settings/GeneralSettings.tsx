import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';

interface GeneralSettingsData {
  storeName: string;
  contactEmail: string;
  supportEmail: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  language: string;
  timezone: string;
}

const GeneralSettings: React.FC = () => {
  const [settings, setSettings] = useState<GeneralSettingsData>({
    storeName: 'Wick and Wax Co',
    contactEmail: 'contact@wickandwax.co',
    supportEmail: 'support@wickandwax.co',
    phoneNumber: '+44 20 1234 5678',
    address: '123 Candle Street',
    city: 'London',
    state: 'England',
    postalCode: 'SW1A 1AA',
    country: 'United Kingdom',
    language: 'en',
    timezone: 'Europe/London',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof GeneralSettingsData) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setSettings(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // TODO: Implement API call to save settings
      setShowSuccess(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Store Information */}
          <Card>
            <CardHeader
              title="Store Information"
              subheader="Basic information about your store"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Store Name"
                    value={settings.storeName}
                    onChange={handleChange('storeName')}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contact Email"
                    type="email"
                    value={settings.contactEmail}
                    onChange={handleChange('contactEmail')}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Support Email"
                    type="email"
                    value={settings.supportEmail}
                    onChange={handleChange('supportEmail')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={settings.phoneNumber}
                    onChange={handleChange('phoneNumber')}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader
              title="Store Address"
              subheader="Physical location of your store"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    value={settings.address}
                    onChange={handleChange('address')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={settings.city}
                    onChange={handleChange('city')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="State/Province"
                    value={settings.state}
                    onChange={handleChange('state')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Postal Code"
                    value={settings.postalCode}
                    onChange={handleChange('postalCode')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={settings.country}
                    onChange={handleChange('country')}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Localization */}
          <Card>
            <CardHeader
              title="Localization"
              subheader="Language and timezone settings"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={settings.language}
                      label="Language"
                      onChange={handleChange('language')}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                      <MenuItem value="de">German</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      value={settings.timezone}
                      label="Timezone"
                      onChange={handleChange('timezone')}
                    >
                      <MenuItem value="Europe/London">London (GMT/BST)</MenuItem>
                      <MenuItem value="America/New_York">New York (EST)</MenuItem>
                      <MenuItem value="America/Los_Angeles">Los Angeles (PST)</MenuItem>
                      <MenuItem value="Asia/Tokyo">Tokyo (JST)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => setSettings({
                storeName: 'Wick and Wax Co',
                contactEmail: 'contact@wickandwax.co',
                supportEmail: 'support@wickandwax.co',
                phoneNumber: '+44 20 1234 5678',
                address: '123 Candle Street',
                city: 'London',
                state: 'England',
                postalCode: 'SW1A 1AA',
                country: 'United Kingdom',
                language: 'en',
                timezone: 'Europe/London',
              })}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Save Changes
            </Button>
          </Box>
        </Stack>
      </form>

      {/* Notifications */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Settings saved successfully
        </Alert>
      </Snackbar>

      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default GeneralSettings;
