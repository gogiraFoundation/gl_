#!/bin/bash

# Backend Startup Script (Local Development)
# This script starts only the Django backend with PostgreSQL

set -e

echo "🚀 Starting Django Backend..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

cd gogir-labs-be

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}⚠️  Virtual environment not found. Creating one...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
echo -e "${BLUE}📦 Activating virtual environment...${NC}"
source venv/bin/activate

# Install dependencies
echo -e "${BLUE}📥 Installing dependencies...${NC}"
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ Created .env file${NC}"
        echo -e "${YELLOW}⚠️  Please update .env file with your database credentials${NC}"
    else
        echo -e "${YELLOW}⚠️  .env.example not found. Please create .env manually.${NC}"
    fi
fi

# Check if PostgreSQL is running (if using local PostgreSQL)
if command -v pg_isready &> /dev/null; then
    DB_HOST=$(grep DB_HOST .env | cut -d '=' -f2 | tr -d ' ' || echo "localhost")
    if [ "$DB_HOST" = "localhost" ] || [ "$DB_HOST" = "127.0.0.1" ]; then
        if ! pg_isready -h localhost -p 5432 &> /dev/null; then
            echo -e "${YELLOW}⚠️  PostgreSQL is not running on localhost:5432${NC}"
            echo -e "${YELLOW}⚠️  Please start PostgreSQL or use Docker Compose for the database${NC}"
        fi
    fi
fi

# Run migrations
echo -e "${BLUE}🔄 Running database migrations...${NC}"
python manage.py migrate

# Collect static files
echo -e "${BLUE}📁 Collecting static files...${NC}"
python manage.py collectstatic --noinput || echo -e "${YELLOW}⚠️  Static files collection skipped${NC}"

# Start development server
echo ""
echo -e "${GREEN}✅ Starting Django development server...${NC}"
echo -e "${BLUE}📍 Backend API: http://localhost:8000/api/v1${NC}"
echo -e "${BLUE}📍 Admin Panel: http://localhost:8000/admin${NC}"
echo -e "${BLUE}📍 API Docs: http://localhost:8000/api/docs${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""

python manage.py runserver

