import React, { useState, useEffect } from 'react';
import {
  Button,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridRenderCellParams,
  GridToolbar,
  GridSelectionModel,
} from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ProductService } from '../../services/ProductService';
import { Product, ProductStatus, StockStatus } from '@/types/Product';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useSnackbar } from 'notistack';
import PageLayout from '../../components/layout/PageLayout';

const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, [paginationModel]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductService.getProducts();
      setProducts(response);
    } catch (error) {
      console.error('Error loading products:', error);
      enqueueSnackbar('Failed to load products', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    navigate('/admin/products/new');
  };

  const handleEditProduct = (id: string) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    try {
      await ProductService.deleteProduct(selectedProduct.id);
      enqueueSnackbar('Product deleted successfully', { variant: 'success' });
      loadProducts();
    } catch (error) {
      enqueueSnackbar('Failed to delete product', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'sku', headerName: 'SKU', width: 130 },
    {
      field: 'price',
      headerName: 'Price',
      width: 100,
      valueGetter: (params: GridValueGetterParams) =>
        `$${params.row.price.regularPrice.amount.value.toFixed(2)}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color={
            params.value === ProductStatus.ACTIVE
              ? 'success'
              : params.value === ProductStatus.DRAFT
              ? 'default'
              : 'error'
          }
          size="small"
        />
      ),
    },
    {
      field: 'stockStatus',
      headerName: 'Stock',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color={
            params.value === StockStatus.IN_STOCK
              ? 'success'
              : params.value === StockStatus.LOW_STOCK
              ? 'warning'
              : 'error'
          }
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => handleEditProduct(params.row.id)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => handleDeleteClick(params.row)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <PageLayout title="Products">
      <div className="flex flex-col h-full">
        <div className="flex justify-end mb-4">
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAddProduct}
          >
            Add Product
          </Button>
        </div>

        <div className="flex-1">
          <DataGrid
            rows={products}
            columns={columns}
            loading={loading}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50]}
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight
            slots={{ toolbar: GridToolbar }}
            getRowId={(row) => row.id}
          />
        </div>

        <ConfirmDialog
          open={deleteDialogOpen}
          title="Delete Product"
          content={`Are you sure you want to delete ${selectedProduct?.name}?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setSelectedProduct(null);
          }}
        />
      </div>
    </PageLayout>
  );
};

export default ProductListPage;
