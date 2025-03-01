# Deployment Guide

## Prerequisites

### Environment Requirements
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- Docker (optional)

### Required Environment Variables
```env
# API Configuration
VITE_API_URL=https://api.example.com
VITE_GRAPHQL_ENDPOINT=/graphql

# Authentication
VITE_AUTH_DOMAIN=auth.example.com
VITE_AUTH_CLIENT_ID=your_client_id
VITE_AUTH_AUDIENCE=your_audience

# Payment Processing
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key

# Analytics
VITE_GA_TRACKING_ID=UA-XXXXX-Y

# Feature Flags
VITE_ENABLE_REVIEWS=true
VITE_ENABLE_WISHLIST=true
```

## Build Process

### Development Build
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Production Build
```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Docker Build
```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Deployment Procedures

### 1. Pre-deployment Checklist
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Build successful locally
- [ ] Performance audit completed
- [ ] Security scan completed
- [ ] Documentation updated

### 2. Deployment Steps

#### Manual Deployment
```bash
# 1. Pull latest changes
git pull origin main

# 2. Install dependencies
npm install

# 3. Build application
npm run build

# 4. Run tests
npm run test

# 5. Deploy to server
npm run deploy
```

#### Automated Deployment (CI/CD)
```yaml
# GitHub Actions workflow
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
      - name: Deploy
        run: npm run deploy
```

## Monitoring & Maintenance

### 1. Performance Monitoring
- Set up error tracking (e.g., Sentry)
- Configure performance monitoring
- Set up uptime monitoring
- Configure log aggregation
- Set up alerts

### 2. Health Checks
```typescript
// Health check endpoint
interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    database: boolean;
    cache: boolean;
    api: boolean;
    payment: boolean;
  };
  timestamp: string;
}
```

### 3. Backup Procedures
- Database backups
- File storage backups
- Configuration backups
- Disaster recovery plan
- Backup testing schedule

## Security Considerations

### 1. SSL Configuration
```nginx
# Nginx SSL configuration
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/nginx/ssl/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/live/example.com/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

### 2. Security Headers
```typescript
// Security middleware
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};
```

## Rollback Procedures

### 1. Version Control
- Keep track of all deployments
- Maintain deployment history
- Document configuration changes
- Store environment snapshots

### 2. Rollback Steps
```bash
# 1. Identify last stable version
git tag -l --sort=-v:refname

# 2. Checkout stable version
git checkout v1.2.3

# 3. Rebuild application
npm install
npm run build

# 4. Deploy stable version
npm run deploy
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version
   - Clear npm cache
   - Check for dependency conflicts
   - Verify environment variables

2. **Runtime Errors**
   - Check API endpoints
   - Verify environment variables
   - Check browser console
   - Review server logs

3. **Performance Issues**
   - Run Lighthouse audit
   - Check bundle size
   - Monitor API response times
   - Review resource usage

### Debug Tools
```typescript
// Debug logging utility
const debug = (namespace: string) => {
  return (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${namespace}]`, ...args);
    }
  };
};
```

## Maintenance Schedule

### Regular Maintenance
- Daily health checks
- Weekly dependency updates
- Monthly security audits
- Quarterly performance reviews

### Update Procedures
1. Test updates in staging
2. Schedule maintenance window
3. Create backup
4. Apply updates
5. Verify functionality
6. Monitor for issues
