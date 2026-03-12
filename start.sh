#!/bin/bash

# Professional Portfolio Website Startup Script
# This script starts the entire application stack

set -e

echo "🚀 Starting Professional Portfolio Website..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Check if .env files exist
if [ ! -f "gogir-labs-be/.env" ]; then
    echo -e "${YELLOW}⚠️  Backend .env file not found. Creating from .env.example...${NC}"
    if [ -f "gogir-labs-be/.env.example" ]; then
        cp gogir-labs-be/.env.example gogir-labs-be/.env
        echo -e "${GREEN}✅ Created gogir-labs-be/.env${NC}"
    else
        echo -e "${YELLOW}⚠️  .env.example not found. Please create gogir-labs-be/.env manually.${NC}"
    fi
fi

if [ ! -f "gogir-labs-fe/.env" ]; then
    echo -e "${YELLOW}⚠️  Frontend .env file not found. Creating from .env.example...${NC}"
    if [ -f "gogir-labs-fe/.env.example" ]; then
        cp gogir-labs-fe/.env.example gogir-labs-fe/.env
        echo -e "${GREEN}✅ Created gogir-labs-fe/.env${NC}"
    else
        echo -e "${YELLOW}⚠️  .env.example not found. Please create gogir-labs-fe/.env manually.${NC}"
    fi
fi

# Build and start containers
echo -e "${BLUE}📦 Building Docker images...${NC}"
docker-compose build

echo -e "${BLUE}🚀 Starting services...${NC}"
docker-compose up -d

# Wait for database to be ready
echo -e "${BLUE}⏳ Waiting for PostgreSQL database to be ready...${NC}"
sleep 5

# Run migrations
echo -e "${BLUE}🔄 Running database migrations...${NC}"
docker-compose exec -T backend python manage.py migrate || echo -e "${YELLOW}⚠️  Migrations may have already been run${NC}"

# Collect static files
echo -e "${BLUE}📁 Collecting static files...${NC}"
docker-compose exec -T backend python manage.py collectstatic --noinput || echo -e "${YELLOW}⚠️  Static files collection skipped${NC}"

# Check if superuser exists, if not, prompt to create one
echo -e "${BLUE}👤 Checking for superuser...${NC}"
SUPERUSER_EXISTS=$(docker-compose exec -T backend python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); print('True' if User.objects.filter(is_superuser=True).exists() else 'False')" 2>/dev/null || echo "False")

if [ "$SUPERUSER_EXISTS" != "True" ]; then
    echo -e "${YELLOW}⚠️  No superuser found.${NC}"
    echo -e "${BLUE}Would you like to create a superuser now? (y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        docker-compose exec backend python manage.py createsuperuser
    else
        echo -e "${YELLOW}You can create a superuser later by running:${NC}"
        echo -e "${BLUE}docker-compose exec backend python manage.py createsuperuser${NC}"
    fi
fi

echo ""
echo -e "${GREEN}✅ Application started successfully!${NC}"
echo ""
echo -e "${BLUE}📍 Access the application at:${NC}"
echo -e "   Frontend:  ${GREEN}http://localhost:3000${NC}"
echo -e "   Backend:   ${GREEN}http://localhost:8000/api/v1${NC}"
echo -e "   Admin:     ${GREEN}http://localhost:8000/admin${NC}"
echo -e "   API Docs:  ${GREEN}http://localhost:8000/api/docs${NC}"
echo ""
echo -e "${BLUE}📊 View logs:${NC}"
echo -e "   docker-compose logs -f"
echo ""
echo -e "${BLUE}🛑 Stop the application:${NC}"
echo -e "   docker-compose down"
echo ""

