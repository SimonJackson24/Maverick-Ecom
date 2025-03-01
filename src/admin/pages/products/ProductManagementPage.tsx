import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdobeCommerceService from '../../../services/AdobeCommerceService';

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  status: number;
  visibility: number;
  qty: number;
}

const ProductManagementPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const commerceService = AdobeCommerceService.getInstance({
    baseUrl: process.env.VITE_ADOBE_COMMERCE_URL || '',
    accessToken: process.env.VITE_ADOBE_COMMERCE_ACCESS_TOKEN || '',
  });

  const columns: GridColDef[] = [
    { field: 'sku', headerName: 'SKU', width: 130 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'price', headerName: 'Price', width: 100, type: 'number' },
    { field: 'qty', headerName: 'Quantity', width: 100, type: 'number' },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      valueGetter: (params) => params.value === 1 ? 'Enabled' : 'Disabled',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.sku)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await commerceService.getProducts({
        searchCriteria: {
          pageSize: 20,
          currentPage: 1,
        },
      });
      setProducts(response.items.map((item: any) => ({
        id: item.id,
        sku: item.sku,
        name: item.name,
        price: item.price,
        status: item.status,
        visibility: item.visibility,
        qty: item.extension_attributes?.stock_item?.qty || 0,
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setSelectedProduct(null);
    setOpenDialog(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleDelete = async (sku: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await commerceService.deleteProduct(sku);
        await fetchProducts();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error deleting product');
      }
    }
  };

  const handleSave = async (formData: any) => {
    try {
      if (selectedProduct) {
        await commerceService.updateProduct(selectedProduct.sku, {
          product: formData,
        });
      } else {
        await commerceService.createProduct({
          product: {
            ...formData,
            attributeSetId: 4, // Default attribute set
            typeId: 'simple',
          },
        });
      }
      setOpenDialog(false);
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving product');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5" component="h2">
                  Product Management
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAdd}
                >
                  Add Product
                </Button>
              </Box>

              <TextField
                fullWidth
                label="Search Products"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
              />

              {error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <Box sx={{ height: 600, width: '100%' }}>
                  <DataGrid
                    rows={products.filter(product => 
                      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
                    )}
                    columns={columns}
                    loading={loading}
                    pageSizeOptions={[10, 20, 50]}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 10,
                        },
                      },
                    }}
                    disableRowSelectionOnClick
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProduct ? 'Edit Product' : 'Add Product'}
        </DialogTitle>
        <DialogContent>
          {/* Add form fields for product data */}
          {/* This is a placeholder - you'll need to implement the actual form */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={() => handleSave({})}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagementPage;
