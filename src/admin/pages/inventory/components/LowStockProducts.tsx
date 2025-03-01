import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';

interface Product {
  id: string;
  name: string;
  currentStock: number;
  threshold: number;
}

interface Props {
  products: Product[];
}

const LowStockProducts: React.FC<Props> = ({ products }) => {
  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>
        Low Stock Products
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Current Stock</TableCell>
              <TableCell align="right">Threshold</TableCell>
              <TableCell>Stock Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const stockPercentage = (product.currentStock / product.threshold) * 100;
              return (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell align="right">{product.currentStock}</TableCell>
                  <TableCell align="right">{product.threshold}</TableCell>
                  <TableCell>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(stockPercentage, 100)}
                        color={stockPercentage < 50 ? 'error' : 'warning'}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LowStockProducts;
