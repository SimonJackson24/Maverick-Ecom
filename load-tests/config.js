export const config = {
  baseUrl: __ENV.BASE_URL || 'http://localhost:3000',
  stages: [
    { duration: '1m', target: 50 },   // Ramp up to 50 users over 1 minute
    { duration: '3m', target: 50 },   // Stay at 50 users for 3 minutes
    { duration: '1m', target: 100 },  // Ramp up to 100 users over 1 minute
    { duration: '3m', target: 100 },  // Stay at 100 users for 3 minutes
    { duration: '1m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% of requests should fail
  },
  scenarios: {
    browsing: {
      exec: 'browsingFlow',
      weight: 70,
    },
    checkout: {
      exec: 'checkoutFlow',
      weight: 30,
    },
  },
};
