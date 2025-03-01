import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ShippingStep } from '../ShippingStep';
import { GuestCheckoutProvider } from '../../../store/GuestCheckoutContext';

const mockSetShippingAddress = jest.fn();
const mockSetShippingMethod = jest.fn();

const mockShippingMethods = [
  {
    carrier_code: 'ups',
    carrier_title: 'UPS',
    method_code: 'ground',
    method_title: 'Ground',
    amount: {
      value: 10.99,
      currency: 'USD',
    },
  },
  {
    carrier_code: 'ups',
    carrier_title: 'UPS',
    method_code: '2day',
    method_title: '2-Day Air',
    amount: {
      value: 25.99,
      currency: 'USD',
    },
  },
];

jest.mock('../../../store/GuestCheckoutContext', () => ({
  ...jest.requireActual('../../../store/GuestCheckoutContext'),
  useGuestCheckout: () => ({
    state: {
      shippingAddress: null,
      shippingMethod: null,
      loading: false,
      error: null,
    },
    setShippingAddress: mockSetShippingAddress,
    setShippingMethod: mockSetShippingMethod,
  }),
}));

describe('ShippingStep', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the shipping form correctly', () => {
    render(
      <MockedProvider>
        <GuestCheckoutProvider cartId="test-cart-id">
          <ShippingStep availableShippingMethods={mockShippingMethods} />
        </GuestCheckoutProvider>
      </MockedProvider>
    );

    expect(screen.getByLabelText('First name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last name')).toBeInTheDocument();
    expect(screen.getByLabelText('Street address')).toBeInTheDocument();
    expect(screen.getByLabelText('City')).toBeInTheDocument();
    expect(screen.getByLabelText('State / Province')).toBeInTheDocument();
    expect(screen.getByLabelText('ZIP / Postal code')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone number')).toBeInTheDocument();
    expect(screen.getByText('Shipping Method')).toBeInTheDocument();
  });

  it('displays available shipping methods', () => {
    render(
      <MockedProvider>
        <GuestCheckoutProvider cartId="test-cart-id">
          <ShippingStep availableShippingMethods={mockShippingMethods} />
        </GuestCheckoutProvider>
      </MockedProvider>
    );

    mockShippingMethods.forEach((method) => {
      expect(screen.getByText(`${method.carrier_title} - ${method.method_title}`)).toBeInTheDocument();
      expect(screen.getByText(`USD ${method.amount.value.toFixed(2)}`)).toBeInTheDocument();
    });
  });

  it('handles form submission correctly', async () => {
    render(
      <MockedProvider>
        <GuestCheckoutProvider cartId="test-cart-id">
          <ShippingStep availableShippingMethods={mockShippingMethods} />
        </GuestCheckoutProvider>
      </MockedProvider>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Street address'), {
      target: { value: '123 Main St' },
    });
    fireEvent.change(screen.getByLabelText('City'), { target: { value: 'Anytown' } });
    fireEvent.change(screen.getByLabelText('State / Province'), { target: { value: 'CA' } });
    fireEvent.change(screen.getByLabelText('ZIP / Postal code'), {
      target: { value: '12345' },
    });
    fireEvent.change(screen.getByLabelText('Phone number'), {
      target: { value: '123-456-7890' },
    });

    // Select shipping method
    const shippingMethodRadio = screen.getByLabelText('UPS - Ground');
    fireEvent.click(shippingMethodRadio);

    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Continue to Payment' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetShippingAddress).toHaveBeenCalledWith({
        firstname: 'John',
        lastname: 'Doe',
        street: ['123 Main St'],
        city: 'Anytown',
        region: 'CA',
        postcode: '12345',
        countryCode: 'US',
        telephone: '123-456-7890',
      });
      expect(mockSetShippingMethod).toHaveBeenCalledWith('ups', 'ground');
    });
  });

  it('validates required fields', async () => {
    render(
      <MockedProvider>
        <GuestCheckoutProvider cartId="test-cart-id">
          <ShippingStep availableShippingMethods={mockShippingMethods} />
        </GuestCheckoutProvider>
      </MockedProvider>
    );

    const submitButton = screen.getByRole('button', { name: 'Continue to Payment' });
    fireEvent.click(submitButton);

    // Check that required fields are marked as invalid
    expect(screen.getByLabelText('First name')).toBeInvalid();
    expect(screen.getByLabelText('Last name')).toBeInvalid();
    expect(screen.getByLabelText('Street address')).toBeInvalid();
    expect(screen.getByLabelText('City')).toBeInvalid();
    expect(screen.getByLabelText('State / Province')).toBeInvalid();
    expect(screen.getByLabelText('ZIP / Postal code')).toBeInvalid();
    expect(screen.getByLabelText('Phone number')).toBeInvalid();

    expect(mockSetShippingAddress).not.toHaveBeenCalled();
    expect(mockSetShippingMethod).not.toHaveBeenCalled();
  });

  it('displays loading state during submission', () => {
    jest.mock('../../../store/GuestCheckoutContext', () => ({
      ...jest.requireActual('../../../store/GuestCheckoutContext'),
      useGuestCheckout: () => ({
        state: {
          shippingAddress: null,
          shippingMethod: null,
          loading: true,
          error: null,
        },
        setShippingAddress: mockSetShippingAddress,
        setShippingMethod: mockSetShippingMethod,
      }),
    }));

    render(
      <MockedProvider>
        <GuestCheckoutProvider cartId="test-cart-id">
          <ShippingStep availableShippingMethods={mockShippingMethods} />
        </GuestCheckoutProvider>
      </MockedProvider>
    );

    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Saving...');
  });

  it('displays error message when submission fails', () => {
    jest.mock('../../../store/GuestCheckoutContext', () => ({
      ...jest.requireActual('../../../store/GuestCheckoutContext'),
      useGuestCheckout: () => ({
        state: {
          shippingAddress: null,
          shippingMethod: null,
          loading: false,
          error: 'Failed to save shipping information',
        },
        setShippingAddress: mockSetShippingAddress,
        setShippingMethod: mockSetShippingMethod,
      }),
    }));

    render(
      <MockedProvider>
        <GuestCheckoutProvider cartId="test-cart-id">
          <ShippingStep availableShippingMethods={mockShippingMethods} />
        </GuestCheckoutProvider>
      </MockedProvider>
    );

    expect(screen.getByText('Failed to save shipping information')).toBeInTheDocument();
  });
});
