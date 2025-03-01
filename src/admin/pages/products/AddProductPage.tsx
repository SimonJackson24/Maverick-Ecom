import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { ProductService } from '../../services/ProductService';

interface ProductFormData {
  name: string;
  sku: string;
  price: string;
  description: string;
  shortDescription: string;
  status: 'ACTIVE' | 'INACTIVE';
  weight: string;
  scentProfile: {
    primaryNotes: string;
    middleNotes: string;
    baseNotes: string;
    intensity: string;
    mood: string;
    season: string;
  };
}

const initialFormData: ProductFormData = {
  name: '',
  sku: '',
  price: '',
  description: '',
  shortDescription: '',
  status: 'ACTIVE',
  weight: '',
  scentProfile: {
    primaryNotes: '',
    middleNotes: '',
    baseNotes: '',
    intensity: 'MEDIUM',
    mood: '',
    season: '',
  },
};

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.sku) newErrors.sku = 'SKU is required';
    if (!formData.price || isNaN(Number(formData.price))) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.weight || isNaN(Number(formData.weight))) {
      newErrors.weight = 'Valid weight is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      enqueueSnackbar('Please fill in all required fields', { variant: 'error' });
      return;
    }

    setLoading(true);
    try {
      await ProductService.createProduct({
        name: formData.name,
        sku: formData.sku,
        price: {
          regularPrice: {
            amount: {
              value: Number(formData.price),
              currency: 'USD',
            },
          },
        },
        description: formData.description,
        shortDescription: formData.shortDescription,
        status: formData.status,
        weight: Number(formData.weight),
        scentProfile: formData.scentProfile,
      });

      enqueueSnackbar('Product created successfully', { variant: 'success' });
      navigate('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      enqueueSnackbar('Failed to create product', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ProductFormData],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Add New Product
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SKU"
                  value={formData.sku}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  error={!!errors.sku}
                  helperText={errors.sku}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  error={!!errors.price}
                  helperText={errors.price}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Weight (oz)"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  error={!!errors.weight}
                  helperText={errors.weight}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem value="INACTIVE">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              {/* Scent Profile */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Scent Profile
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Primary Notes"
                  value={formData.scentProfile.primaryNotes}
                  onChange={(e) => handleChange('scentProfile.primaryNotes', e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Middle Notes"
                  value={formData.scentProfile.middleNotes}
                  onChange={(e) => handleChange('scentProfile.middleNotes', e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Base Notes"
                  value={formData.scentProfile.baseNotes}
                  onChange={(e) => handleChange('scentProfile.baseNotes', e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Intensity</InputLabel>
                  <Select
                    value={formData.scentProfile.intensity}
                    label="Intensity"
                    onChange={(e) => handleChange('scentProfile.intensity', e.target.value)}
                  >
                    <MenuItem value="LIGHT">Light</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="STRONG">Strong</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Mood"
                  value={formData.scentProfile.mood}
                  onChange={(e) => handleChange('scentProfile.mood', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Season"
                  value={formData.scentProfile.season}
                  onChange={(e) => handleChange('scentProfile.season', e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Short Description"
                  value={formData.shortDescription}
                  onChange={(e) => handleChange('shortDescription', e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description}
                  required
                />
              </Grid>

              {/* Form Actions */}
              <Grid item xs={12}>
                <Box mt={3} display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/admin/products')}
                    fullWidth
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? <CircularProgress size={24} /> : 'Create Product'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddProductPage;
