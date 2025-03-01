import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { format } from 'date-fns';
import { GET_ORDER_DETAILS } from '../../graphql/customer';
import { GET_SHIPMENT_TRACKING } from '../../graphql/tracking';
import * as Icons from '@mui/icons-material';

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'processing':
      return 'info';
    case 'cancelled':
      return 'error';
    case 'pending':
      return 'warning';
    default:
      return 'default';
  }
};

const getTrackingStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return <Icons.CheckCircle color="success" />;
    case 'in transit':
      return <Icons.LocalShipping color="info" />;
    default:
      return <Icons.Inventory />;
  }
};

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: orderData, loading: orderLoading, error: orderError } = useQuery(GET_ORDER_DETAILS, {
    variables: { orderId },
  });

  const { data: trackingData, loading: trackingLoading } = useQuery(GET_SHIPMENT_TRACKING, {
    variables: { trackingNumber: orderData?.order?.trackingNumber },
    skip: !orderData?.order?.trackingNumber,
  });

  if (orderLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (orderError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading order details: {orderError.message}
      </Alert>
    );
  }

  const order = orderData?.order;

  if (!order) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Order not found
      </Alert>
    );
  }

  const tracking = trackingData?.shipmentTracking;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">
          Order #{order.orderNumber}
        </Typography>
        <Chip
          label={order.status}
          color={getStatusColor(order.status) as any}
          sx={{ ml: 2 }}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell align="right">£{item.price.toFixed(2)}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">£{item.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {order.trackingNumber && tracking && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Tracking Information
              </Typography>
              {trackingLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Status
                    </Typography>
                    <Chip
                      label={tracking.status}
                      color={getStatusColor(tracking.status)}
                      icon={getTrackingStatusIcon(tracking.status)}
                    />
                    {tracking.estimatedDelivery && (
                      <Typography sx={{ mt: 2 }}>
                        Estimated Delivery: {format(new Date(tracking.estimatedDelivery), 'PPP')}
                      </Typography>
                    )}
                  </Box>
                  <Timeline>
                    {tracking.events.map((event, index) => (
                      <TimelineItem key={index}>
                        <TimelineOppositeContent color="text.secondary">
                          {format(new Date(event.eventDateTime), 'PPp')}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot color={event.status === tracking.status ? "primary" : "grey"}>
                            {getTrackingStatusIcon(event.status)}
                          </TimelineDot>
                          {index < tracking.events.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant="body2">{event.eventDescription}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {event.location}
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </>
              )}
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Order Date:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align="right">
                    {format(new Date(order.createdAt), 'MMM d, yyyy')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Subtotal:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align="right">£{order.total.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Shipping:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography align="right">
                    £{order.shippingMethod?.price.toFixed(2) || '0.00'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">Total:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" align="right">
                    £{(order.total + (order.shippingMethod?.price || 0)).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography>
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </Typography>
              <Typography>{order.shippingAddress.street}</Typography>
              <Typography>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postcode}
              </Typography>
              <Typography>{order.shippingAddress.country}</Typography>
            </Box>
            {order.trackingNumber && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Tracking Number:
                </Typography>
                <Typography>{order.trackingNumber}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetailsPage;
