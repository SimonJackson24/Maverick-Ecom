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
  Checkbox,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  LocalShipping,
  Print,
  Download,
  Preview,
  Warning,
  CheckCircle,
  Error,
} from '@mui/icons-material';
import { useMutation, useQuery } from '@apollo/client';
import { format } from 'date-fns';
import { CREATE_BULK_SHIPPING_LABELS, GET_PENDING_SHIPMENTS } from '../../graphql/shipping';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  shippingAddress: {
    street: string;
    city: string;
    postcode: string;
    country: string;
  };
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    weight: number;
  }>;
  status: string;
  createdAt: string;
}

const BulkLabelGenerator: React.FC = () => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { loading: ordersLoading, data: ordersData, refetch } = useQuery(GET_PENDING_SHIPMENTS);
  const [generateLabels, { loading: generatingLabels }] = useMutation(CREATE_BULK_SHIPPING_LABELS);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedOrders(ordersData?.pendingShipments.map((order: Order) => order.id) || []);
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      }
      return [...prev, orderId];
    });
  };

  const handleGenerateLabels = async () => {
    try {
      setError(null);
      const { data } = await generateLabels({
        variables: {
          orderIds: selectedOrders,
        },
      });

      // Download all labels as a single PDF
      if (data?.createBulkShippingLabels?.labelUrl) {
        window.open(data.createBulkShippingLabels.labelUrl, '_blank');
      }

      // Refresh the orders list
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate labels');
    }
  };

  const calculateTotalWeight = (items: Order['items']) => {
    return items.reduce((total, item) => total + (item.weight * item.quantity), 0);
  };

  const getAddressString = (address: Order['shippingAddress']) => {
    return `${address.street}, ${address.city}, ${address.postcode}, ${address.country}`;
  };

  if (ordersLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  const orders = ordersData?.pendingShipments || [];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Bulk Label Generation</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Print />}
          disabled={selectedOrders.length === 0 || generatingLabels}
          onClick={handleGenerateLabels}
        >
          Generate {selectedOrders.length} Labels
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedOrders.length > 0 && selectedOrders.length < orders.length}
                    checked={selectedOrders.length > 0 && selectedOrders.length === orders.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Order Number</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Shipping Address</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total Weight</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order: Order) => (
                <TableRow
                  key={order.id}
                  hover
                  selected={selectedOrders.includes(order.id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                    />
                  </TableCell>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{getAddressString(order.shippingAddress)}</TableCell>
                  <TableCell>
                    {order.items.map(item => (
                      <Typography key={item.id} variant="body2">
                        {item.quantity}x {item.productName}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>{calculateTotalWeight(order.items).toFixed(2)} kg</TableCell>
                  <TableCell>{format(new Date(order.createdAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={order.status === 'ready_to_ship' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={Boolean(previewUrl)} onClose={() => setPreviewUrl(null)} maxWidth="md" fullWidth>
        <DialogTitle>Label Preview</DialogTitle>
        <DialogContent>
          {previewUrl && (
            <Box sx={{ width: '100%', height: '600px' }}>
              <iframe
                src={previewUrl}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Label Preview"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewUrl(null)}>Close</Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Download />}
            onClick={() => window.open(previewUrl!, '_blank')}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BulkLabelGenerator;
