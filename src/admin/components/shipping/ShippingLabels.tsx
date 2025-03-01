import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Alert,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import { UPDATE_LABEL_SETTINGS } from '../../graphql/shipping';

interface LabelSettings {
  paperSize: 'A4' | 'letter' | 'thermal';
  labelFormat: 'PDF' | 'ZPL' | 'PNG';
  defaultService: string;
  autoGenerate: boolean;
  autoManifest: boolean;
  manifestTime: string;
  returnAddress: {
    name: string;
    company: string;
    street: string;
    city: string;
    postcode: string;
    country: string;
    phone: string;
  };
  customizations: {
    logo: boolean;
    qrCode: boolean;
    orderNumber: boolean;
    customMessage: string;
  };
}

interface ShippingLabelsProps {
  labelSettings?: LabelSettings;
  loading?: boolean;
}

const ShippingLabels: React.FC<ShippingLabelsProps> = ({
  labelSettings,
  loading,
}) => {
  const [settings, setSettings] = React.useState<LabelSettings>(
    labelSettings || {
      paperSize: 'A4',
      labelFormat: 'PDF',
      defaultService: 'standard',
      autoGenerate: false,
      autoManifest: false,
      manifestTime: '17:00',
      returnAddress: {
        name: '',
        company: '',
        street: '',
        city: '',
        postcode: '',
        country: '',
        phone: '',
      },
      customizations: {
        logo: true,
        qrCode: true,
        orderNumber: true,
        customMessage: '',
      },
    }
  );

  const [updateSettings, { loading: saving, error }] = useMutation(
    UPDATE_LABEL_SETTINGS
  );

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      returnAddress: {
        ...prev.returnAddress,
        [field]: value,
      },
    }));
  };

  const handleCustomizationChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      customizations: {
        ...prev.customizations,
        [field]: value,
      },
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
      console.error('Failed to update label settings:', error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to save settings: {error.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Label Format
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Paper Size</InputLabel>
                  <Select
                    value={settings.paperSize}
                    label="Paper Size"
                    onChange={(e) =>
                      handleChange('paperSize', e.target.value)
                    }
                  >
                    <MenuItem value="A4">A4</MenuItem>
                    <MenuItem value="letter">Letter</MenuItem>
                    <MenuItem value="thermal">Thermal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Label Format</InputLabel>
                  <Select
                    value={settings.labelFormat}
                    label="Label Format"
                    onChange={(e) =>
                      handleChange('labelFormat', e.target.value)
                    }
                  >
                    <MenuItem value="PDF">PDF</MenuItem>
                    <MenuItem value="ZPL">ZPL (Thermal)</MenuItem>
                    <MenuItem value="PNG">PNG</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Default Service</InputLabel>
                  <Select
                    value={settings.defaultService}
                    label="Default Service"
                    onChange={(e) =>
                      handleChange('defaultService', e.target.value)
                    }
                  >
                    <MenuItem value="standard">Standard Delivery</MenuItem>
                    <MenuItem value="express">Express Delivery</MenuItem>
                    <MenuItem value="nextday">Next Day Delivery</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Automation
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoGenerate}
                      onChange={(e) =>
                        handleChange('autoGenerate', e.target.checked)
                      }
                    />
                  }
                  label="Automatically generate labels when order is ready"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoManifest}
                      onChange={(e) =>
                        handleChange('autoManifest', e.target.checked)
                      }
                    />
                  }
                  label="Automatically create end-of-day manifest"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Manifest Time"
                  type="time"
                  value={settings.manifestTime}
                  onChange={(e) =>
                    handleChange('manifestTime', e.target.value)
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Return Address
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Name"
                  value={settings.returnAddress.name}
                  onChange={(e) =>
                    handleAddressChange('name', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={settings.returnAddress.company}
                  onChange={(e) =>
                    handleAddressChange('company', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  value={settings.returnAddress.street}
                  onChange={(e) =>
                    handleAddressChange('street', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={settings.returnAddress.city}
                  onChange={(e) =>
                    handleAddressChange('city', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Postcode"
                  value={settings.returnAddress.postcode}
                  onChange={(e) =>
                    handleAddressChange('postcode', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value={settings.returnAddress.country}
                  onChange={(e) =>
                    handleAddressChange('country', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={settings.returnAddress.phone}
                  onChange={(e) =>
                    handleAddressChange('phone', e.target.value)
                  }
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Label Customization
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.customizations.logo}
                      onChange={(e) =>
                        handleCustomizationChange('logo', e.target.checked)
                      }
                    />
                  }
                  label="Include Company Logo"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.customizations.qrCode}
                      onChange={(e) =>
                        handleCustomizationChange('qrCode', e.target.checked)
                      }
                    />
                  }
                  label="Include QR Code"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.customizations.orderNumber}
                      onChange={(e) =>
                        handleCustomizationChange(
                          'orderNumber',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Show Order Number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Custom Message"
                  value={settings.customizations.customMessage}
                  onChange={(e) =>
                    handleCustomizationChange(
                      'customMessage',
                      e.target.value
                    )
                  }
                  helperText="This message will appear on all shipping labels"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={saving}
        >
          Save Settings
        </Button>
      </Box>
    </Box>
  );
};

export default ShippingLabels;
