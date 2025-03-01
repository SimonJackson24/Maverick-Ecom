import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, History as HistoryIcon } from '@mui/icons-material';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCTS_INVENTORY, UPDATE_STOCK_LEVEL, LOG_STOCK_ADJUSTMENT } from '../../../graphql/inventory';
import { formatDate } from '../../../../utils/dateUtils';
import { Product } from '../../../../types/product';

interface StockAdjustment {
  type: 'add' | 'subtract' | 'set';
  quantity: number;
  reason: string;
  notes?: string;
}

interface InventoryProduct extends Product {
  stockLevel: number;
  lowStockThreshold: number;
  lastUpdated: string;
  stock_status: string;
}

const StockManagement: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<InventoryProduct | null>(null);
  const [adjustmentDialog, setAdjustmentDialog] = useState(false);
  const [adjustment, setAdjustment] = useState<StockAdjustment>({
    type: 'add',
    quantity: 0,
    reason: 'restock',
    notes: '',
  });

  const { data, loading, error } = useQuery<{ products: InventoryProduct[] }>(GET_PRODUCTS_INVENTORY);
  
  const [updateStock] = useMutation(UPDATE_STOCK_LEVEL, {
    refetchQueries: [{ query: GET_PRODUCTS_INVENTORY }],
  });

  const [logStockAdjustment] = useMutation(LOG_STOCK_ADJUSTMENT);

  const handleAdjustStock = async () => {
    if (!selectedProduct) return;

    const newStockLevel = calculateNewStockLevel(selectedProduct.stockLevel, adjustment);
    
    try {
      await updateStock({
        variables: {
          input: {
            productId: selectedProduct.id,
            stockLevel: newStockLevel,
          },
        },
      });

      // Log the adjustment
      await logStockAdjustment({
        variables: {
          input: {
            productId: selectedProduct.id,
            type: adjustment.type,
            quantity: adjustment.quantity,
            reason: adjustment.reason,
            notes: adjustment.notes,
          },
        },
      });

      setAdjustmentDialog(false);
      setSelectedProduct(null);
      setAdjustment({
        type: 'add',
        quantity: 0,
        reason: 'restock',
        notes: '',
      });
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const calculateNewStockLevel = (currentStock: number, adjustment: StockAdjustment): number => {
    switch (adjustment.type) {
      case 'add':
        return currentStock + adjustment.quantity;
      case 'subtract':
        return Math.max(0, currentStock - adjustment.quantity);
      case 'set':
        return Math.max(0, adjustment.quantity);
      default:
        return currentStock;
    }
  };

  if (loading) return <Box p={2}>Loading inventory data...</Box>;
  if (error) return <Box p={2}><Alert severity="error">Error loading inventory data</Alert></Box>;

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Current Stock</TableCell>
              <TableCell>Low Stock Threshold</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.products.map((product: InventoryProduct) => (
              <TableRow 
                key={product.id}
                sx={{
                  backgroundColor: product.stockLevel <= product.lowStockThreshold ? '#fff3e0' : 'inherit'
                }}
              >
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.stockLevel}</TableCell>
                <TableCell>{product.lowStockThreshold}</TableCell>
                <TableCell>{product.stock_status}</TableCell>
                <TableCell>{formatDate(product.lastUpdated)}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedProduct(product);
                      setAdjustmentDialog(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton>
                    <HistoryIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={adjustmentDialog} onClose={() => setAdjustmentDialog(false)}>
        <DialogTitle>Adjust Stock Level</DialogTitle>
        <DialogContent>
          <Box sx={{ width: '400px', pt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Current Stock: {selectedProduct?.stockLevel}
            </Typography>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Adjustment Type</InputLabel>
              <Select
                value={adjustment.type}
                onChange={(e) => setAdjustment({ ...adjustment, type: e.target.value as 'add' | 'subtract' | 'set' })}
              >
                <MenuItem value="add">Add Stock</MenuItem>
                <MenuItem value="subtract">Remove Stock</MenuItem>
                <MenuItem value="set">Set Stock Level</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="number"
              label="Quantity"
              value={adjustment.quantity}
              onChange={(e) => setAdjustment({ ...adjustment, quantity: parseInt(e.target.value) || 0 })}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Reason</InputLabel>
              <Select
                value={adjustment.reason}
                onChange={(e) => setAdjustment({ ...adjustment, reason: e.target.value })}
              >
                <MenuItem value="restock">Restock</MenuItem>
                <MenuItem value="damage">Damaged/Defective</MenuItem>
                <MenuItem value="correction">Inventory Correction</MenuItem>
                <MenuItem value="return">Customer Return</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              value={adjustment.notes}
              onChange={(e) => setAdjustment({ ...adjustment, notes: e.target.value })}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdjustmentDialog(false)}>Cancel</Button>
          <Button onClick={handleAdjustStock} variant="contained" color="primary">
            Confirm Adjustment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StockManagement;
