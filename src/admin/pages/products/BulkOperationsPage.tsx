import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ProductService } from '../../services/ProductService';
import { Product, BulkOperationResult } from '../../types';
import AdminLayout from '../../components/layout/AdminLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useSnackbar } from 'notistack';

const BulkOperationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkValue, setBulkValue] = useState('');
  const [operationResult, setOperationResult] = useState<BulkOperationResult | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductService.getProducts(
        { page: 1, perPage: 100 },
        { field: 'name', direction: 'ASC' }
      );
      setProducts(response.items);
    } catch (error) {
      enqueueSnackbar('Failed to load products', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedProducts(products.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBulkUpdate = async () => {
    if (!bulkAction || !bulkValue || selectedProducts.length === 0) {
      enqueueSnackbar('Please select products and specify the update action', { variant: 'warning' });
      return;
    }

    try {
      setSaving(true);
      let updates: any = {};

      switch (bulkAction) {
        case 'status':
          updates = { status: bulkValue };
          break;
        case 'stockStatus':
          updates = { stockStatus: bulkValue };
          break;
        case 'price':
          updates = { price: parseFloat(bulkValue) };
          break;
        default:
          throw new Error('Invalid bulk action');
      }

      const result = await ProductService.bulkUpdateProducts(selectedProducts, updates);
      setOperationResult(result);
      
      if (result.success) {
        enqueueSnackbar('Bulk update completed successfully', { variant: 'success' });
        loadProducts();
      } else {
        enqueueSnackbar('Bulk update completed with some errors', { variant: 'warning' });
      }
    } catch (error) {
      enqueueSnackbar('Failed to perform bulk update', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AdminLayout>
      <Box p={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <IconButton onClick={() => navigate('/admin/products')}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h4">Bulk Operations</Typography>
            </Box>
          </Grid>

          {operationResult && (
            <Grid item xs={12}>
              <Alert 
                severity={operationResult.success ? 'success' : 'warning'}
                onClose={() => setOperationResult(null)}
              >
                {operationResult.message}
                {operationResult.failureCount > 0 && (
                  <Box mt={1}>
                    Failed updates: {operationResult.failureCount}
                    <ul>
                      {operationResult.errors.map((error, index) => (
                        <li key={index}>{error.message}</li>
                      ))}
                    </ul>
                  </Box>
                )}
              </Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" gap={2} mb={3}>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Bulk Action</InputLabel>
                    <Select
                      value={bulkAction}
                      onChange={(e) => setBulkAction(e.target.value)}
                      label="Bulk Action"
                    >
                      <MenuItem value="status">Update Status</MenuItem>
                      <MenuItem value="stockStatus">Update Stock Status</MenuItem>
                      <MenuItem value="price">Update Price</MenuItem>
                    </Select>
                  </FormControl>

                  {bulkAction === 'status' && (
                    <FormControl sx={{ minWidth: 200 }}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={bulkValue}
                        onChange={(e) => setBulkValue(e.target.value)}
                        label="Status"
                      >
                        <MenuItem value="ACTIVE">Active</MenuItem>
                        <MenuItem value="INACTIVE">Inactive</MenuItem>
                        <MenuItem value="DRAFT">Draft</MenuItem>
                      </Select>
                    </FormControl>
                  )}

                  {bulkAction === 'stockStatus' && (
                    <FormControl sx={{ minWidth: 200 }}>
                      <InputLabel>Stock Status</InputLabel>
                      <Select
                        value={bulkValue}
                        onChange={(e) => setBulkValue(e.target.value)}
                        label="Stock Status"
                      >
                        <MenuItem value="IN_STOCK">In Stock</MenuItem>
                        <MenuItem value="LOW_STOCK">Low Stock</MenuItem>
                        <MenuItem value="OUT_OF_STOCK">Out of Stock</MenuItem>
                      </Select>
                    </FormControl>
                  )}

                  {bulkAction === 'price' && (
                    <TextField
                      label="New Price"
                      type="number"
                      value={bulkValue}
                      onChange={(e) => setBulkValue(e.target.value)}
                      sx={{ minWidth: 200 }}
                    />
                  )}

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBulkUpdate}
                    disabled={saving || !bulkAction || !bulkValue || selectedProducts.length === 0}
                    startIcon={<Save />}
                  >
                    {saving ? 'Updating...' : 'Apply to Selected'}
                  </Button>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedProducts.length === products.length}
                            indeterminate={
                              selectedProducts.length > 0 &&
                              selectedProducts.length < products.length
                            }
                            onChange={handleSelectAll}
                          />
                        </TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>SKU</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Stock Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow
                          key={product.id}
                          hover
                          onClick={() => handleSelectProduct(product.id)}
                          role="checkbox"
                          selected={selectedProducts.includes(product.id)}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => handleSelectProduct(product.id)}
                            />
                          </TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>
                            {product.price.regularPrice.amount.value}{' '}
                            {product.price.regularPrice.amount.currency}
                          </TableCell>
                          <TableCell>{product.status}</TableCell>
                          <TableCell>{product.stockStatus}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
};

export default BulkOperationsPage;
