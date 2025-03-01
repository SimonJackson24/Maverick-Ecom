import React from 'react';
import BrandedCheckout from '../components/checkout/BrandedCheckout';
import { Container, Paper } from '@mui/material';

const BrandedCheckoutPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <BrandedCheckout />
      </Paper>
    </Container>
  );
};

export default BrandedCheckoutPage;
