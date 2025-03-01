import http from 'k6/http';
import { check, sleep } from 'k6';
import { options } from './k6-config.js';

// Simulate user browsing behavior
export function shopping() {
  // Home page
  let response = http.get('http://localhost:3000/');
  check(response, {
    'homepage_status': r => r.status === 200,
    'homepage_load': r => r.timings.duration < 2000,
  });
  sleep(Math.random() * 3 + 2); // Random sleep 2-5 seconds

  // Product listing
  response = http.get('http://localhost:3000/products');
  check(response, {
    'products_status': r => r.status === 200,
    'products_load': r => r.timings.duration < 2000,
  });
  sleep(Math.random() * 3 + 1);

  // Product detail
  response = http.get('http://localhost:3000/products/1');
  check(response, {
    'product_detail_status': r => r.status === 200,
    'product_detail_load': r => r.timings.duration < 2000,
  });
  sleep(Math.random() * 3 + 2);

  // Add to cart
  response = http.post('http://localhost:3000/api/cart/add', {
    productId: 1,
    quantity: 1
  });
  check(response, {
    'add_to_cart_status': r => r.status === 200,
    'add_to_cart_load': r => r.timings.duration < 1000,
  });
  sleep(Math.random() * 2 + 1);

  // View cart
  response = http.get('http://localhost:3000/cart');
  check(response, {
    'cart_status': r => r.status === 200,
    'cart_load': r => r.timings.duration < 1500,
  });
}

// Simulate admin user behavior
export function admin() {
  // Login
  let response = http.post('http://localhost:3000/admin/login', {
    email: 'test@example.com',
    password: 'password123'
  });
  check(response, {
    'login_status': r => r.status === 200,
    'login_load': r => r.timings.duration < 1000,
  });
  sleep(1);

  // Dashboard
  response = http.get('http://localhost:3000/admin/dashboard');
  check(response, {
    'dashboard_status': r => r.status === 200,
    'dashboard_load': r => r.timings.duration < 2000,
  });
  sleep(Math.random() * 3 + 2);

  // Orders list
  response = http.get('http://localhost:3000/admin/orders');
  check(response, {
    'orders_status': r => r.status === 200,
    'orders_load': r => r.timings.duration < 2000,
  });
  sleep(Math.random() * 2 + 1);

  // Products list
  response = http.get('http://localhost:3000/admin/products');
  check(response, {
    'products_status': r => r.status === 200,
    'products_load': r => r.timings.duration < 2000,
  });
}

export default function() {
  if (Math.random() < 0.8) { // 80% of traffic is shopping
    shopping();
  } else { // 20% of traffic is admin
    admin();
  }
}
