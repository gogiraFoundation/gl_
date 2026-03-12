#!/bin/bash

# Frontend Startup Script (Local Development)
# This script starts only the Next.js frontend

set -e

echo "🚀 Starting Next.js Frontend..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

cd gogir-labs-fe

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📥 Installing dependencies...${NC}"
    npm install
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ Created .env file${NC}"
    else
        echo -e "${YELLOW}⚠️  .env.example not found. Please create .env manually.${NC}"
    fi
fi

# Start development server
echo ""
echo -e "${GREEN}✅ Starting Next.js development server...${NC}"
echo -e "${BLUE}📍 Frontend: http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""

npm run dev

