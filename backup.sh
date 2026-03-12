#!/bin/bash

# Database Backup Script
# Creates timestamped backups of the database

set -e

ENVIRONMENT=${1:-production}
COMPOSE_FILE="docker-compose.prod.yml"

if [ "$ENVIRONMENT" = "staging" ]; then
    COMPOSE_FILE="docker-compose.staging.yml"
fi

# Load environment variables
if [ -f ".env.$ENVIRONMENT" ]; then
    export $(cat .env.$ENVIRONMENT | grep -v '^#' | xargs)
fi

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_${ENVIRONMENT}_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "Creating database backup for $ENVIRONMENT..."
docker-compose -f $COMPOSE_FILE exec -T db pg_dump -U ${DB_USER:-postgres} ${DB_NAME:-gogirlabs} > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE
BACKUP_FILE="${BACKUP_FILE}.gz"

echo "Backup created: $BACKUP_FILE"
echo "Backup size: $(du -h $BACKUP_FILE | cut -f1)"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_${ENVIRONMENT}_*.sql.gz" -mtime +7 -delete

echo "Backup completed successfully!"

