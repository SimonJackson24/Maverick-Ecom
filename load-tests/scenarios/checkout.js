import http from 'k6/http';
import { check, group } from 'k6';
import { randomItem } from '../utils.js';

export function checkoutFlow(baseUrl, metrics) {
  const cartToken = generateCartToken();

  group('Add to Cart', function () {
    const cartStart = new Date();
    const addToCartResponse = http.post(
      `${baseUrl}/api/cart/${cartToken}/items`,
      JSON.stringify({
        productId: '1',
        quantity: 1,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    metrics.cart_operation.add(new Date() - cartStart);

    check(addToCartResponse, {
      'add to cart status is 200': (r) => r.status === 200,
      'cart has item': (r) => {
        const data = JSON.parse(r.body);
        return data.items && data.items.length > 0;
      },
    });
  });

  group('View Cart', function () {
    const cartResponse = http.get(`${baseUrl}/api/cart/${cartToken}`);

    check(cartResponse, {
      'view cart status is 200': (r) => r.status === 200,
      'cart is accessible': (r) => {
        const data = JSON.parse(r.body);
        return data.items !== undefined;
      },
    });
  });

  group('Start Checkout - Customer Info', function () {
    const checkoutStart = new Date();
    const customerInfoResponse = http.post(
      `${baseUrl}/api/checkout/${cartToken}/customer`,
      JSON.stringify({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    metrics.checkout_step.add(new Date() - checkoutStart);

    check(customerInfoResponse, {
      'customer info status is 200': (r) => r.status === 200,
    });
  });

  group('Checkout - Shipping', function () {
    const shippingResponse = http.post(
      `${baseUrl}/api/checkout/${cartToken}/shipping`,
      JSON.stringify({
        address: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'US',
        },
        method: 'standard',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    check(shippingResponse, {
      'shipping status is 200': (r) => r.status === 200,
    });
  });

  group('Checkout - Payment', function () {
    // Simulate payment processing time
    const paymentResponse = http.post(
      `${baseUrl}/api/checkout/${cartToken}/payment`,
      JSON.stringify({
        paymentMethod: 'test_card',
        paymentToken: 'test_token',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    check(paymentResponse, {
      'payment status is 200': (r) => r.status === 200,
    });
  });

  group('Place Order', function () {
    const orderResponse = http.post(
      `${baseUrl}/api/checkout/${cartToken}/place-order`,
      {},
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    check(orderResponse, {
      'order status is 200': (r) => r.status === 200,
      'order is created': (r) => {
        const data = JSON.parse(r.body);
        return data.orderId !== undefined;
      },
    });
  });
}

function generateCartToken() {
  return `test-cart-${Math.random().toString(36).substring(7)}`;
}
