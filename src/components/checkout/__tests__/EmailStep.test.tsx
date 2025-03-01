import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { EmailStep } from '../EmailStep';
import { GuestCheckoutProvider } from '../../../store/GuestCheckoutContext';

const mockSetEmail = jest.fn();

jest.mock('../../../store/GuestCheckoutContext', () => ({
  ...jest.requireActual('../../../store/GuestCheckoutContext'),
  useGuestCheckout: () => ({
    state: {
      email: '',
      loading: false,
      error: null,
    },
    setEmail: mockSetEmail,
  }),
}));

describe('EmailStep', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the email form correctly', () => {
    render(
      <MockedProvider>
        <GuestCheckoutProvider cartId="test-cart-id">
          <EmailStep />
        </GuestCheckoutProvider>
      </MockedProvider>
    );

    expect(screen.getByText('Guest Checkout')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue to Shipping' })).toBeInTheDocument();
  });

  it('handles email submission correctly', async () => {
    render(
      <MockedProvider>
        <GuestCheckoutProvider cartId="test-cart-id">
          <EmailStep />
        </GuestCheckoutProvider>
      </MockedProvider>
    );

    const emailInput = screen.getByLabelText('Email address');
    const submitButton = screen.getByRole('button', { name: 'Continue to Shipping' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetEmail).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('validates email format', async () => {
    render(
      <MockedProvider>
        <GuestCheckoutProvider cartId="test-cart-id">
          <EmailStep />
        </GuestCheckoutProvider>
      </MockedProvider>
    );

    const emailInput = screen.getByLabelText('Email address');
    const submitButton = screen.getByRole('button', { name: 'Continue to Shipping' });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    // The native HTML5 validation should prevent form submission
    expect(emailInput).toBeInvalid();
    expect(mockSetEmail).not.toHaveBeenCalled();
  });

  it('displays loading state during submission', async () => {
    jest.mock('../../../store/GuestCheckoutContext', () => ({
      ...jest.requireActual('../../../store/GuestCheckoutContext'),
      useGuestCheckout: () => ({
        state: {
          email: '',
          loading: true,
          error: null,
        },
        setEmail: mockSetEmail,
      }),
    }));

    render(
      <MockedProvider>
        <GuestCheckoutProvider cartId="test-cart-id">
          <EmailStep />
        </GuestCheckoutProvider>
      </MockedProvider>
    );

    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Continuing...');
  });

  it('displays error message when submission fails', async () => {
    jest.mock('../../../store/GuestCheckoutContext', () => ({
      ...jest.requireActual('../../../store/GuestCheckoutContext'),
      useGuestCheckout: () => ({
        state: {
          email: '',
          loading: false,
          error: 'Failed to save email',
        },
        setEmail: mockSetEmail,
      }),
    }));

    render(
      <MockedProvider>
        <GuestCheckoutProvider cartId="test-cart-id">
          <EmailStep />
        </GuestCheckoutProvider>
      </MockedProvider>
    );

    expect(screen.getByText('Failed to save email')).toBeInTheDocument();
  });
});
