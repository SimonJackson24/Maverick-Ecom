import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import OrderFulfillmentList from './components/OrderFulfillmentList';

const FulfillmentPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Order Fulfillment
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <OrderFulfillmentList />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FulfillmentPage;
