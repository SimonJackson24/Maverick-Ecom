import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Box,
  Typography
} from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_ORDERS_FOR_FULFILLMENT } from '../../../graphql/orders';
import LoadingSpinner from '../../../../../src/components/common/LoadingSpinner';
import ErrorMessage from '../../../../../src/components/common/ErrorMessage';

const OrderFulfillmentList: React.FC = () => {
  const { loading, error, data } = useQuery(GET_ORDERS_FOR_FULFILLMENT);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  const orders = data?.ordersForFulfillment || [];

  if (orders.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="textSecondary">
          No orders pending fulfillment
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.orderNumber}</TableCell>
              <TableCell>{order.customer.name}</TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{order.items.length} items</TableCell>
              <TableCell>
                <Chip 
                  label={order.status} 
                  color={order.status === 'PENDING' ? 'warning' : 'success'} 
                  size="small" 
                />
              </TableCell>
              <TableCell>
                <Button 
                  variant="contained" 
                  size="small"
                  onClick={() => {/* TODO: Implement fulfillment action */}}
                >
                  Process
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderFulfillmentList;
