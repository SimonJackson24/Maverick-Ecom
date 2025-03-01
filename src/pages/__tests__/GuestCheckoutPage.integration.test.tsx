import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { GuestCheckoutPage } from '../GuestCheckoutPage';
import { GuestCheckoutProvider } from '../../store/GuestCheckoutContext';
import {
  SET_GUEST_EMAIL,
  SET_SHIPPING_ADDRESS,
  SET_SHIPPING_METHOD,
  SET_PAYMENT_METHOD,
  GET_AVAILABLE_PAYMENT_METHODS,
  GET_CART_TOTALS,
  PLACE_ORDER,
} from '../../graphql/checkout';

const mockCartId = 'test-cart-id';
const mockOrderNumber = '000000123';

const mocks = [
  // Email Step
  {
    request: {
      query: SET_GUEST_EMAIL,
      variables: {
        cartId: mockCartId,
        email: 'test@example.com',
      },
    },
    result: {
      data: {
        setGuestEmailOnCart: {
          cart: {
            id: mockCartId,
            email: 'test@example.com',
          },
        },
      },
    },
  },
  // Shipping Step
  {
    request: {
      query: SET_SHIPPING_ADDRESS,
      variables: {
        cartId: mockCartId,
        firstname: 'John',
        lastname: 'Doe',
        street: ['123 Main St'],
        city: 'Anytown',
        region: 'CA',
        postcode: '12345',
        countryCode: 'US',
        telephone: '123-456-7890',
      },
    },
    result: {
      data: {
        setShippingAddressOnCart: {
          cart: {
            id: mockCartId,
            shipping_addresses: [
              {
                firstname: 'John',
                lastname: 'Doe',
                street: ['123 Main St'],
                city: 'Anytown',
                region: { code: 'CA', label: 'California' },
                postcode: '12345',
                country: { code: 'US', label: 'United States' },
                telephone: '123-456-7890',
                available_shipping_methods: [
                  {
                    carrier_code: 'ups',
                    carrier_title: 'UPS',
                    method_code: 'ground',
                    method_title: 'Ground',
                    amount: { value: 10.99, currency: 'USD' },
                  },
                ],
              },
            ],
          },
        },
      },
    },
  },
  {
    request: {
      query: SET_SHIPPING_METHOD,
      variables: {
        cartId: mockCartId,
        carrierCode: 'ups',
        methodCode: 'ground',
      },
    },
    result: {
      data: {
        setShippingMethodOnCart: {
          cart: {
            id: mockCartId,
            shipping_addresses: [
              {
                selected_shipping_method: {
                  carrier_code: 'ups',
                  method_code: 'ground',
                  carrier_title: 'UPS',
                  method_title: 'Ground',
                  amount: { value: 10.99, currency: 'USD' },
                },
              },
            ],
          },
        },
      },
    },
  },
  // Payment Step
  {
    request: {
      query: GET_AVAILABLE_PAYMENT_METHODS,
      variables: { cartId: mockCartId },
    },
    result: {
      data: {
        cart: {
          available_payment_methods: [
            { code: 'cc', title: 'Credit Card' },
            { code: 'checkmo', title: 'Check / Money Order' },
          ],
        },
      },
    },
  },
  {
    request: {
      query: GET_CART_TOTALS,
      variables: { cartId: mockCartId },
    },
    result: {
      data: {
        cart: {
          prices: {
            subtotal_excluding_tax: { value: 100.00, currency: 'USD' },
            applied_taxes: [{ amount: { value: 8.50, currency: 'USD' } }],
            grand_total: { value: 119.49, currency: 'USD' },
          },
          shipping_addresses: [
            {
              selected_shipping_method: {
                amount: { value: 10.99, currency: 'USD' },
              },
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: SET_PAYMENT_METHOD,
      variables: {
        cartId: mockCartId,
        code: 'cc',
      },
    },
    result: {
      data: {
        setPaymentMethodOnCart: {
          cart: {
            id: mockCartId,
            selected_payment_method: {
              code: 'cc',
              title: 'Credit Card',
            },
          },
        },
      },
    },
  },
  // Place Order
  {
    request: {
      query: PLACE_ORDER,
      variables: {
        cartId: mockCartId,
      },
    },
    result: {
      data: {
        placeOrder: {
          order: {
            order_number: mockOrderNumber,
          },
        },
      },
    },
  },
];

describe('GuestCheckoutPage Integration', () => {
  const renderCheckoutPage = () => {
    return render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={[`/checkout/${mockCartId}`]}>
          <Routes>
            <Route
              path="/checkout/:cartId"
              element={
                <GuestCheckoutProvider cartId={mockCartId}>
                  <GuestCheckoutPage />
                </GuestCheckoutProvider>
              }
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );
  };

  it('completes the entire checkout flow successfully', async () => {
    renderCheckoutPage();

    // Email Step
    expect(screen.getByText('Guest Checkout')).toBeInTheDocument();
    const emailInput = screen.getByLabelText('Email address');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue to Shipping' }));

    // Wait for shipping step to load
    await waitFor(() => {
      expect(screen.getByText('Shipping Information')).toBeInTheDocument();
    });

    // Fill shipping form
    fireEvent.change(screen.getByLabelText('First name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText('Last name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText('Street address'), {
      target: { value: '123 Main St' },
    });
    fireEvent.change(screen.getByLabelText('City'), {
      target: { value: 'Anytown' },
    });
    fireEvent.change(screen.getByLabelText('State / Province'), {
      target: { value: 'CA' },
    });
    fireEvent.change(screen.getByLabelText('ZIP / Postal code'), {
      target: { value: '12345' },
    });
    fireEvent.change(screen.getByLabelText('Phone number'), {
      target: { value: '123-456-7890' },
    });

    // Select shipping method
    const shippingMethodRadio = screen.getByLabelText('UPS - Ground');
    fireEvent.click(shippingMethodRadio);

    // Continue to payment
    fireEvent.click(screen.getByRole('button', { name: 'Continue to Payment' }));

    // Wait for payment step to load
    await waitFor(() => {
      expect(screen.getByText('Payment Method')).toBeInTheDocument();
    });

    // Select payment method
    const ccRadio = screen.getByLabelText('Credit Card');
    fireEvent.click(ccRadio);

    // Fill credit card details
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

    // Continue to review
    fireEvent.click(screen.getByRole('button', { name: 'Review Order' }));

    // Wait for review step to load
    await waitFor(() => {
      expect(screen.getByText('Review Your Order')).toBeInTheDocument();
    });

    // Place order
    fireEvent.click(screen.getByRole('button', { name: 'Place Order' }));

    // Verify order success
    await waitFor(() => {
      expect(screen.getByText(`Order #${mockOrderNumber}`)).toBeInTheDocument();
    });
  });

  it('handles validation errors appropriately', async () => {
    renderCheckoutPage();

    // Try to continue without email
    fireEvent.click(screen.getByRole('button', { name: 'Continue to Shipping' }));
    expect(screen.getByLabelText('Email address')).toBeInvalid();

    // Fill email and continue
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue to Shipping' }));

    // Wait for shipping step
    await waitFor(() => {
      expect(screen.getByText('Shipping Information')).toBeInTheDocument();
    });

    // Try to continue without shipping info
    fireEvent.click(screen.getByRole('button', { name: 'Continue to Payment' }));
    expect(screen.getByLabelText('First name')).toBeInvalid();
    expect(screen.getByLabelText('Last name')).toBeInvalid();
    expect(screen.getByLabelText('Street address')).toBeInvalid();
  });

  it('maintains state between steps', async () => {
    renderCheckoutPage();

    // Fill email
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue to Shipping' }));

    // Wait for shipping step and go back
    await waitFor(() => {
      expect(screen.getByText('Shipping Information')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Back to Cart'));

    // Verify email is preserved
    expect(screen.getByLabelText('Email address')).toHaveValue('test@example.com');
  });

  it('displays appropriate error messages for failed API calls', async () => {
    const errorMock = {
      request: {
        query: SET_GUEST_EMAIL,
        variables: {
          cartId: mockCartId,
          email: 'error@example.com',
        },
      },
      error: new Error('Failed to save email'),
    };

    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <MemoryRouter initialEntries={[`/checkout/${mockCartId}`]}>
          <Routes>
            <Route
              path="/checkout/:cartId"
              element={
                <GuestCheckoutProvider cartId={mockCartId}>
                  <GuestCheckoutPage />
                </GuestCheckoutProvider>
              }
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'error@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue to Shipping' }));

    await waitFor(() => {
      expect(screen.getByText('Failed to save email')).toBeInTheDocument();
    });
  });
});
