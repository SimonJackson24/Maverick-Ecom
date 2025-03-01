#!/bin/bash

# Install certbot
apt-get update
apt-get install -y certbot python3-certbot-nginx

# Generate SSL certificate
certbot --nginx \
  -d wickandwax.co \
  -d www.wickandwax.co \
  --non-interactive \
  --agree-tos \
  --email admin@wickandwax.co \
  --redirect \
  --staple-ocsp \
  --must-staple

# Set up auto-renewal
echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew -q" | sudo tee -a /etc/crontab > /dev/null
