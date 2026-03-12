#!/bin/bash

# Comprehensive Test Runner Script
# Runs all backend and frontend tests

set -e  # Exit on error

echo "=========================================="
echo "Running Comprehensive Test Suite"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend Tests
echo -e "\n${YELLOW}Running Backend Tests...${NC}"
cd gogir-labs-be

if [ -f "pytest.ini" ]; then
    echo "Running pytest..."
    if pytest -v --tb=short; then
        echo -e "${GREEN}✓ Backend tests passed${NC}"
    else
        echo -e "${RED}✗ Backend tests failed${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}Warning: pytest.ini not found, skipping backend tests${NC}"
fi

cd ..

# Frontend Tests
echo -e "\n${YELLOW}Running Frontend Tests...${NC}"
cd gogir-labs-fe

if [ -f "package.json" ]; then
    echo "Installing dependencies (if needed)..."
    npm install --silent
    
    echo "Running Jest tests..."
    if npm test -- --passWithNoTests; then
        echo -e "${GREEN}✓ Frontend tests passed${NC}"
    else
        echo -e "${RED}✗ Frontend tests failed${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}Warning: package.json not found, skipping frontend tests${NC}"
fi

cd ..

echo -e "\n${GREEN}=========================================="
echo "All Tests Completed Successfully!"
echo "==========================================${NC}"

