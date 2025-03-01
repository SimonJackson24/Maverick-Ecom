import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

interface TaxRate {
  id: string;
  name: string;
  rate: number;
  country: string;
  state: string;
}

const TaxSettings: React.FC = () => {
  const [taxRates, setTaxRates] = React.useState<TaxRate[]>([
    {
      id: '1',
      name: 'Standard Rate',
      rate: 20,
      country: 'United Kingdom',
      state: '',
    },
    {
      id: '2',
      name: 'Reduced Rate',
      rate: 5,
      country: 'United Kingdom',
      state: '',
    },
  ]);

  const [newRate, setNewRate] = React.useState<Partial<TaxRate>>({
    name: '',
    rate: 0,
    country: '',
    state: '',
  });

  const handleAddRate = () => {
    if (newRate.name && newRate.rate && newRate.country) {
      setTaxRates([
        ...taxRates,
        {
          id: Date.now().toString(),
          name: newRate.name,
          rate: newRate.rate,
          country: newRate.country,
          state: newRate.state || '',
        },
      ]);
      setNewRate({
        name: '',
        rate: 0,
        country: '',
        state: '',
      });
    }
  };

  const handleDeleteRate = (id: string) => {
    setTaxRates(taxRates.filter((rate) => rate.id !== id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Tax Settings"
          subheader="Configure tax rates and rules"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Enable Tax Calculation"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Prices Include Tax"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch />}
                label="Enable Tax Based on Shipping Address"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="Tax Rates"
          subheader="Manage tax rates for different regions"
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddRate}
              disabled={!newRate.name || !newRate.rate || !newRate.country}
            >
              Add Rate
            </Button>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Rate Name"
                value={newRate.name}
                onChange={(e) => setNewRate({ ...newRate, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Rate (%)"
                type="number"
                value={newRate.rate}
                onChange={(e) => setNewRate({ ...newRate, rate: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Country"
                value={newRate.country}
                onChange={(e) => setNewRate({ ...newRate, country: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="State/Region (Optional)"
                value={newRate.state}
                onChange={(e) => setNewRate({ ...newRate, state: e.target.value })}
              />
            </Grid>
          </Grid>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Rate (%)</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>State/Region</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taxRates.map((rate) => (
                  <TableRow key={rate.id}>
                    <TableCell>{rate.name}</TableCell>
                    <TableCell>{rate.rate}%</TableCell>
                    <TableCell>{rate.country}</TableCell>
                    <TableCell>{rate.state || '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleDeleteRate(rate.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TaxSettings;
