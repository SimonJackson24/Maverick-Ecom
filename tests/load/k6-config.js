import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  scenarios: {
    // Smoke test
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '1m',
      tags: { test_type: 'smoke' },
    },
    
    // Load test
    load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5m', target: 100 }, // Ramp up
        { duration: '10m', target: 100 }, // Stay at peak
        { duration: '5m', target: 0 }, // Ramp down
      ],
      tags: { test_type: 'load' },
    },
    
    // Stress test
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '3m', target: 100 }, // Below normal load
        { duration: '5m', target: 200 }, // Normal load
        { duration: '5m', target: 300 }, // Around breaking point
        { duration: '5m', target: 400 }, // Beyond breaking point
        { duration: '3m', target: 0 }, // Recovery
      ],
      tags: { test_type: 'stress' },
    },
    
    // Spike test
    spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 50 }, // Below normal load
        { duration: '1m', target: 500 }, // Spike
        { duration: '2m', target: 50 }, // Scale down
      ],
      tags: { test_type: 'spike' },
    },
    
    // Soak test
    soak: {
      executor: 'constant-vus',
      vus: 50,
      duration: '2h',
      tags: { test_type: 'soak' },
    },
  },
  
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'], // Less than 1% of requests should fail
    errors: ['rate<0.05'], // Less than 5% error rate
  },
};

// Simulated user behavior
export default function() {
  const BASE_URL = 'https://wickandwax.co';
  
  // Homepage
  const homeResponse = http.get(BASE_URL);
  check(homeResponse, {
    'homepage status is 200': (r) => r.status === 200,
  }) || errorRate.add(1);
  sleep(1);

  // Product listing
  const shopResponse = http.get(`${BASE_URL}/shop`);
  check(shopResponse, {
    'shop page status is 200': (r) => r.status === 200,
  }) || errorRate.add(1);
  sleep(2);

  // Product detail
  const productResponse = http.get(`${BASE_URL}/products/sample-product`);
  check(productResponse, {
    'product page status is 200': (r) => r.status === 200,
  }) || errorRate.add(1);
  sleep(3);

  // Add to cart
  const cartResponse = http.post(`${BASE_URL}/api/cart/add`, {
    productId: 'sample-product',
    quantity: 1,
  });
  check(cartResponse, {
    'add to cart successful': (r) => r.status === 200,
  }) || errorRate.add(1);
  sleep(1);

  // View cart
  const viewCartResponse = http.get(`${BASE_URL}/cart`);
  check(viewCartResponse, {
    'view cart successful': (r) => r.status === 200,
  }) || errorRate.add(1);
  sleep(2);

  // Search products
  const searchResponse = http.get(`${BASE_URL}/api/search?q=candle`);
  check(searchResponse, {
    'search successful': (r) => r.status === 200,
  }) || errorRate.add(1);
  sleep(1);
}

// Helper functions for data generation
function randomProduct() {
  const products = [
    'lavender-candle',
    'vanilla-candle',
    'citrus-candle',
    'ocean-breeze-candle',
  ];
  return products[Math.floor(Math.random() * products.length)];
}

function randomQuantity() {
  return Math.floor(Math.random() * 3) + 1;
}

function randomSearchTerm() {
  const terms = ['candle', 'scent', 'fragrance', 'wax', 'wick'];
  return terms[Math.floor(Math.random() * terms.length)];
}

// Custom setup and teardown
export function setup() {
  // Perform setup tasks (e.g., data preparation)
  return {
    products: [
      { id: 'lavender-candle', name: 'Lavender Candle' },
      { id: 'vanilla-candle', name: 'Vanilla Candle' },
      { id: 'citrus-candle', name: 'Citrus Candle' },
      { id: 'ocean-breeze-candle', name: 'Ocean Breeze Candle' },
    ],
  };
}

export function teardown(data) {
  // Cleanup after tests
  console.log('Test completed with data:', JSON.stringify(data));
}
