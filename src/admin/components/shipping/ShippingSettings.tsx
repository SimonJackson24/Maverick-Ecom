import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Typography,
  Grid,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Save,
  LocalShipping,
  Info,
  Edit,
} from '@mui/icons-material';
import { useMutation, useQuery } from '@apollo/client';
import { GET_SHIPPING_SETTINGS, UPDATE_SHIPPING_SETTINGS } from '../../graphql/shipping';

interface PackageType {
  name: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  maxWeight: number;
  description: string;
  restrictions: string;
}

interface ServicePrice {
  price: number;
  deliveryAim: string;
  features?: string[];
}

interface ShippingService {
  [key: string]: {
    [key: string]: ServicePrice;
  };
}

interface RoyalMailSettings {
  enabled: boolean;
  clientId: string;
  clientSecret: string;
  environment: 'test' | 'production';
  defaultService: string;
  autoGenerateLabels: boolean;
  autoCreateManifest: boolean;
  defaultPackageTypes: {
    [key: string]: PackageType;
  };
  services: {
    [key: string]: {
      [key: string]: ServicePrice;
    };
  };
  internationalServices: {
    [key: string]: {
      [key: string]: any;
    };
  };
}

const ShippingSettings: React.FC = () => {
  const { data, loading, error } = useQuery(GET_SHIPPING_SETTINGS);
  const [updateSettings, { loading: saving }] = useMutation(UPDATE_SHIPPING_SETTINGS);
  const [settings, setSettings] = useState<RoyalMailSettings | null>(null);

  useEffect(() => {
    if (data?.shippingSettings?.royalMail) {
      setSettings(data.shippingSettings.royalMail);
    }
  }, [data]);

  const handleSave = async () => {
    if (!settings) return;
    try {
      await updateSettings({
        variables: {
          input: {
            royalMail: settings,
          },
        },
      });
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Error loading settings: {error.message}</Alert>
      </Box>
    );
  }

  if (!settings) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No shipping settings found. Please configure your Royal Mail integration.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Royal Mail Integration
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="API Configuration" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enabled}
                        onChange={(e) =>
                          setSettings((prev) => prev ? { ...prev, enabled: e.target.checked } : null)
                        }
                      />
                    }
                    label="Enable Royal Mail Integration"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Client ID"
                    value={settings.clientId}
                    onChange={(e) =>
                      setSettings((prev) => prev ? { ...prev, clientId: e.target.value } : null)
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Client Secret"
                    type="password"
                    value={settings.clientSecret}
                    onChange={(e) =>
                      setSettings((prev) => prev ? { ...prev, clientSecret: e.target.value } : null)
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="Package Types" />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Dimensions (cm)</TableCell>
                      <TableCell>Max Weight</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Restrictions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(settings.defaultPackageTypes || {}).map(([key, type]) => (
                      <TableRow key={key}>
                        <TableCell>{type.name}</TableCell>
                        <TableCell>
                          {type.length} × {type.width} × {type.height}
                        </TableCell>
                        <TableCell>{type.maxWeight}kg</TableCell>
                        <TableCell>{type.description}</TableCell>
                        <TableCell>
                          <Tooltip title={type.restrictions}>
                            <IconButton size="small">
                              <Info fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="UK Services" />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Service</TableCell>
                      <TableCell>Package Type</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Delivery Aim</TableCell>
                      <TableCell>Features</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(settings.services || {}).map(([serviceName, packageTypes]) =>
                      Object.entries(packageTypes || {}).map(([packageType, details]) => (
                        <TableRow key={`${serviceName}-${packageType}`}>
                          <TableCell>
                            {serviceName.replace(/([A-Z])/g, ' $1').trim()}
                          </TableCell>
                          <TableCell>
                            {packageType.replace(/([A-Z])/g, ' $1').trim()}
                          </TableCell>
                          <TableCell>
                            {typeof details?.price === 'number' ? `£${details.price.toFixed(2)}` : 'N/A'}
                          </TableCell>
                          <TableCell>{details?.deliveryAim || 'N/A'}</TableCell>
                          <TableCell>
                            {details?.features?.map((feature) => (
                              <Chip
                                key={feature}
                                label={feature}
                                size="small"
                                sx={{ mr: 1 }}
                              />
                            )) || 'None'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="International Services" />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Service</TableCell>
                      <TableCell>Zone</TableCell>
                      <TableCell>Package Type</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Delivery Aim</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(settings.internationalServices || {}).map(([serviceName, zones]) =>
                      Object.entries(zones || {}).map(([zoneName, details]) =>
                        Object.entries(details || {})
                          .filter(([key]) => key !== 'deliveryAim' && key !== 'features')
                          .map(([packageType, price]) => (
                            <TableRow key={`${serviceName}-${zoneName}-${packageType}`}>
                              <TableCell>
                                {serviceName.replace(/([A-Z])/g, ' $1').trim()}
                              </TableCell>
                              <TableCell>
                                {zoneName.replace(/([A-Z])/g, ' $1').trim()}
                              </TableCell>
                              <TableCell>
                                {packageType.replace(/([A-Z])/g, ' $1').trim()}
                              </TableCell>
                              <TableCell>
                                {typeof price === 'number' ? `£${price.toFixed(2)}` : 'N/A'}
                              </TableCell>
                              <TableCell>{details?.deliveryAim || 'N/A'}</TableCell>
                            </TableRow>
                          ))
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="Automation Settings" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoGenerateLabels}
                        onChange={(e) =>
                          setSettings((prev) => prev ? {
                            ...prev,
                            autoGenerateLabels: e.target.checked,
                          } : null)
                        }
                      />
                    }
                    label="Automatically generate shipping labels when order is ready"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoCreateManifest}
                        onChange={(e) =>
                          setSettings((prev) => prev ? {
                            ...prev,
                            autoCreateManifest: e.target.checked,
                          } : null)
                        }
                      />
                    }
                    label="Automatically create end-of-day manifest"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={saving ? <CircularProgress size={20} /> : <Save />}
          onClick={handleSave}
          disabled={saving || !settings}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </Box>
    </Box>
  );
};

export default ShippingSettings;
