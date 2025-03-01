# Wick & Wax Co - Deployment Guide

## Prerequisites

- Node.js 18.x or higher
- PostgreSQL 16.x
- PM2 (for production process management)
- Nginx (for reverse proxy)
- SSL certificate

## Environment Setup

1. Create production environment file:
```bash
cp .env.example .env
```

2. Update the following variables in `.env`:
- `NODE_ENV=production`
- `POSTGRES_*` (database credentials)
- `JWT_SECRET` (use a strong random string)
- `SESSION_SECRET` (use a strong random string)
- `REVOLUT_API_KEY`
- `CORS_ORIGIN`
- `ADMIN_ALLOWED_IPS`

## Database Setup

1. Create PostgreSQL database:
```bash
createdb wickandwax
```

2. Run migrations:
```bash
npm run migrate
```

3. Seed initial data:
```bash
npm run seed
```

## Application Deployment

1. Install dependencies:
```bash
npm ci
```

2. Build the application:
```bash
npm run build
```

3. Start the application with PM2:
```bash
pm2 start ecosystem.config.js
```

## Nginx Configuration

1. Create Nginx configuration:
```nginx
server {
    listen 443 ssl;
    server_name api.wickandwax.co;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

2. Test and reload Nginx:
```bash
nginx -t
systemctl reload nginx
```

## Monitoring Setup

1. Start Prometheus:
```bash
docker run -d \
  -p 9090:9090 \
  -v /path/to/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus
```

2. Start Grafana:
```bash
docker run -d \
  -p 3000:3000 \
  grafana/grafana
```

## Backup Procedures

1. Database backup (daily):
```bash
pg_dump wickandwax > backup_$(date +%Y%m%d).sql
```

2. Application backup:
```bash
tar -czf backup_$(date +%Y%m%d).tar.gz /path/to/app
```

## Rollback Procedures

1. Database rollback:
```bash
npm run migrate:undo
```

2. Application rollback:
```bash
pm2 delete wickandwax
git checkout <previous-version>
npm ci
npm run build
pm2 start ecosystem.config.js
```

## Health Checks

Monitor the following endpoints:
- `/health` - Application health
- `/metrics` - Prometheus metrics
- `/api-docs` - API documentation

## Security Measures

1. Enable rate limiting
2. Set up firewall rules
3. Configure SSL/TLS
4. Implement IP whitelisting for admin routes
5. Regular security audits
6. Automated vulnerability scanning

## Performance Optimization

1. Enable Nginx caching
2. Configure PostgreSQL connection pooling
3. Implement Redis caching (optional)
4. Set up CDN for static assets

## Troubleshooting

Common issues and solutions:
1. Database connection issues:
   - Check PostgreSQL service status
   - Verify connection credentials
   - Check network connectivity

2. Application startup failures:
   - Check PM2 logs: `pm2 logs`
   - Verify environment variables
   - Check disk space

3. Performance issues:
   - Monitor CPU/Memory usage
   - Check database query performance
   - Review application logs

## Contact

For deployment support:
- Email: devops@wickandwax.co
- Emergency: +1-XXX-XXX-XXXX
