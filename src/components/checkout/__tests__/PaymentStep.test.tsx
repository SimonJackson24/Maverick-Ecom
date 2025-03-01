import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { PaymentStep } from '../PaymentStep';
import { GuestCheckoutProvider } from '../../../store/GuestCheckoutContext';

const mockSetPaymentMethod = jest.fn();

const mockPaymentMethods = [
  { code: 'cc', title: 'Credit Card' },
  { code: 'checkmo', title: 'Check / Money Order' },
];

const mockCartTotals = {
  subtotal: { value: 100.00, currency: 'USD' },
  shipping: { value: 10.00, currency: 'USD' },
  tax: { value: 8.50, currency: 'USD' },
  grand_total: { value: 118.50, currency: 'USD' },
};

jest.mock('../../../store/GuestCheckoutContext', () => ({
  ...jest.requireActual('../../../store/GuestCheckoutContext'),
  useGuestCheckout: () => ({
    state: {
      paymentMethod: null,
      loading: false,
      error: null,
    },
    setPaymentMethod: mockSetPaymentMethod,
  }),
}));

describe('PaymentStep', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders payment methods and cart totals correctly', () => {
    render(
      <MockedProvider>
        <GuestCheckoutProvider cartId="test-cart-id">
          <PaymentStep
            availablePaymentMethods={mockPaymentMethods}
            cartTotals={mockCartTotals}
          />
        </GuestCheckoutProvider>
      </MockedProvider>
    );

    // Check payment methods
    mockPaymentMethods.forEach(method => {
      expect(screen.getByLabelText(method.title)).toBeInTheDocument();
    });

    // Check cart totals
    expect(screen.getByText('USD 100.00')).toBeInTheDocument(); // Subtotal
    expect(screen.getByText('USD 10.00')).toBeInTheDocument(); // Shipping
    expect(screen.getByText('USD 8.50')).toBeInTheDocument(); // Tax
    expect(screen.getByText('USD 118.50')).toBeInTheDocument(); // Grand total
  });

  it('shows credit card form when credit card payment is selected', async () => {
    render(
      <MockedProvider>
        <GuestCheckoutProvider cartId="test-cart-id">
          <PaymentStep
            availablePaymentMethods={mockPaymentMethods}
            cartTotals={mockCartTotals}
          />
        </GuestCheckoutProvider>
      </MockedProvider>
    );

    const ccRadio = screen.getByLabelText('Credit Card');
    fireEvent.click(ccRadio);

    expect(screen.getByLabelText('Name on card')).toBeInTheDocument();
    expect(screen.getByLabelText('Card number')).toBeInTheDocument();
    expect(screen.getByLabelText('Expiry date')).toBeInTheDocument();
    expect(screen.getByLabelText('CVV')).toBeInTheDocument();
  });

  it('formats credit card input correctly', async () => {
    render(
      <MockedProvider>
        <GuestCheckoutProvider cartId="test-cart-id">
          <PaymentStep
            availablePaymentMethods={mockPaymentMethods}
            cartTotals={mockCartTotals}
          />
        </GuestCheckoutProvider>
      </MockedProvider>
    );

    const ccRadio = screen.getByLabelText('Credit Card');
    fireEvent.click(ccRadio);

    const cardNumberInput = screen.getByLabelText('Card number');
    fireEvent.change(cardNumberInput, { target: { value: '4111111111111111' } });
    expect(cardNumberInput).toHaveValue('4111 1111 1111 1111');

    const expiryInput = screen.getByLabelText('Expiry date');
    fireEvent.change(expiryInput, { target: { value: '1223' } });
    expect(expiryInput).toHaveValue('12/23');
  });

  it('validates credit card form fields', async () => {
    render(
      <MockedProvider>
        <GuestCheckoutProvider cartId="test-cart-id">
          <PaymentStep
            availablePaymentMethods={mockPaymentMethods}
            cartTotals={mockCartTotals}
          />
        </GuestCheckoutProvider>
      </MockedProvider>
    );

    const ccRadio = screen.getByLabelText('Credit Card');
    fireEvent.click(ccRadio);

    const submitButton = screen.getByRole('button', { name: 'Review Order' });
    fireEvent.click(submitButton);

    // Check required field validation
    expect(screen.getByLabelText('Name on card')).toBeInvalid();
    expect(screen.getByLabelText('Card number')).toBeInvalid();
    expect(screen.getByLabelText('Expiry date')).toBeInvalid();
    expect(screen.getByLabelText('CVV')).toBeInvalid();
  });

  it('handles form submission correctly', async () => {
    render(
      <MockedProvider>
        <GuestCheckoutProvider cartId="test-cart-id">
          <PaymentStep
            availablePaymentMethods={mockPaymentMethods}
            cartTotals={mockCartTotals}
          />
        </GuestCheckoutProvider>
      </MockedProvider>
    );

    // Select payment method
    const ccRadio = screen.getByLabelText('Credit Card');
    fireEvent.click(ccRadio);

    // Fill in credit card details
    fireEvent.change(screen.getByLabelText('Name on card'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Card number'), {
      target: { value: '4111111111111111' },
    });
    fireEvent.change(screen.getByLabelText('Expiry date'), {
      target: { value: '1223' },
    });
    fireEvent.change(screen.getByLabelText('CVV'), {
      target: { value: '123' },
    });

    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Review Order' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetPaymentMethod).toHaveBeenCalledWith('cc');
    });
  });

  it('displays loading state during submission', () => {
    jest.mock('../../../store/GuestCheckoutContext', () => ({
      ...jest.requireActual('../../../store/GuestCheckoutContext'),
      useGuestCheckout: () => ({
        state: {
          paymentMethod: null,
          loading: true,
          error: null,
        },
        setPaymentMethod: mockSetPaymentMethod,
      }),
    }));

    render(
      <MockedProvider>
        <GuestCheckoutProvider cartId="test-cart-id">
          <PaymentStep
            availablePaymentMethods={mockPaymentMethods}
            cartTotals={mockCartTotals}
          />
        </GuestCheckoutProvider>
      </MockedProvider>
    );

    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Processing...');
  });

  it('displays error message when submission fails', () => {
    jest.mock('../../../store/GuestCheckoutContext', () => ({
      ...jest.requireActual('../../../store/GuestCheckoutContext'),
      useGuestCheckout: () => ({
        state: {
          paymentMethod: null,
          loading: false,
          error: 'Failed to process payment method',
        },
        setPaymentMethod: mockSetPaymentMethod,
      }),
    }));

    render(
      <MockedProvider>
        <GuestCheckoutProvider cartId="test-cart-id">
          <PaymentStep
            availablePaymentMethods={mockPaymentMethods}
            cartTotals={mockCartTotals}
          />
        </GuestCheckoutProvider>
      </MockedProvider>
    );

    expect(screen.getByText('Failed to process payment method')).toBeInTheDocument();
  });

  it('prevents invalid credit card number input', () => {
    render(
      <MockedProvider>
        <GuestCheckoutProvider cartId="test-cart-id">
          <PaymentStep
            availablePaymentMethods={mockPaymentMethods}
            cartTotals={mockCartTotals}
          />
        </GuestCheckoutProvider>
      </MockedProvider>
    );

    const ccRadio = screen.getByLabelText('Credit Card');
    fireEvent.click(ccRadio);

    const cardNumberInput = screen.getByLabelText('Card number');
    fireEvent.change(cardNumberInput, { target: { value: 'abc123' } });
    expect(cardNumberInput).toHaveValue('123');
  });

  it('handles back button navigation', () => {
    const mockHistoryBack = jest.spyOn(window.history, 'back').mockImplementation(() => {});

    render(
      <MockedProvider>
        <GuestCheckoutProvider cartId="test-cart-id">
          <PaymentStep
            availablePaymentMethods={mockPaymentMethods}
            cartTotals={mockCartTotals}
          />
        </GuestCheckoutProvider>
      </MockedProvider>
    );

    const backButton = screen.getByText('Back to Shipping');
    fireEvent.click(backButton);

    expect(mockHistoryBack).toHaveBeenCalled();
    mockHistoryBack.mockRestore();
  });
});
