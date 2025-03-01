import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Alert,
  Paper,
} from '@mui/material';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // TODO: Implement newsletter subscription
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <Box
      component="section"
      sx={{
        py: 8,
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Stay Connected
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Subscribe to our newsletter for exclusive offers, new products, and scent inspiration.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mt: 3,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === 'loading'}
              sx={{ flexGrow: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={status === 'loading'}
              sx={{ minWidth: { sm: '120px' } }}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </Box>

          {status === 'success' && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Thank you for subscribing! Please check your email to confirm your subscription.
            </Alert>
          )}

          {status === 'error' && (
            <Alert severity="error" sx={{ mt: 2 }}>
              There was an error subscribing to the newsletter. Please try again.
            </Alert>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Newsletter;
