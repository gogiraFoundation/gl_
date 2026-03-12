#!/bin/bash

# Database Restore Script
# Restores database from a backup file

set -e

if [ -z "$1" ]; then
    echo "Usage: ./restore.sh <backup_file.sql.gz> [environment]"
    exit 1
fi

BACKUP_FILE=$1
ENVIRONMENT=${2:-production}
COMPOSE_FILE="docker-compose.prod.yml"

if [ "$ENVIRONMENT" = "staging" ]; then
    COMPOSE_FILE="docker-compose.staging.yml"
fi

# Load environment variables
if [ -f ".env.$ENVIRONMENT" ]; then
    export $(cat .env.$ENVIRONMENT | grep -v '^#' | xargs)
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file $BACKUP_FILE not found"
    exit 1
fi

echo "WARNING: This will replace the current database!"
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

# Decompress if needed
if [[ $BACKUP_FILE == *.gz ]]; then
    echo "Decompressing backup..."
    gunzip -c $BACKUP_FILE > /tmp/restore.sql
    RESTORE_FILE=/tmp/restore.sql
else
    RESTORE_FILE=$BACKUP_FILE
fi

echo "Restoring database from $BACKUP_FILE..."

# Drop and recreate database
docker-compose -f $COMPOSE_FILE exec -T db psql -U ${DB_USER:-postgres} -c "DROP DATABASE IF EXISTS ${DB_NAME:-gogirlabs};"
docker-compose -f $COMPOSE_FILE exec -T db psql -U ${DB_USER:-postgres} -c "CREATE DATABASE ${DB_NAME:-gogirlabs};"

# Restore backup
docker-compose -f $COMPOSE_FILE exec -T db psql -U ${DB_USER:-postgres} ${DB_NAME:-gogirlabs} < $RESTORE_FILE

# Clean up
if [ "$RESTORE_FILE" = "/tmp/restore.sql" ]; then
    rm $RESTORE_FILE
fi

echo "Database restored successfully!"

