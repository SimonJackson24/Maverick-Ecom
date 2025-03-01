#!/bin/bash

# Exit on error
set -e

# Load environment variables
source ./config/production.env

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%dT%H:%M:%S%z')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%dT%H:%M:%S%z')] ERROR: $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%dT%H:%M:%S%z')] WARNING: $1${NC}"
}

# Check required environment variables
check_env_vars() {
    log "Checking environment variables..."
    required_vars=(
        "API_URL"
        "DB_HOST"
        "REDIS_HOST"
        "SESSION_SECRET"
        "SSL_KEY_PATH"
        "SSL_CERT_PATH"
        "SENTRY_DSN"
        "S3_BUCKET"
    )

    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            error "$var is not set"
            exit 1
        fi
    done
}

# Backup database
backup_database() {
    if [ "$BACKUP_ENABLED" = true ]; then
        log "Creating database backup..."
        timestamp=$(date +%Y%m%d_%H%M%S)
        backup_file="backup_${timestamp}.sql"
        
        pg_dump -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" > "$backup_file"
        
        # Upload to S3
        aws s3 cp "$backup_file" "s3://$BACKUP_S3_BUCKET/database/$backup_file"
        rm "$backup_file"
        
        # Clean up old backups
        aws s3 ls "s3://$BACKUP_S3_BUCKET/database/" | \
        while read -r line; do
            createDate=$(echo "$line" | awk {'print $1" "$2'})
            createDate=$(date -d "$createDate" +%s)
            olderThan=$(date -d "-$BACKUP_RETENTION_DAYS days" +%s)
            if [[ $createDate -lt $olderThan ]]; then
                fileName=$(echo "$line" | awk {'print $4'})
                aws s3 rm "s3://$BACKUP_S3_BUCKET/database/$fileName"
            fi
        done
    else
        warn "Database backup is disabled"
    fi
}

# Build application
build_app() {
    log "Building application..."
    
    # Install dependencies
    npm ci
    
    # Run tests
    npm run test
    
    # Build production assets
    npm run build
    
    # Run security audit
    npm audit
}

# Deploy application
deploy_app() {
    log "Deploying application..."
    
    # Invalidate CDN cache
    aws cloudfront create-invalidation \
        --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
        --paths "/*"
    
    # Upload build to S3
    aws s3 sync ./build "s3://$S3_BUCKET" \
        --delete \
        --cache-control "max-age=$CACHE_CONTROL_MAX_AGE"
}

# Health check
health_check() {
    log "Running health checks..."
    
    # Check API health
    response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health")
    if [ "$response" != "200" ]; then
        error "API health check failed"
        exit 1
    fi
    
    # Check Redis connection
    redis-cli -h "$REDIS_HOST" ping > /dev/null
    if [ $? -ne 0 ]; then
        error "Redis health check failed"
        exit 1
    fi
    
    # Check database connection
    pg_isready -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME"
    if [ $? -ne 0 ]; then
        error "Database health check failed"
        exit 1
    }
}

# Monitor deployment
monitor_deployment() {
    log "Monitoring deployment..."
    
    # Send deployment event to monitoring services
    if [ -n "$DATADOG_API_KEY" ]; then
        curl -X POST "https://api.datadoghq.com/api/v1/events" \
            -H "Content-Type: application/json" \
            -H "DD-API-KEY: ${DATADOG_API_KEY}" \
            -d @- << EOF
{
    "title": "Deployment Completed",
    "text": "Successfully deployed version ${npm_package_version}",
    "priority": "normal",
    "tags": ["env:production", "service:web"]
}
EOF
    fi
    
    # Send deployment notification
    if [ -n "$ERROR_NOTIFICATION_EMAIL" ]; then
        echo "Deployment completed successfully" | \
        mail -s "Deployment Notification" "$ERROR_NOTIFICATION_EMAIL"
    fi
}

# Main deployment process
main() {
    log "Starting deployment process..."
    
    # Check environment variables
    check_env_vars
    
    # Create backup
    backup_database
    
    # Build application
    build_app
    
    # Deploy application
    deploy_app
    
    # Run health checks
    health_check
    
    # Monitor deployment
    monitor_deployment
    
    log "Deployment completed successfully!"
}

# Run main function
main
