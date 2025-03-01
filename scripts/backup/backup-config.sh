#!/bin/bash

# Configuration
BACKUP_DIR="/var/backups/wickandwax"
S3_BUCKET="wickandwax-backups"
RETENTION_DAYS=30
DB_NAME="wickandwax_prod"
DB_USER="app_user"

# Create backup directories
mkdir -p "$BACKUP_DIR"/{database,media,logs}

# Database backup function
backup_database() {
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/database/db_backup_$TIMESTAMP.sql.gz"
    
    # Backup database
    pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_FILE"
    
    # Upload to S3
    aws s3 cp "$BACKUP_FILE" "s3://$S3_BUCKET/database/"
}

# Media backup function
backup_media() {
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/media/media_backup_$TIMESTAMP.tar.gz"
    
    # Backup media files
    tar -czf "$BACKUP_FILE" /var/www/wickandwax/media
    
    # Upload to S3
    aws s3 cp "$BACKUP_FILE" "s3://$S3_BUCKET/media/"
}

# Log backup function
backup_logs() {
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/logs/logs_backup_$TIMESTAMP.tar.gz"
    
    # Backup logs
    tar -czf "$BACKUP_FILE" /var/log/wickandwax
    
    # Upload to S3
    aws s3 cp "$BACKUP_FILE" "s3://$S3_BUCKET/logs/"
}

# Cleanup old backups
cleanup_old_backups() {
    # Local cleanup
    find "$BACKUP_DIR" -type f -mtime +$RETENTION_DAYS -delete
    
    # S3 cleanup
    aws s3 ls "s3://$S3_BUCKET" --recursive | while read -r line; do
        createDate=$(echo "$line" | awk {'print $1" "$2'})
        createDate=$(date -d "$createDate" +%s)
        olderThan=$(date -d "-$RETENTION_DAYS days" +%s)
        if [[ $createDate -lt $olderThan ]]; then
            fileName=$(echo "$line" | awk {'print $4'})
            aws s3 rm "s3://$S3_BUCKET/$fileName"
        fi
    done
}

# Verify backup integrity
verify_backup() {
    local BACKUP_FILE=$1
    local BACKUP_TYPE=$2
    
    case $BACKUP_TYPE in
        "database")
            gunzip -t "$BACKUP_FILE"
            ;;
        "media"|"logs")
            tar -tzf "$BACKUP_FILE" > /dev/null
            ;;
    esac
    
    if [ $? -eq 0 ]; then
        echo "Backup verification successful: $BACKUP_FILE"
        return 0
    else
        echo "Backup verification failed: $BACKUP_FILE"
        return 1
    fi
}

# Main backup script
main() {
    echo "Starting backup process at $(date)"
    
    # Database backup
    backup_database
    
    # Media backup (daily at midnight)
    if [ $(date +%H) -eq 0 ]; then
        backup_media
    fi
    
    # Log backup (daily at midnight)
    if [ $(date +%H) -eq 0 ]; then
        backup_logs
    fi
    
    # Cleanup old backups (weekly on Sunday)
    if [ $(date +%u) -eq 7 ]; then
        cleanup_old_backups
    fi
    
    echo "Backup process completed at $(date)"
}

# Set up cron jobs
setup_cron() {
    # Database backup every 6 hours
    echo "0 */6 * * * /scripts/backup/backup-config.sh database" >> /etc/crontab
    
    # Media backup daily at midnight
    echo "0 0 * * * /scripts/backup/backup-config.sh media" >> /etc/crontab
    
    # Log backup daily at midnight
    echo "0 0 * * * /scripts/backup/backup-config.sh logs" >> /etc/crontab
    
    # Cleanup weekly on Sunday at 1 AM
    echo "0 1 * * 0 /scripts/backup/backup-config.sh cleanup" >> /etc/crontab
}

# Parse command line arguments
case "$1" in
    "database")
        backup_database
        ;;
    "media")
        backup_media
        ;;
    "logs")
        backup_logs
        ;;
    "cleanup")
        cleanup_old_backups
        ;;
    "setup")
        setup_cron
        ;;
    *)
        main
        ;;
esac
