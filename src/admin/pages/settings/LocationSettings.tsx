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
  Typography,
  Divider,
} from '@mui/material';

const LocationSettings: React.FC = () => {
  const [settings, setSettings] = React.useState({
    storeCountry: 'GB',
    storeRegion: '',
    storeCity: '',
    storePostcode: '',
    storeTimezone: 'Europe/London',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24',
    weightUnit: 'kg',
    dimensionUnit: 'cm',
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardHeader
          title="Location Settings"
          subheader="Configure your store's location and regional preferences"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Store Location
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Select
                  value={settings.storeCountry}
                  label="Country"
                  onChange={handleChange('storeCountry')}
                >
                  <MenuItem value="GB">United Kingdom</MenuItem>
                  <MenuItem value="US">United States</MenuItem>
                  <MenuItem value="CA">Canada</MenuItem>
                  <MenuItem value="AU">Australia</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Region/State"
                value={settings.storeRegion}
                onChange={handleChange('storeRegion')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                value={settings.storeCity}
                onChange={handleChange('storeCity')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Postcode/ZIP"
                value={settings.storePostcode}
                onChange={handleChange('storePostcode')}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Regional Settings
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Timezone</InputLabel>
                <Select
                  value={settings.storeTimezone}
                  label="Timezone"
                  onChange={handleChange('storeTimezone')}
                >
                  <MenuItem value="Europe/London">London (GMT/BST)</MenuItem>
                  <MenuItem value="America/New_York">New York (EST)</MenuItem>
                  <MenuItem value="America/Los_Angeles">Los Angeles (PST)</MenuItem>
                  <MenuItem value="Asia/Tokyo">Tokyo (JST)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Date Format</InputLabel>
                <Select
                  value={settings.dateFormat}
                  label="Date Format"
                  onChange={handleChange('dateFormat')}
                >
                  <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                  <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                  <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Time Format</InputLabel>
                <Select
                  value={settings.timeFormat}
                  label="Time Format"
                  onChange={handleChange('timeFormat')}
                >
                  <MenuItem value="12">12-hour</MenuItem>
                  <MenuItem value="24">24-hour</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Measurement Units
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Weight Unit</InputLabel>
                <Select
                  value={settings.weightUnit}
                  label="Weight Unit"
                  onChange={handleChange('weightUnit')}
                >
                  <MenuItem value="kg">Kilograms (kg)</MenuItem>
                  <MenuItem value="lb">Pounds (lb)</MenuItem>
                  <MenuItem value="oz">Ounces (oz)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Dimension Unit</InputLabel>
                <Select
                  value={settings.dimensionUnit}
                  label="Dimension Unit"
                  onChange={handleChange('dimensionUnit')}
                >
                  <MenuItem value="cm">Centimeters (cm)</MenuItem>
                  <MenuItem value="in">Inches (in)</MenuItem>
                  <MenuItem value="mm">Millimeters (mm)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 2 }}
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

export default LocationSettings;
