import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { OrderConfirmationPage } from '../OrderConfirmationPage';
import { GuestCheckoutProvider } from '../../store/GuestCheckoutContext';

const mockNavigate = jest.fn();
const mockReset = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../store/GuestCheckoutContext', () => ({
  ...jest.requireActual('../../store/GuestCheckoutContext'),
  useGuestCheckout: () => ({
    state: {
      orderNumber: '000000123',
      email: 'test@example.com',
      shippingAddress: {
        firstname: 'John',
        lastname: 'Doe',
        street: ['123 Main St', 'Apt 4B'],
        city: 'Anytown',
        region: 'CA',
        postcode: '12345',
        telephone: '123-456-7890',
      },
      paymentMethod: 'cc',
    },
    reset: mockReset,
  }),
}));

describe('OrderConfirmationPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders order confirmation details correctly', () => {
    render(
      <MemoryRouter>
        <GuestCheckoutProvider cartId="test-cart-id">
          <OrderConfirmationPage />
        </GuestCheckoutProvider>
      </MemoryRouter>
    );

    // Check for order confirmation message
    expect(screen.getByText('Thank you for your order!')).toBeInTheDocument();
    expect(screen.getByText(/Order #000000123/)).toBeInTheDocument();
    expect(
      screen.getByText(/We've sent a confirmation email to test@example.com/)
    ).toBeInTheDocument();

    // Check for shipping address
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('123 Main St, Apt 4B')).toBeInTheDocument();
    expect(screen.getByText('Anytown, CA 12345')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();

    // Check for payment method
    expect(screen.getByText('Credit Card')).toBeInTheDocument();

    // Check for action buttons
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
    expect(screen.getByText('Track Order')).toBeInTheDocument();
  });

  it('redirects to cart if no order number is present', () => {
    jest.mock('../../store/GuestCheckoutContext', () => ({
      ...jest.requireActual('../../store/GuestCheckoutContext'),
      useGuestCheckout: () => ({
        state: {
          orderNumber: null,
        },
        reset: mockReset,
      }),
    }));

    render(
      <MemoryRouter>
        <GuestCheckoutProvider cartId="test-cart-id">
          <OrderConfirmationPage />
        </GuestCheckoutProvider>
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/cart');
  });

  it('handles continue shopping action correctly', () => {
    render(
      <MemoryRouter>
        <GuestCheckoutProvider cartId="test-cart-id">
          <OrderConfirmationPage />
        </GuestCheckoutProvider>
      </MemoryRouter>
    );

    const continueShoppingButton = screen.getByText('Continue Shopping');
    fireEvent.click(continueShoppingButton);

    expect(mockReset).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders track order link with correct order number', () => {
    render(
      <MemoryRouter>
        <GuestCheckoutProvider cartId="test-cart-id">
          <OrderConfirmationPage />
        </GuestCheckoutProvider>
      </MemoryRouter>
    );

    const trackOrderLink = screen.getByText('Track Order').closest('a');
    expect(trackOrderLink).toHaveAttribute('href', '/order-tracking/000000123');
  });

  it('displays different payment methods correctly', () => {
    const paymentMethods = [
      { method: 'cc', display: 'Credit Card' },
      { method: 'checkmo', display: 'Check / Money Order' },
      { method: 'banktransfer', display: 'Bank Transfer' },
    ];

    paymentMethods.forEach(({ method, display }) => {
      jest.mock('../../store/GuestCheckoutContext', () => ({
        ...jest.requireActual('../../store/GuestCheckoutContext'),
        useGuestCheckout: () => ({
          state: {
            orderNumber: '000000123',
            paymentMethod: method,
          },
          reset: mockReset,
        }),
      }));

      render(
        <MemoryRouter>
          <GuestCheckoutProvider cartId="test-cart-id">
            <OrderConfirmationPage />
          </GuestCheckoutProvider>
        </MemoryRouter>
      );

      expect(screen.getByText(display)).toBeInTheDocument();
    });
  });
});
