# API Documentation

## Overview
This document provides comprehensive documentation for the Wick and Wax Co API endpoints.

## Authentication
All API requests require authentication using JWT tokens. Tokens can be obtained through the `/auth/login` endpoint.

## Base URL
Production: `https://api.wickandwax.com/v1`
Staging: `https://api-staging.wickandwax.com/v1`

## Endpoints

### Products
- `GET /products` - List all products
- `GET /products/{id}` - Get product details
- `GET /products/recommendations` - Get product recommendations
- `GET /products/scent-based` - Get scent-based recommendations

### Orders
- `POST /orders` - Create new order
- `GET /orders/{id}` - Get order details
- `GET /orders/track/{tracking_number}` - Track order status

### Cart
- `GET /cart` - Get cart contents
- `POST /cart/items` - Add item to cart
- `DELETE /cart/items/{id}` - Remove item from cart
- `POST /cart/checkout` - Initialize checkout process

### Authentication
- `POST /auth/login` - Login
- `POST /auth/register` - Register new user
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/reset-password` - Reset password

### User
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `GET /user/orders` - Get user orders
- `GET /user/wishlist` - Get user wishlist

### Analytics
- `POST /analytics/event` - Track analytics event
- `GET /analytics/reports` - Get analytics reports

## Rate Limiting
API requests are limited to 1000 requests per hour per API key.

## Error Codes
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## Versioning
API versioning is handled through the URL path. Current version is v1.
