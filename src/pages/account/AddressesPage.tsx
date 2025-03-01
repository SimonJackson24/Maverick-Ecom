import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_CUSTOMER_ADDRESSES,
  ADD_ADDRESS,
  UPDATE_ADDRESS,
  DELETE_ADDRESS,
} from '../../graphql/customer';

interface Address {
  id: string;
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

const AddressesPage: React.FC = () => {
  const [editAddress, setEditAddress] = useState<Address | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, loading, error } = useQuery(GET_CUSTOMER_ADDRESSES);
  const [addAddress] = useMutation(ADD_ADDRESS);
  const [updateAddress] = useMutation(UPDATE_ADDRESS);
  const [deleteAddress] = useMutation(DELETE_ADDRESS);

  const handleAddAddress = async (formData: Omit<Address, 'id'>) => {
    try {
      await addAddress({
        variables: {
          input: formData,
        },
        refetchQueries: [{ query: GET_CUSTOMER_ADDRESSES }],
      });
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Failed to add address:', err);
    }
  };

  const handleUpdateAddress = async (formData: Address) => {
    try {
      await updateAddress({
        variables: {
          id: formData.id,
          input: formData,
        },
        refetchQueries: [{ query: GET_CUSTOMER_ADDRESSES }],
      });
      setIsDialogOpen(false);
      setEditAddress(null);
    } catch (err) {
      console.error('Failed to update address:', err);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await deleteAddress({
        variables: { id },
        refetchQueries: [{ query: GET_CUSTOMER_ADDRESSES }],
      });
    } catch (err) {
      console.error('Failed to delete address:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading addresses: {error.message}
      </Alert>
    );
  }

  const addresses = data?.customerAddresses || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">My Addresses</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditAddress(null);
            setIsDialogOpen(true);
          }}
        >
          Add Address
        </Button>
      </Box>

      <Grid container spacing={3}>
        {addresses.map((address: Address) => (
          <Grid item xs={12} md={6} key={address.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {address.type === 'shipping' ? 'Shipping' : 'Billing'} Address
                  {address.isDefault && ' (Default)'}
                </Typography>
                <Typography>
                  {address.firstName} {address.lastName}
                </Typography>
                {address.company && <Typography>{address.company}</Typography>}
                <Typography>{address.street}</Typography>
                <Typography>
                  {address.city}, {address.state} {address.postcode}
                </Typography>
                <Typography>{address.country}</Typography>
                <Typography>{address.phone}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  startIcon={<EditIcon />}
                  size="small"
                  onClick={() => {
                    setEditAddress(address);
                    setIsDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  size="small"
                  color="error"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditAddress(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editAddress ? 'Edit Address' : 'Add New Address'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  defaultValue={editAddress?.firstName}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  defaultValue={editAddress?.lastName}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company"
                  defaultValue={editAddress?.company}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  defaultValue={editAddress?.street}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  defaultValue={editAddress?.city}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State/Province"
                  defaultValue={editAddress?.state}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Postcode"
                  defaultValue={editAddress?.postcode}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  defaultValue={editAddress?.country}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  defaultValue={editAddress?.phone}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Address Type"
                  defaultValue={editAddress?.type || 'shipping'}
                  required
                >
                  <MenuItem value="shipping">Shipping Address</MenuItem>
                  <MenuItem value="billing">Billing Address</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsDialogOpen(false);
              setEditAddress(null);
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" color="primary">
            {editAddress ? 'Save Changes' : 'Add Address'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddressesPage;
