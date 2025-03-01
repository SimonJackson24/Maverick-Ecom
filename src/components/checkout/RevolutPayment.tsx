import React, { useEffect, useState } from 'react';
import { RevolutPaymentService } from '../../services/RevolutPaymentService';
import { CircularProgress } from '@mui/material';
import { useGuestCheckout } from '../../store/GuestCheckoutContext';

interface Props {
  amount: number;
  currency: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

const RevolutPayment: React.FC<Props> = ({ amount, currency, onSuccess, onError }) => {
  const [loading, setLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const { state } = useGuestCheckout();

  useEffect(() => {
    const initializePayment = async () => {
      try {
        setLoading(true);
        const revolutService = RevolutPaymentService.getInstance();
        
        // Create payment order
        const order = await revolutService.createPaymentOrder({
          amount,
          currency,
          email: state.email,
          description: `Order payment for ${state.email}`,
        });

        // Get payment widget URL
        const widgetUrl = revolutService.getPaymentWidgetUrl(order.id);
        setPaymentUrl(widgetUrl);

        // Set up message listener for payment status
        const handleMessage = (event: MessageEvent) => {
          if (event.origin === 'https://merchant.revolut.com') {
            const { status, orderId } = event.data;
            
            if (status === 'COMPLETED') {
              onSuccess(orderId);
            } else if (status === 'FAILED' || status === 'CANCELLED') {
              onError(`Payment ${status.toLowerCase()}`);
            }
          }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Payment initialization failed');
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [amount, currency, state.email, onSuccess, onError]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <CircularProgress />
      </div>
    );
  }

  if (!paymentUrl) {
    return (
      <div className="text-red-600 p-4">
        Failed to initialize payment. Please try again.
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] relative">
      <iframe
        src={paymentUrl}
        frameBorder="0"
        allow="payment"
        className="w-full h-full"
        title="Revolut Payment"
      />
    </div>
  );
};

export default RevolutPayment;
