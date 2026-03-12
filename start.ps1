# Professional Portfolio Website Startup Script (PowerShell)
# This script starts the entire application stack

Write-Host "🚀 Starting Professional Portfolio Website..." -ForegroundColor Cyan

# Check if Docker is installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  Docker is not installed. Please install Docker first." -ForegroundColor Yellow
    exit 1
}

# Check if Docker Compose is installed
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  Docker Compose is not installed. Please install Docker Compose first." -ForegroundColor Yellow
    exit 1
}

# Check if .env files exist
if (-not (Test-Path "gogir-labs-be\.env")) {
    Write-Host "⚠️  Backend .env file not found. Creating from .env.example..." -ForegroundColor Yellow
    if (Test-Path "gogir-labs-be\.env.example") {
        Copy-Item "gogir-labs-be\.env.example" "gogir-labs-be\.env"
        Write-Host "✅ Created gogir-labs-be\.env" -ForegroundColor Green
    } else {
        Write-Host "⚠️  .env.example not found. Please create gogir-labs-be\.env manually." -ForegroundColor Yellow
    }
}

if (-not (Test-Path "gogir-labs-fe\.env")) {
    Write-Host "⚠️  Frontend .env file not found. Creating from .env.example..." -ForegroundColor Yellow
    if (Test-Path "gogir-labs-fe\.env.example") {
        Copy-Item "gogir-labs-fe\.env.example" "gogir-labs-fe\.env"
        Write-Host "✅ Created gogir-labs-fe\.env" -ForegroundColor Green
    } else {
        Write-Host "⚠️  .env.example not found. Please create gogir-labs-fe\.env manually." -ForegroundColor Yellow
    }
}

# Build and start containers
Write-Host "📦 Building Docker images..." -ForegroundColor Blue
docker-compose build

Write-Host "🚀 Starting services..." -ForegroundColor Blue
docker-compose up -d

# Wait for database to be ready
Write-Host "⏳ Waiting for PostgreSQL database to be ready..." -ForegroundColor Blue
Start-Sleep -Seconds 5

# Run migrations
Write-Host "🔄 Running database migrations..." -ForegroundColor Blue
docker-compose exec -T backend python manage.py migrate

# Collect static files
Write-Host "📁 Collecting static files..." -ForegroundColor Blue
docker-compose exec -T backend python manage.py collectstatic --noinput

Write-Host ""
Write-Host "✅ Application started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access the application at:" -ForegroundColor Blue
Write-Host "   Frontend:  http://localhost:3000" -ForegroundColor Green
Write-Host "   Backend:   http://localhost:8000/api/v1" -ForegroundColor Green
Write-Host "   Admin:     http://localhost:8000/admin" -ForegroundColor Green
Write-Host "   API Docs:  http://localhost:8000/api/docs" -ForegroundColor Green
Write-Host ""
Write-Host "📊 View logs:" -ForegroundColor Blue
Write-Host "   docker-compose logs -f"
Write-Host ""
Write-Host "🛑 Stop the application:" -ForegroundColor Blue
Write-Host "   docker-compose down"
Write-Host ""

