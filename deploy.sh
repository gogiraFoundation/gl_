#!/bin/bash

# Production Deployment Script
# This script handles deployment to production servers

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ENVIRONMENT=${1:-production}
COMPOSE_FILE="docker-compose.prod.yml"

if [ "$ENVIRONMENT" = "staging" ]; then
    COMPOSE_FILE="docker-compose.staging.yml"
fi

echo -e "${YELLOW}=========================================="
echo "Deploying to $ENVIRONMENT"
echo "==========================================${NC}"

# Check if .env file exists
if [ ! -f ".env.$ENVIRONMENT" ]; then
    echo -e "${RED}Error: .env.$ENVIRONMENT file not found${NC}"
    exit 1
fi

# Load environment variables
export $(cat .env.$ENVIRONMENT | grep -v '^#' | xargs)

# Pull latest images
echo -e "${YELLOW}Pulling latest images...${NC}"
docker-compose -f $COMPOSE_FILE pull

# Stop existing containers
echo -e "${YELLOW}Stopping existing containers...${NC}"
docker-compose -f $COMPOSE_FILE down

# Start services
echo -e "${YELLOW}Starting services...${NC}"
docker-compose -f $COMPOSE_FILE up -d

# Wait for services to be healthy
echo -e "${YELLOW}Waiting for services to be healthy...${NC}"
sleep 10

# Run migrations
echo -e "${YELLOW}Running database migrations...${NC}"
docker-compose -f $COMPOSE_FILE exec -T backend python manage.py migrate --noinput

# Collect static files
echo -e "${YELLOW}Collecting static files...${NC}"
docker-compose -f $COMPOSE_FILE exec -T backend python manage.py collectstatic --noinput

# Create superuser if needed (only in staging)
if [ "$ENVIRONMENT" = "staging" ]; then
    echo -e "${YELLOW}Checking for superuser...${NC}"
    docker-compose -f $COMPOSE_FILE exec -T backend python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(is_superuser=True).exists():
    print("Creating superuser...")
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print("Superuser created: admin/admin123")
else:
    print("Superuser already exists")
EOF
fi

# Health checks
echo -e "${YELLOW}Running health checks...${NC}"
sleep 5

# Check backend health
if curl -f http://localhost:8000/api/v1/ > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is healthy${NC}"
else
    echo -e "${RED}✗ Backend health check failed${NC}"
    exit 1
fi

# Check frontend health
if curl -f http://localhost:3000/ > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend is healthy${NC}"
else
    echo -e "${RED}✗ Frontend health check failed${NC}"
    exit 1
fi

echo -e "${GREEN}=========================================="
echo "Deployment to $ENVIRONMENT completed successfully!"
echo "==========================================${NC}"

# Show running containers
echo -e "${YELLOW}Running containers:${NC}"
docker-compose -f $COMPOSE_FILE ps

