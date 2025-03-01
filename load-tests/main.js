import http from 'k6/http';
import { check, sleep } from 'k6';
import { config } from './config.js';
import { browsingFlow } from './scenarios/browsing.js';
import { checkoutFlow } from './scenarios/checkout.js';

export const options = {
  stages: config.stages,
  thresholds: config.thresholds,
  scenarios: config.scenarios,
};

// Initialize custom metrics
const customMetrics = {
  homepage_load: new Trend('homepage_load'),
  product_load: new Trend('product_load'),
  cart_operation: new Trend('cart_operation'),
  checkout_step: new Trend('checkout_step'),
};

// Setup function runs once per VU
export function setup() {
  const response = http.get(`${config.baseUrl}/api/health`);
  check(response, {
    'health check passed': (r) => r.status === 200,
  });
}

// Teardown runs at the end of the test
export function teardown() {
  // Clean up any test data if needed
}

// Main function runs for each VU
export default function () {
  const scenario = Math.random() < 0.7 ? 'browsing' : 'checkout';
  
  if (scenario === 'browsing') {
    browsingFlow(config.baseUrl, customMetrics);
  } else {
    checkoutFlow(config.baseUrl, customMetrics);
  }
  
  sleep(Math.random() * 3 + 2); // Random sleep between 2-5 seconds
}
