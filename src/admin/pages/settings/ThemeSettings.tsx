import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Divider,
} from '@mui/material';
import { ColorPicker } from '../../components/common/ColorPicker';

const ThemeSettings: React.FC = () => {
  const [primaryColor, setPrimaryColor] = React.useState('#1976d2');
  const [secondaryColor, setSecondaryColor] = React.useState('#dc004e');
  const [mode, setMode] = React.useState('light');
  const [borderRadius, setBorderRadius] = React.useState(4);
  const [enableAnimations, setEnableAnimations] = React.useState(true);

  const handleSave = () => {
    // TODO: Implement theme settings save
    console.log({
      primaryColor,
      secondaryColor,
      mode,
      borderRadius,
      enableAnimations,
    });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Theme Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Customize the look and feel of your admin dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Colors
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Primary Color
                </Typography>
                <ColorPicker
                  color={primaryColor}
                  onChange={(color) => setPrimaryColor(color)}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Secondary Color
                </Typography>
                <ColorPicker
                  color={secondaryColor}
                  onChange={(color) => setSecondaryColor(color)}
                />
              </Box>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Theme Mode</InputLabel>
                <Select
                  value={mode}
                  label="Theme Mode"
                  onChange={(e) => setMode(e.target.value)}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="system">System</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Interface
              </Typography>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Border Radius</InputLabel>
                <Select
                  value={borderRadius}
                  label="Border Radius"
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                >
                  <MenuItem value={0}>Square (0px)</MenuItem>
                  <MenuItem value={4}>Slightly Rounded (4px)</MenuItem>
                  <MenuItem value={8}>Rounded (8px)</MenuItem>
                  <MenuItem value={16}>Very Rounded (16px)</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={enableAnimations}
                    onChange={(e) => setEnableAnimations(e.target.checked)}
                  />
                }
                label="Enable Animations"
              />
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

export default ThemeSettings;
