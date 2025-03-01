import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  Alert,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useRevolutPaymentConfig } from '../../../hooks/useRevolutPaymentConfig';

const PaymentSettings: React.FC = () => {
  const { config, updateConfig, isLoading, error } = useRevolutPaymentConfig();
  const [testMode, setTestMode] = React.useState(true);

  const handleSave = async () => {
    await updateConfig({
      ...config,
      testMode,
    });
  };

  if (isLoading) {
    return (
      <Box p={3}>
        <Typography>Loading payment settings...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Payment Settings
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Configure Revolut payment settings and security options
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revolut Payment Configuration
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={testMode}
                        onChange={(e) => setTestMode(e.target.checked)}
                      />
                    }
                    label="Test Mode"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Merchant ID"
                    value={config.merchantId || ''}
                    disabled
                    helperText="Contact Revolut support to update merchant details"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={config.currency}
                      label="Currency"
                      onChange={(e) => updateConfig({ ...config, currency: e.target.value })}
                    >
                      <MenuItem value="GBP">British Pound (GBP)</MenuItem>
                      <MenuItem value="EUR">Euro (EUR)</MenuItem>
                      <MenuItem value="USD">US Dollar (USD)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Minimum Order Amount"
                    value={config.minimumOrderAmount}
                    onChange={(e) => updateConfig({ ...config, minimumOrderAmount: Number(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Maximum Order Amount"
                    value={config.maximumOrderAmount}
                    onChange={(e) => updateConfig({ ...config, maximumOrderAmount: Number(e.target.value) })}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.enableFraudProtection}
                        onChange={(e) => updateConfig({ ...config, enableFraudProtection: e.target.checked })}
                      />
                    }
                    label="Enable Fraud Protection"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.enable3DS}
                        onChange={(e) => updateConfig({ ...config, enable3DS: e.target.checked })}
                      />
                    }
                    label="Enable 3D Secure"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Session Timeout (minutes)"
                    value={config.sessionTimeout}
                    onChange={(e) => updateConfig({ ...config, sessionTimeout: Number(e.target.value) })}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={3}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Settings
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentSettings;
