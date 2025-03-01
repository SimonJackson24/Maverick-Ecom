import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GuestOrderTracking } from '../GuestOrderTracking';
import { TRACK_ORDER } from '../../../graphql/orders';

const mockOrderData = {
  customer: {
    order: {
      id: 'order1',
      number: '000000001',
      status: 'processing',
      shipments: [
        {
          id: 'ship1',
          tracking: {
            title: 'Package 1',
            number: '1Z999999999999999',
            carrier: 'UPS',
            status: 'in_transit',
          },
        },
      ],
    },
  },
};

const mocks = [
  {
    request: {
      query: TRACK_ORDER,
      variables: { orderNumber: '000000001' },
    },
    result: {
      data: mockOrderData,
    },
  },
];

describe('GuestOrderTracking', () => {
  const mockOnOrderFound = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the tracking form correctly', () => {
    render(
      <MockedProvider mocks={[]}>
        <GuestOrderTracking onOrderFound={mockOnOrderFound} />
      </MockedProvider>
    );

    expect(screen.getByText('Track Your Order')).toBeInTheDocument();
    expect(screen.getByLabelText('Order Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Track Order' })).toBeInTheDocument();
  });

  it('shows validation error when submitting empty form', async () => {
    render(
      <MockedProvider mocks={[]}>
        <GuestOrderTracking onOrderFound={mockOnOrderFound} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Track Order' }));

    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
    });
  });

  it('tracks order successfully', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <GuestOrderTracking onOrderFound={mockOnOrderFound} />
      </MockedProvider>
    );

    // Fill in form
    fireEvent.change(screen.getByLabelText('Order Number'), {
      target: { value: '000000001' },
    });
    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'test@example.com' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Track Order' }));

    await waitFor(() => {
      expect(screen.getByText('processing')).toBeInTheDocument();
      expect(screen.getByText('in_transit via UPS')).toBeInTheDocument();
      expect(screen.getByText('Tracking Number: 1Z999999999999999')).toBeInTheDocument();
    });

    expect(mockOnOrderFound).toHaveBeenCalledWith('000000001');
  });

  it('handles tracking error correctly', async () => {
    const errorMock = {
      request: {
        query: TRACK_ORDER,
        variables: { orderNumber: 'invalid' },
      },
      error: new Error('Order not found'),
    };

    render(
      <MockedProvider mocks={[errorMock]}>
        <GuestOrderTracking onOrderFound={mockOnOrderFound} />
      </MockedProvider>
    );

    // Fill in form
    fireEvent.change(screen.getByLabelText('Order Number'), {
      target: { value: 'invalid' },
    });
    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'test@example.com' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Track Order' }));

    await waitFor(() => {
      expect(
        screen.getByText('Unable to find your order. Please check your order number and email.')
      ).toBeInTheDocument();
    });

    expect(mockOnOrderFound).not.toHaveBeenCalled();
  });

  it('shows loading state while tracking', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <GuestOrderTracking onOrderFound={mockOnOrderFound} />
      </MockedProvider>
    );

    // Fill in form
    fireEvent.change(screen.getByLabelText('Order Number'), {
      target: { value: '000000001' },
    });
    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'test@example.com' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Track Order' }));

    expect(screen.getByText('Tracking Order...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Tracking Order...')).not.toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <GuestOrderTracking onOrderFound={mockOnOrderFound} />
      </MockedProvider>
    );

    const emailInput = screen.getByLabelText('Email Address');
    
    // Test invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText('Order Number'), {
      target: { value: '000000001' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Track Order' }));

    // The native HTML5 validation should prevent form submission
    expect(emailInput).toBeInvalid();
  });
});
