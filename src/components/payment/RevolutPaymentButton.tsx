import React, { useState } from 'react';
import { useRevolutPaymentConfig } from '../../hooks/useRevolutPaymentConfig';
import { RevolutPaymentService } from '../../services/RevolutPaymentService';
import { Button, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface RevolutPaymentButtonProps {
  amount: number;
  currency?: string;
  email: string;
  orderId?: string;
  description?: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
}

export const RevolutPaymentButton: React.FC<RevolutPaymentButtonProps> = ({
  amount,
  currency = 'GBP',
  email,
  orderId,
  description,
  onSuccess,
  onError,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { config } = useRevolutPaymentConfig();
  const navigate = useNavigate();
  const paymentService = RevolutPaymentService.getInstance();

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const order = {
        amount,
        currency,
        email,
        description,
        order_id: orderId,
        capture_mode: 'AUTOMATIC',
        metadata: {
          orderId: orderId || '',
          customerEmail: email
        }
      };

      const response = await paymentService.createPaymentOrder(order);

      // Handle the payment response
      switch (response.status) {
        case 'COMPLETED':
          onSuccess?.(response.id);
          navigate('/checkout/success', { 
            state: { 
              paymentId: response.id,
              orderAmount: amount,
              currency 
            } 
          });
          break;

        case 'PENDING':
        case 'PROCESSING':
          // Redirect to Revolut checkout
          window.location.href = `${config.checkoutUrl}/${response.public_id}`;
          break;

        case 'FAILED':
          throw new Error('Payment failed. Please try again.');

        case 'CANCELLED':
          onCancel?.();
          navigate('/checkout/cancel');
          break;

        default:
          throw new Error('Unknown payment status');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      onError?.(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      
      <Button
        variant="contained"
        color="primary"
        onClick={handlePayment}
        disabled={loading}
        fullWidth
        sx={{
          height: 48,
          backgroundColor: '#0075EB',
          '&:hover': {
            backgroundColor: '#005BBC'
          }
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          `Pay ${amount} ${currency} with Revolut`
        )}
      </Button>
    </div>
  );
};
