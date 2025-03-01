import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Grid,
  Divider,
} from '@mui/material';

const IntegrationSettings: React.FC = () => {
  const [integrations, setIntegrations] = React.useState({
    adobeCommerce: {
      enabled: true,
      apiKey: '********-****-****-****-************',
      environment: 'production',
    },
    stripe: {
      enabled: true,
      publicKey: 'pk_test_************************************',
      secretKey: 'sk_test_************************************',
    },
    googleAnalytics: {
      enabled: true,
      trackingId: 'UA-XXXXXXXXX-X',
    },
    mailchimp: {
      enabled: false,
      apiKey: '',
      listId: '',
    },
  });

  const handleToggleIntegration = (integration: string) => {
    setIntegrations((prev) => ({
      ...prev,
      [integration]: {
        ...prev[integration as keyof typeof prev],
        enabled: !prev[integration as keyof typeof prev].enabled,
      },
    }));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Integration Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Manage your third-party service integrations and API configurations.
      </Typography>

      {/* Adobe Commerce Integration */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6">Adobe Commerce</Typography>
              <Typography variant="body2" color="text.secondary">
                Connect your Adobe Commerce store to sync products and orders.
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={integrations.adobeCommerce.enabled}
                  onChange={() => handleToggleIntegration('adobeCommerce')}
                />
              }
              label={integrations.adobeCommerce.enabled ? 'Connected' : 'Disconnected'}
            />
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="API Key"
                value={integrations.adobeCommerce.apiKey}
                type="password"
                disabled={!integrations.adobeCommerce.enabled}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Environment"
                value={integrations.adobeCommerce.environment}
                disabled={!integrations.adobeCommerce.enabled}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Stripe Integration */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6">Stripe</Typography>
              <Typography variant="body2" color="text.secondary">
                Process payments securely with Stripe.
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={integrations.stripe.enabled}
                  onChange={() => handleToggleIntegration('stripe')}
                />
              }
              label={integrations.stripe.enabled ? 'Connected' : 'Disconnected'}
            />
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Public Key"
                value={integrations.stripe.publicKey}
                type="password"
                disabled={!integrations.stripe.enabled}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Secret Key"
                value={integrations.stripe.secretKey}
                type="password"
                disabled={!integrations.stripe.enabled}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Google Analytics Integration */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6">Google Analytics</Typography>
              <Typography variant="body2" color="text.secondary">
                Track website traffic and user behavior.
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={integrations.googleAnalytics.enabled}
                  onChange={() => handleToggleIntegration('googleAnalytics')}
                />
              }
              label={integrations.googleAnalytics.enabled ? 'Connected' : 'Disconnected'}
            />
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tracking ID"
                value={integrations.googleAnalytics.trackingId}
                disabled={!integrations.googleAnalytics.enabled}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Mailchimp Integration */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6">Mailchimp</Typography>
              <Typography variant="body2" color="text.secondary">
                Sync your customer list with Mailchimp for email marketing.
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={integrations.mailchimp.enabled}
                  onChange={() => handleToggleIntegration('mailchimp')}
                />
              }
              label={integrations.mailchimp.enabled ? 'Connected' : 'Disconnected'}
            />
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="API Key"
                value={integrations.mailchimp.apiKey}
                type="password"
                disabled={!integrations.mailchimp.enabled}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="List ID"
                value={integrations.mailchimp.listId}
                disabled={!integrations.mailchimp.enabled}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default IntegrationSettings;
