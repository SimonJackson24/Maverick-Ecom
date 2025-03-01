import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Snackbar,
  Alert
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { ProductService } from '../../services/ProductService';
import { Product, ProductStatus, StockStatus } from '../../types/Product';

const ProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    price: {
      regularPrice: {
        amount: {
          value: 0,
          currency: 'USD'
        }
      }
    },
    description: '',
    status: ProductStatus.DRAFT,
    stockStatus: StockStatus.IN_STOCK,
    stockQuantity: 0,
    scentProfile: {
      intensity: 1,
      notes: [],
      category: '',
      season: '',
    },
  });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!id) return;
        const productData = await ProductService.getProduct(id);
        setProduct(productData);
        setFormData(productData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product');
        setLoading(false);
        enqueueSnackbar('Failed to load product', { variant: 'error' });
      }
    };

    loadProduct();
  }, [id, enqueueSnackbar]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'price') {
      setFormData(prev => ({
        ...prev,
        price: {
          regularPrice: {
            amount: {
              value: parseFloat(value),
              currency: 'USD'
            }
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleScentProfileChange = (field: keyof typeof formData.scentProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      scentProfile: {
        ...prev.scentProfile,
        [field]: value
      }
    }));
  };

  const handleStatusChange = (e: any) => {
    setFormData(prev => ({
      ...prev,
      status: e.target.value as ProductStatus
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!id) throw new Error('Product ID is required');
      await ProductService.updateProduct(id, formData as Product);
      enqueueSnackbar('Product updated successfully', { variant: 'success' });
      navigate('/admin/products');
    } catch (err) {
      setError('Failed to update product');
      enqueueSnackbar('Failed to update product', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!product && !loading) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          Product not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Edit Product
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Product Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="SKU"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Price"
                      name="price"
                      type="number"
                      value={formData.price?.regularPrice.amount.value}
                      onChange={handleInputChange}
                      required
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Stock Quantity"
                      name="stockQuantity"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={handleInputChange}
                      required
                      inputProps={{ min: 0 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      multiline
                      rows={4}
                      required
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={formData.status}
                        onChange={handleStatusChange}
                        label="Status"
                      >
                        {Object.values(ProductStatus).map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Scent Profile
                    </Typography>
                    
                    <TextField
                      fullWidth
                      label="Category"
                      value={formData.scentProfile?.category}
                      onChange={(e) => handleScentProfileChange('category', e.target.value)}
                      margin="normal"
                    />

                    <TextField
                      fullWidth
                      label="Season"
                      value={formData.scentProfile?.season}
                      onChange={(e) => handleScentProfileChange('season', e.target.value)}
                      margin="normal"
                    />

                    <TextField
                      fullWidth
                      label="Intensity"
                      type="number"
                      value={formData.scentProfile?.intensity}
                      onChange={(e) => handleScentProfileChange('intensity', parseInt(e.target.value))}
                      inputProps={{ min: 1, max: 10 }}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Box mt={3} display="flex" gap={2}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={saving}
                fullWidth
              >
                {saving ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/products')}
                fullWidth
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductEditPage;
