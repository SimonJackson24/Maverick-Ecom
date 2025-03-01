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
  Alert,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { gql, useQuery, useMutation } from '@apollo/client';

const UPDATE_SHIPPING_SETTINGS = gql`
  mutation UpdateShippingSettings($input: ShippingSettingsInput!) {
    updateShippingSettings(input: $input) {
      success
      message
    }
  }
`;

interface RoyalMailService {
  code: string;
  name: string;
  description: string;
  estimatedDays: string;
}

const ROYAL_MAIL_SERVICES: RoyalMailService[] = [
  { code: 'CRL24', name: '24 Hour Tracked', description: 'Next day delivery', estimatedDays: '1' },
  { code: 'CRL48', name: '48 Hour Tracked', description: '2-day delivery', estimatedDays: '2' },
  { code: 'CRL1', name: 'First Class', description: 'Standard first class', estimatedDays: '1-2' },
  { code: 'CRL2', name: 'Second Class', description: 'Standard second class', estimatedDays: '2-3' },
  { code: 'INTL', name: 'International Tracked', description: 'International shipping', estimatedDays: '3-5' },
];

const ShippingSettings: React.FC = () => {
  const [settings, setSettings] = React.useState({
    // General Settings
    enableInternationalShipping: true,
    defaultShippingMethod: 'CRL48',
    freeShippingThreshold: 50,
    calculateByWeight: true,
    weightUnit: 'kg',
    dimensionUnit: 'cm',
    handlingFee: 5,
    
    // Royal Mail Specific Settings
    royalMail: {
      enabled: true,
      clientId: '',
      clientSecret: '',
      environment: 'test' as 'test' | 'production',
      defaultServiceCode: 'CRL48',
      enabledServices: ['CRL24', 'CRL48', 'CRL1', 'CRL2'],
      defaultPackageSize: {
        length: 20,
        width: 15,
        height: 10,
        weight: 1,
      },
      options: {
        defaultTracking: true,
        defaultSignature: false,
        defaultInsurance: true,
        allowSafePlaceDelivery: true,
      },
      automatedManifest: true,
      manifestTime: '17:00',
      labelFormat: 'PDF',
    },

    // Other Settings
    insuranceThreshold: 100,
    enableLocalPickup: false,
    localPickupLocations: [] as string[],
    restrictedCountries: [] as string[],
    shippingZones: [] as string[],
    packagingOptions: [] as string[],
    enableShippingInsurance: true,
    requireSignature: false,
    signatureThreshold: 200,
  });

  const [updateSettings] = useMutation(UPDATE_SHIPPING_SETTINGS);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRoyalMailChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings((prev) => ({
      ...prev,
      royalMail: {
        ...prev.royalMail,
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
      console.error('Failed to update shipping settings:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Shipping Settings
      </Typography>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">General Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableInternationalShipping}
                    onChange={handleChange('enableInternationalShipping')}
                  />
                }
                label="Enable International Shipping"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Free Shipping Threshold (£)"
                type="number"
                value={settings.freeShippingThreshold}
                onChange={handleChange('freeShippingThreshold')}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Royal Mail Integration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.royalMail.enabled}
                    onChange={handleRoyalMailChange('enabled')}
                  />
                }
                label="Enable Royal Mail Integration"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Client ID"
                type="password"
                value={settings.royalMail.clientId}
                onChange={handleRoyalMailChange('clientId')}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Client Secret"
                type="password"
                value={settings.royalMail.clientSecret}
                onChange={handleRoyalMailChange('clientSecret')}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Environment</InputLabel>
                <Select
                  value={settings.royalMail.environment}
                  onChange={handleRoyalMailChange('environment')}
                >
                  <MenuItem value="test">Test</MenuItem>
                  <MenuItem value="production">Production</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Default Service</InputLabel>
                <Select
                  value={settings.royalMail.defaultServiceCode}
                  onChange={handleRoyalMailChange('defaultServiceCode')}
                >
                  {ROYAL_MAIL_SERVICES.map((service) => (
                    <MenuItem key={service.code} value={service.code}>
                      {service.name} ({service.description})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Default Package Dimensions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Length (cm)"
                    type="number"
                    value={settings.royalMail.defaultPackageSize.length}
                    onChange={handleRoyalMailChange('defaultPackageSize.length')}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Width (cm)"
                    type="number"
                    value={settings.royalMail.defaultPackageSize.width}
                    onChange={handleRoyalMailChange('defaultPackageSize.width')}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Height (cm)"
                    type="number"
                    value={settings.royalMail.defaultPackageSize.height}
                    onChange={handleRoyalMailChange('defaultPackageSize.height')}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Weight (kg)"
                    type="number"
                    value={settings.royalMail.defaultPackageSize.weight}
                    onChange={handleRoyalMailChange('defaultPackageSize.weight')}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Default Options
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.royalMail.options.defaultTracking}
                        onChange={handleRoyalMailChange('options.defaultTracking')}
                      />
                    }
                    label="Enable Tracking by Default"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.royalMail.options.defaultSignature}
                        onChange={handleRoyalMailChange('options.defaultSignature')}
                      />
                    }
                    label="Require Signature by Default"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.royalMail.options.defaultInsurance}
                        onChange={handleRoyalMailChange('options.defaultInsurance')}
                      />
                    }
                    label="Enable Insurance by Default"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.royalMail.options.allowSafePlaceDelivery}
                        onChange={handleRoyalMailChange('options.allowSafePlaceDelivery')}
                      />
                    }
                    label="Allow Safe Place Delivery"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Manifest Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.royalMail.automatedManifest}
                        onChange={handleRoyalMailChange('automatedManifest')}
                      />
                    }
                    label="Automated Daily Manifest"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Manifest Time"
                    type="time"
                    value={settings.royalMail.manifestTime}
                    onChange={handleRoyalMailChange('manifestTime')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Settings
        </Button>
      </Box>
    </Box>
  );
};

export default ShippingSettings;
