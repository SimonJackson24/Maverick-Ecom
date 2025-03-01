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

const ProductSettings: React.FC = () => {
  const [settings, setSettings] = React.useState({
    enableInventoryTracking: true,
    lowStockThreshold: 10,
    enableAutoReorder: false,
    autoReorderThreshold: 5,
    defaultSupplier: '',
    stockBufferPercentage: 20,
    enableBatchTracking: true,
    expiryNotificationDays: 30,
    allowBackorders: false,
    backorderLimit: 0,
    defaultCategory: 'candles',
    defaultTaxClass: 'standard',
    enableReviews: true,
    requirePurchaseToReview: true,
    moderateReviews: true,
    displayOutOfStock: true,
    hideOutOfStockFromSearch: false,
    enableBulkPricing: false,
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
    console.log('Saving product settings:', settings);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Product Settings
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Configure product-related settings and inventory management
      </Typography>

      <Grid container spacing={3}>
        {/* Inventory Management */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Inventory Management
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableInventoryTracking}
                        onChange={handleChange('enableInventoryTracking')}
                      />
                    }
                    label="Enable Inventory Tracking"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Low Stock Threshold"
                    type="number"
                    value={settings.lowStockThreshold}
                    onChange={handleChange('lowStockThreshold')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableAutoReorder}
                        onChange={handleChange('enableAutoReorder')}
                      />
                    }
                    label="Enable Auto Reorder"
                  />
                </Grid>
                {settings.enableAutoReorder && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Auto Reorder Threshold"
                      type="number"
                      value={settings.autoReorderThreshold}
                      onChange={handleChange('autoReorderThreshold')}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Stock Buffer Percentage"
                    type="number"
                    value={settings.stockBufferPercentage}
                    onChange={handleChange('stockBufferPercentage')}
                    InputProps={{
                      endAdornment: '%',
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Product Display */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Display
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Default Category</InputLabel>
                    <Select
                      value={settings.defaultCategory}
                      onChange={handleSelectChange('defaultCategory')}
                      label="Default Category"
                    >
                      <MenuItem value="candles">Candles</MenuItem>
                      <MenuItem value="wax-melts">Wax Melts</MenuItem>
                      <MenuItem value="accessories">Accessories</MenuItem>
                      <MenuItem value="gift-sets">Gift Sets</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Default Tax Class</InputLabel>
                    <Select
                      value={settings.defaultTaxClass}
                      onChange={handleSelectChange('defaultTaxClass')}
                      label="Default Tax Class"
                    >
                      <MenuItem value="standard">Standard</MenuItem>
                      <MenuItem value="reduced">Reduced</MenuItem>
                      <MenuItem value="zero">Zero</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.displayOutOfStock}
                        onChange={handleChange('displayOutOfStock')}
                      />
                    }
                    label="Display Out of Stock Products"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.hideOutOfStockFromSearch}
                        onChange={handleChange('hideOutOfStockFromSearch')}
                      />
                    }
                    label="Hide Out of Stock Products from Search"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Reviews */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Reviews
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableReviews}
                        onChange={handleChange('enableReviews')}
                      />
                    }
                    label="Enable Product Reviews"
                  />
                </Grid>
                {settings.enableReviews && (
                  <>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.requirePurchaseToReview}
                            onChange={handleChange('requirePurchaseToReview')}
                          />
                        }
                        label="Require Purchase to Review"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.moderateReviews}
                            onChange={handleChange('moderateReviews')}
                          />
                        }
                        label="Moderate Reviews Before Publishing"
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Advanced Options */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Advanced Options
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableBatchTracking}
                        onChange={handleChange('enableBatchTracking')}
                      />
                    }
                    label="Enable Batch Tracking"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Expiry Notification Days"
                    type="number"
                    value={settings.expiryNotificationDays}
                    onChange={handleChange('expiryNotificationDays')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.allowBackorders}
                        onChange={handleChange('allowBackorders')}
                      />
                    }
                    label="Allow Backorders"
                  />
                </Grid>
                {settings.allowBackorders && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Backorder Limit"
                      type="number"
                      value={settings.backorderLimit}
                      onChange={handleChange('backorderLimit')}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableBulkPricing}
                        onChange={handleChange('enableBulkPricing')}
                      />
                    }
                    label="Enable Bulk Pricing"
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

export default ProductSettings;
