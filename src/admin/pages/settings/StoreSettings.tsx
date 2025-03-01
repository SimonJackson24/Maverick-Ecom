import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';

const StoreSettings: React.FC = () => {
  const [storeSettings, setStoreSettings] = React.useState({
    storeName: 'Wick & Wax Co',
    storeUrl: 'https://wickandwax.co',
    supportEmail: 'support@wickandwax.co',
    phoneNumber: '+1 (555) 123-4567',
    timezone: 'America/Los_Angeles',
    currency: 'USD',
    weightUnit: 'oz',
    dimensionUnit: 'in',
    orderNumberPrefix: 'WW',
    enableInventoryTracking: true,
    lowStockThreshold: 10,
    enableBackorders: false,
    enableReviews: true,
    requireReviewApproval: true,
  });

  const handleChange = (field: string) => (event: any) => {
    setStoreSettings({
      ...storeSettings,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    });
  };

  const handleSave = () => {
    // TODO: Implement store settings save
    console.log(storeSettings);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Store Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Configure your store's basic information and preferences
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Store Name"
                    value={storeSettings.storeName}
                    onChange={handleChange('storeName')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Store URL"
                    value={storeSettings.storeUrl}
                    onChange={handleChange('storeUrl')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Support Email"
                    value={storeSettings.supportEmail}
                    onChange={handleChange('supportEmail')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={storeSettings.phoneNumber}
                    onChange={handleChange('phoneNumber')}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Regional Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      value={storeSettings.timezone}
                      label="Timezone"
                      onChange={handleChange('timezone')}
                    >
                      <MenuItem value="America/Los_Angeles">Pacific Time (PT)</MenuItem>
                      <MenuItem value="America/Denver">Mountain Time (MT)</MenuItem>
                      <MenuItem value="America/Chicago">Central Time (CT)</MenuItem>
                      <MenuItem value="America/New_York">Eastern Time (ET)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={storeSettings.currency}
                      label="Currency"
                      onChange={handleChange('currency')}
                    >
                      <MenuItem value="USD">US Dollar ($)</MenuItem>
                      <MenuItem value="EUR">Euro (€)</MenuItem>
                      <MenuItem value="GBP">British Pound (£)</MenuItem>
                      <MenuItem value="CAD">Canadian Dollar (C$)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Weight Unit</InputLabel>
                    <Select
                      value={storeSettings.weightUnit}
                      label="Weight Unit"
                      onChange={handleChange('weightUnit')}
                    >
                      <MenuItem value="oz">Ounces (oz)</MenuItem>
                      <MenuItem value="lb">Pounds (lb)</MenuItem>
                      <MenuItem value="g">Grams (g)</MenuItem>
                      <MenuItem value="kg">Kilograms (kg)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Dimension Unit</InputLabel>
                    <Select
                      value={storeSettings.dimensionUnit}
                      label="Dimension Unit"
                      onChange={handleChange('dimensionUnit')}
                    >
                      <MenuItem value="in">Inches (in)</MenuItem>
                      <MenuItem value="cm">Centimeters (cm)</MenuItem>
                      <MenuItem value="mm">Millimeters (mm)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Order Number Prefix"
                    value={storeSettings.orderNumberPrefix}
                    onChange={handleChange('orderNumberPrefix')}
                    helperText="This will be added to the beginning of each order number"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={storeSettings.enableInventoryTracking}
                        onChange={handleChange('enableInventoryTracking')}
                      />
                    }
                    label="Enable Inventory Tracking"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Low Stock Threshold"
                    value={storeSettings.lowStockThreshold}
                    onChange={handleChange('lowStockThreshold')}
                    disabled={!storeSettings.enableInventoryTracking}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={storeSettings.enableBackorders}
                        onChange={handleChange('enableBackorders')}
                      />
                    }
                    label="Allow Backorders"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Review Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={storeSettings.enableReviews}
                        onChange={handleChange('enableReviews')}
                      />
                    }
                    label="Enable Product Reviews"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={storeSettings.requireReviewApproval}
                        onChange={handleChange('requireReviewApproval')}
                        disabled={!storeSettings.enableReviews}
                      />
                    }
                    label="Require Review Approval"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" onClick={handleSave}>
              Save Changes
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StoreSettings;
