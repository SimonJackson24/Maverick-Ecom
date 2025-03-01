import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import { UPDATE_SHIPPING_ZONE, DELETE_SHIPPING_ZONE } from '../../graphql/shipping';
import countries from '../../data/countries';

interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  regions?: string[];
  postcodes?: string[];
  methods: {
    id: string;
    name: string;
    carrier: string;
    cost: number;
    conditions?: {
      type: string;
      value: number;
    }[];
  }[];
}

interface ShippingZonesProps {
  zones?: ShippingZone[];
  loading?: boolean;
}

const ShippingZones: React.FC<ShippingZonesProps> = ({ zones = [], loading }) => {
  const [editZone, setEditZone] = useState<ShippingZone | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [updateZone] = useMutation(UPDATE_SHIPPING_ZONE);
  const [deleteZone] = useMutation(DELETE_SHIPPING_ZONE);

  const handleSave = async (zone: ShippingZone) => {
    try {
      await updateZone({
        variables: {
          id: zone.id,
          input: zone,
        },
      });
      setOpenDialog(false);
    } catch (error) {
      console.error('Failed to update shipping zone:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteZone({
        variables: {
          id,
        },
      });
    } catch (error) {
      console.error('Failed to delete shipping zone:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Shipping Zones</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditZone(null);
            setOpenDialog(true);
          }}
        >
          Add Zone
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Countries</TableCell>
              <TableCell>Shipping Methods</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {zones.map((zone) => (
              <TableRow key={zone.id}>
                <TableCell>{zone.name}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {zone.countries.map((country) => (
                      <Chip
                        key={country}
                        label={countries.find((c) => c.code === country)?.name || country}
                        size="small"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {zone.methods.map((method) => (
                      <Chip
                        key={method.id}
                        label={`${method.name} (£${method.cost})`}
                        size="small"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setEditZone(zone);
                      setOpenDialog(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(zone.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editZone ? 'Edit Shipping Zone' : 'New Shipping Zone'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Zone Name"
                value={editZone?.name || ''}
                onChange={(e) =>
                  setEditZone((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={countries}
                getOptionLabel={(option) => option.name}
                value={countries.filter((country) =>
                  editZone?.countries.includes(country.code)
                )}
                onChange={(_, newValue) => {
                  setEditZone((prev) =>
                    prev
                      ? {
                          ...prev,
                          countries: newValue.map((country) => country.code),
                        }
                      : null
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Countries"
                    placeholder="Select countries"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Postcodes (optional)"
                placeholder="Enter postcodes separated by commas"
                value={editZone?.postcodes?.join(', ') || ''}
                onChange={(e) =>
                  setEditZone((prev) =>
                    prev
                      ? {
                          ...prev,
                          postcodes: e.target.value
                            .split(',')
                            .map((p) => p.trim())
                            .filter(Boolean),
                        }
                      : null
                  )
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => editZone && handleSave(editZone)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShippingZones;
