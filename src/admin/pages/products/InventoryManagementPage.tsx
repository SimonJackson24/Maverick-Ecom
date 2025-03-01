import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Refresh,
  TrendingUp,
  Warning,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ProductService } from '../../services/ProductService';
import { AnalyticsService } from '../../services/AnalyticsService';
import { Product } from '../../types';
import AdminLayout from '../../components/layout/AdminLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useSnackbar } from 'notistack';

interface InventoryItem extends Product {
  quantity: number;
  threshold: number;
  demand: number;
  reorderPoint: number;
}

const InventoryManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const response = await ProductService.getProducts(
        { page: 1, perPage: 100 },
        { field: 'name', direction: 'ASC' }
      );

      // Get inventory analytics for demand forecasting
      const now = new Date();
      const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
      const analytics = await AnalyticsService.getInventoryAnalytics({
        start: threeMonthsAgo,
        end: new Date(),
      });

      const inventoryItems: InventoryItem[] = response.items.map((product) => ({
        ...product,
        quantity: Math.floor(Math.random() * 100), // TODO: Replace with actual inventory data
        threshold: 10,
        demand: analytics.forecasting.predictions.find(
          (p) => p.productId === product.id
        )?.expectedDemand || 0,
        reorderPoint: 20,
      }));

      setInventory(inventoryItems);
    } catch (error) {
      enqueueSnackbar('Failed to load inventory', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId: string, value: string) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: parseInt(value) || 0 }
          : item
      )
    );
  };

  const handleThresholdChange = (productId: string, value: string) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, threshold: parseInt(value) || 0 }
          : item
      )
    );
  };

  const handleSave = async (productId: string) => {
    const item = inventory.find((i) => i.id === productId);
    if (!item) return;

    try {
      setSaving(true);
      await ProductService.updateInventory(
        productId,
        item.quantity,
        item.quantity === 0
          ? 'OUT_OF_STOCK'
          : item.quantity <= item.threshold
          ? 'LOW_STOCK'
          : 'IN_STOCK'
      );
      enqueueSnackbar('Inventory updated successfully', { variant: 'success' });
      setEditMode((prev) => ({ ...prev, [productId]: false }));
    } catch (error) {
      enqueueSnackbar('Failed to update inventory', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'IN_STOCK':
        return 'success';
      case 'LOW_STOCK':
        return 'warning';
      case 'OUT_OF_STOCK':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    switch (filter) {
      case 'low':
        return (
          matchesSearch && item.quantity > 0 && item.quantity <= item.threshold
        );
      case 'out':
        return matchesSearch && item.quantity === 0;
      case 'reorder':
        return matchesSearch && item.quantity <= item.reorderPoint;
      default:
        return matchesSearch;
    }
  });

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
              <Typography variant="h4">Inventory Management</Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" gap={2} mb={3}>
                  <TextField
                    label="Search Products"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ minWidth: 200 }}
                  />

                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Filter</InputLabel>
                    <Select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      label="Filter"
                    >
                      <MenuItem value="all">All Items</MenuItem>
                      <MenuItem value="low">Low Stock</MenuItem>
                      <MenuItem value="out">Out of Stock</MenuItem>
                      <MenuItem value="reorder">Needs Reorder</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    startIcon={<Refresh />}
                    onClick={loadInventory}
                    variant="outlined"
                  >
                    Refresh
                  </Button>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>SKU</TableCell>
                        <TableCell>Stock Status</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Low Stock Threshold</TableCell>
                        <TableCell>Projected Demand</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredInventory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.sku}</TableCell>
                          <TableCell>
                            <Chip
                              label={item.stockStatus.replace('_', ' ')}
                              color={getStockStatusColor(item.stockStatus) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {editMode[item.id] ? (
                              <TextField
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleQuantityChange(item.id, e.target.value)
                                }
                                size="small"
                                inputProps={{ min: 0 }}
                              />
                            ) : (
                              item.quantity
                            )}
                          </TableCell>
                          <TableCell>
                            {editMode[item.id] ? (
                              <TextField
                                type="number"
                                value={item.threshold}
                                onChange={(e) =>
                                  handleThresholdChange(item.id, e.target.value)
                                }
                                size="small"
                                inputProps={{ min: 0 }}
                              />
                            ) : (
                              item.threshold
                            )}
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <TrendingUp
                                color={
                                  item.demand > item.quantity ? 'error' : 'success'
                                }
                              />
                              {item.demand} units/month
                            </Box>
                          </TableCell>
                          <TableCell>
                            {editMode[item.id] ? (
                              <Box display="flex" gap={1}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={() => handleSave(item.id)}
                                  disabled={saving}
                                  startIcon={<Save />}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="small"
                                  onClick={() =>
                                    setEditMode((prev) => ({
                                      ...prev,
                                      [item.id]: false,
                                    }))
                                  }
                                >
                                  Cancel
                                </Button>
                              </Box>
                            ) : (
                              <Button
                                size="small"
                                onClick={() =>
                                  setEditMode((prev) => ({
                                    ...prev,
                                    [item.id]: true,
                                  }))
                                }
                              >
                                Edit
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {inventory.some(
                  (item) => item.quantity <= item.threshold
                ) && (
                  <Alert
                    severity="warning"
                    icon={<Warning />}
                    sx={{ mt: 3 }}
                  >
                    Some products are running low on stock. Consider reordering
                    soon.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
};

export default InventoryManagementPage;
