import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Typography,
  Divider,
} from '@mui/material';

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
];

const CurrencySettings: React.FC = () => {
  const [settings, setSettings] = React.useState({
    defaultCurrency: 'GBP',
    displayCurrency: 'GBP',
    autoUpdateRates: true,
    updateFrequency: 'daily',
    showCurrencySymbol: true,
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Currency Settings"
          subheader="Configure your store's currency options"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Default Currency</InputLabel>
                <Select
                  value={settings.defaultCurrency}
                  label="Default Currency"
                  onChange={handleChange('defaultCurrency')}
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency.code} value={currency.code}>
                      {currency.name} ({currency.symbol})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Display Currency</InputLabel>
                <Select
                  value={settings.displayCurrency}
                  label="Display Currency"
                  onChange={handleChange('displayCurrency')}
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency.code} value={currency.code}>
                      {currency.name} ({currency.symbol})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoUpdateRates}
                    onChange={handleChange('autoUpdateRates')}
                  />
                }
                label="Automatically Update Exchange Rates"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={!settings.autoUpdateRates}>
                <InputLabel>Update Frequency</InputLabel>
                <Select
                  value={settings.updateFrequency}
                  label="Update Frequency"
                  onChange={handleChange('updateFrequency')}
                >
                  <MenuItem value="hourly">Hourly</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Format Settings
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showCurrencySymbol}
                    onChange={handleChange('showCurrencySymbol')}
                  />
                }
                label="Show Currency Symbol"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={!settings.showCurrencySymbol}>
                <InputLabel>Symbol Position</InputLabel>
                <Select
                  value={settings.symbolPosition}
                  label="Symbol Position"
                  onChange={handleChange('symbolPosition')}
                >
                  <MenuItem value="before">Before Amount (£99.99)</MenuItem>
                  <MenuItem value="after">After Amount (99.99£)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Decimal Places"
                type="number"
                value={settings.decimalPlaces}
                onChange={handleChange('decimalPlaces')}
                inputProps={{ min: 0, max: 4 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Thousands Separator"
                value={settings.thousandsSeparator}
                onChange={handleChange('thousandsSeparator')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Decimal Separator"
                value={settings.decimalSeparator}
                onChange={handleChange('decimalSeparator')}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                size="large"
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CurrencySettings;
