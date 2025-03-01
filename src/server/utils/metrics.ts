import client from 'prom-client';

// Create a Registry to register metrics
const register = new client.Registry();

// Add default metrics (CPU, memory usage, etc.)
client.collectDefaultMetrics({ register });

// HTTP request duration metric
export const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});
register.registerMetric(httpRequestDurationMicroseconds);

// Database query duration metric
export const dbQueryDurationMicroseconds = new client.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.1, 0.5, 1, 2, 5],
});
register.registerMetric(dbQueryDurationMicroseconds);

// Active users gauge
export const activeUsers = new client.Gauge({
  name: 'active_users',
  help: 'Number of active users',
});
register.registerMetric(activeUsers);

// Order metrics
export const orderCounter = new client.Counter({
  name: 'orders_total',
  help: 'Total number of orders',
  labelNames: ['status'],
});
register.registerMetric(orderCounter);

// Payment metrics
export const paymentCounter = new client.Counter({
  name: 'payments_total',
  help: 'Total number of payments',
  labelNames: ['status', 'provider'],
});
register.registerMetric(paymentCounter);

// Stock level gauge
export const stockLevel = new client.Gauge({
  name: 'product_stock_level',
  help: 'Current stock level of products',
  labelNames: ['product_id'],
});
register.registerMetric(stockLevel);

export { register };
