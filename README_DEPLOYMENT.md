# Deployment Quick Start

## Quick Deployment Commands

### Staging
```bash
./deploy.sh staging
```

### Production
```bash
./deploy.sh production
```

## Environment Setup

1. Copy environment example files:
```bash
cp .env.production.example .env.production
cp .env.staging.example .env.staging
```

2. Edit `.env.production` and `.env.staging` with your values

3. Generate secret key:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## CI/CD Pipeline

The project includes three GitHub Actions workflows:

1. **CI Pipeline** (`.github/workflows/ci.yml`):
   - Runs tests on every push/PR
   - Builds Docker images
   - Security scanning

2. **CD Pipeline** (`.github/workflows/cd.yml`):
   - Auto-deploys to staging
   - Deploys to production after staging verification
   - Includes rollback on failure

3. **Code Quality** (`.github/workflows/code-quality.yml`):
   - Linting and code formatting checks

## Required GitHub Secrets

Configure these in your GitHub repository settings:

- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password/token
- `STAGING_HOST`: Staging server IP/hostname
- `STAGING_USER`: SSH username for staging
- `STAGING_SSH_KEY`: SSH private key for staging
- `PRODUCTION_HOST`: Production server IP/hostname
- `PRODUCTION_USER`: SSH username for production
- `PRODUCTION_SSH_KEY`: SSH private key for production
- `SLACK_WEBHOOK_URL`: (Optional) Slack webhook for notifications

## Database Backups

### Create Backup
```bash
./backup.sh production
```

### Restore Backup
```bash
./restore.sh backups/backup_production_20240220_120000.sql.gz production
```

## Health Checks

After deployment, verify services:

```bash
# Backend
curl http://localhost:8000/api/v1/

# Frontend
curl http://localhost:3000/

# Nginx
curl http://localhost/health
```

## Monitoring

View logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

Check container status:
```bash
docker-compose -f docker-compose.prod.yml ps
```

## Troubleshooting

See `DEPLOYMENT.md` for detailed troubleshooting guide.

