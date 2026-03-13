# Deployment Guide

This guide covers deploying the Gogir Labs portfolio website to production and staging environments.

## Prerequisites

- Docker and Docker Compose installed
- Domain name configured with DNS
- SSL certificates (Let's Encrypt recommended)
- Server with minimum 2GB RAM, 2 CPU cores
- SSH access to deployment server

## Environment Setup

### 1. Create Environment Files

Copy the example environment files and configure them:

```bash
# Production
cp .env.production.example .env.production
# Edit .env.production with your production values

# Staging
cp .env.staging.example .env.staging
# Edit .env.staging with your staging values
```

### 2. Configure Environment Variables

Key variables to set:

**Production (.env.production):**
- `SECRET_KEY`: Generate a strong secret key
- `DEBUG=False`
- `ALLOWED_HOSTS`: Your domain names
- `DB_PASSWORD`: Strong database password
- `EMAIL_*`: Email service credentials
- `CORS_ALLOWED_ORIGINS`: Your frontend URLs

**Staging (.env.staging):**
- Similar to production but with staging URLs
- `DEBUG=True` for easier debugging

### 3. Generate Secret Key

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## SSL Certificate Setup

### Using Let's Encrypt (Recommended)

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot

# Generate certificates (API subdomain only; frontend is on Cloudflare Pages)
sudo certbot certonly --standalone -d api.gogirlabs.uk

# Copy certificates to nginx/ssl directory
sudo cp /etc/letsencrypt/live/api.gogirlabs.uk/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/api.gogirlabs.uk/privkey.pem nginx/ssl/key.pem
sudo chmod 644 nginx/ssl/cert.pem
sudo chmod 600 nginx/ssl/key.pem
```

## Deployment Steps

### Staging Deployment

```bash
# 1. Make deployment script executable
chmod +x deploy.sh

# 2. Deploy to staging
./deploy.sh staging
```

### Production Deployment

```bash
# 1. Deploy to production
./deploy.sh production

# 2. Verify deployment
curl https://api.gogirlabs.uk/api/v1/blog/posts/
# Frontend: https://www.gogirlabs.uk (Cloudflare Pages)
```

## Manual Deployment Steps

If not using the deployment script:

```bash
# 1. Pull latest code
git pull origin main

# 2. Pull latest Docker images
docker-compose -f docker-compose.prod.yml pull

# 3. Stop existing containers
docker-compose -f docker-compose.prod.yml down

# 4. Start services
docker-compose -f docker-compose.prod.yml up -d

# 5. Run migrations
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

# 6. Collect static files
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput

# 7. Restart services
docker-compose -f docker-compose.prod.yml restart
```

## Post-Deployment Tasks

### 1. Create Superuser

```bash
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

### 2. Verify Services

```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### 3. Health Checks

```bash
# Backend health
curl http://localhost:8000/api/v1/

# Frontend health
curl http://localhost:3000/

# Nginx health
curl http://localhost/health
```

## Monitoring

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Database Backup

```bash
# Create backup
docker-compose -f docker-compose.prod.yml exec db pg_dump -U $DB_USER $DB_NAME > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker-compose -f docker-compose.prod.yml exec -T db psql -U $DB_USER $DB_NAME < backup_file.sql
```

## Rollback Procedure

If deployment fails:

```bash
# 1. Stop current containers
docker-compose -f docker-compose.prod.yml down

# 2. Restore previous image version
docker pull your-username/gogir-labs-backend:previous-version
docker pull your-username/gogir-labs-frontend:previous-version

# 3. Update docker-compose.prod.yml with previous image tags

# 4. Start services
docker-compose -f docker-compose.prod.yml up -d
```

## CI/CD Integration

The project includes GitHub Actions workflows:

1. **CI Pipeline** (`.github/workflows/ci.yml`):
   - Runs on every push and PR
   - Executes backend and frontend tests
   - Performs security scans
   - Builds Docker images

2. **CD Pipeline** (`.github/workflows/cd.yml`):
   - Deploys to staging after successful CI
   - Deploys to production after staging verification
   - Includes rollback on failure

3. **Code Quality** (`.github/workflows/code-quality.yml`):
   - Runs linting checks
   - Validates code formatting

## Troubleshooting

### Database Connection Issues

```bash
# Check database container
docker-compose -f docker-compose.prod.yml ps db

# Check database logs
docker-compose -f docker-compose.prod.yml logs db

# Test connection
docker-compose -f docker-compose.prod.yml exec backend python manage.py dbshell
```

### Static Files Not Loading

```bash
# Recollect static files
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput --clear

# Check nginx configuration
docker-compose -f docker-compose.prod.yml exec nginx nginx -t
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Scale backend workers (edit docker-compose.prod.yml)
# Increase gunicorn workers in backend command
```

## Security Checklist

- [ ] Strong SECRET_KEY set
- [ ] DEBUG=False in production
- [ ] ALLOWED_HOSTS configured correctly
- [ ] SSL certificates installed and valid
- [ ] Database passwords are strong
- [ ] Email credentials secured
- [ ] Firewall rules configured
- [ ] Regular backups scheduled
- [ ] Security headers enabled in nginx
- [ ] Rate limiting configured

## Maintenance

### Regular Tasks

1. **Weekly:**
   - Review application logs
   - Check disk space
   - Verify backups

2. **Monthly:**
   - Update dependencies
   - Review security patches
   - Performance optimization

3. **Quarterly:**
   - SSL certificate renewal
   - Database optimization
   - Full security audit

## Support

For issues or questions:
- Check logs: `docker-compose logs`
- Review GitHub Actions: Check CI/CD pipeline status
- Database issues: Check connection strings and credentials

