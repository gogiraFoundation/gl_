# Production Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

### Code Quality
- [ ] All tests passing (backend: 170+, frontend: 32+)
- [ ] No linting errors
- [ ] Code review completed
- [ ] Security scan passed

### Configuration
- [ ] `.env.production` file created and configured
- [ ] `SECRET_KEY` generated and set (strong, unique)
- [ ] `DEBUG=False` in production
- [ ] `ALLOWED_HOSTS` includes all domain names
- [ ] Database credentials configured
- [ ] Email service credentials configured
- [ ] `CORS_ALLOWED_ORIGINS` set correctly
- [ ] `FRONTEND_URL` and `NEXT_PUBLIC_API_URL` set

### Infrastructure
- [ ] Server provisioned (min 2GB RAM, 2 CPU cores)
- [ ] Docker and Docker Compose installed
- [ ] Domain DNS configured
- [ ] SSL certificates obtained and placed in `nginx/ssl/`
- [ ] Firewall rules configured
- [ ] SSH access configured

### Database
- [ ] PostgreSQL installed/configured
- [ ] Database created
- [ ] Database user created with proper permissions
- [ ] Backup strategy in place

### Security
- [ ] Strong passwords for all services
- [ ] SSH keys configured (no password auth)
- [ ] Firewall enabled
- [ ] Rate limiting configured in nginx
- [ ] Security headers enabled
- [ ] HTTPS enforced

## Deployment

### Initial Setup
- [ ] Code cloned to server
- [ ] Environment files created
- [ ] SSL certificates installed
- [ ] Docker images built or pulled
- [ ] Database initialized

### Deployment Steps
- [ ] Run migrations: `python manage.py migrate`
- [ ] Collect static files: `python manage.py collectstatic`
- [ ] Create superuser: `python manage.py createsuperuser`
- [ ] Start services: `docker-compose up -d`
- [ ] Verify all containers running: `docker-compose ps`

### Post-Deployment Verification
- [ ] Backend API accessible: `curl https://domain.com/api/v1/`
- [ ] Frontend accessible: `curl https://domain.com/`
- [ ] Admin panel accessible: `https://domain.com/admin/`
- [ ] Static files loading correctly
- [ ] Media files accessible
- [ ] Database connections working
- [ ] Email service tested
- [ ] SSL certificate valid
- [ ] No errors in logs

### Functionality Tests
- [ ] Homepage loads correctly
- [ ] Blog posts display
- [ ] Portfolio projects display
- [ ] Contact form submits successfully
- [ ] Newsletter subscription works
- [ ] Admin login works
- [ ] File uploads work
- [ ] Search functionality works

## Monitoring Setup

- [ ] Log aggregation configured
- [ ] Error tracking setup (Sentry, etc.)
- [ ] Uptime monitoring configured
- [ ] Performance monitoring enabled
- [ ] Backup automation scheduled

## Documentation

- [ ] Deployment process documented
- [ ] Environment variables documented
- [ ] Backup/restore procedures documented
- [ ] Troubleshooting guide available
- [ ] Team access configured

## Post-Deployment

### First 24 Hours
- [ ] Monitor error logs
- [ ] Check server resources (CPU, memory, disk)
- [ ] Verify all features working
- [ ] Test email notifications
- [ ] Monitor database performance

### First Week
- [ ] Review access logs
- [ ] Check for security issues
- [ ] Verify backup process
- [ ] Performance optimization if needed
- [ ] User feedback collection

## Rollback Plan

- [ ] Previous version tagged in git
- [ ] Previous Docker images available
- [ ] Database backup available
- [ ] Rollback script tested
- [ ] Rollback procedure documented

## Emergency Contacts

- DevOps Team: [Contact Info]
- Database Admin: [Contact Info]
- Security Team: [Contact Info]
- Hosting Provider: [Contact Info]

## Notes

- Deployment date: ___________
- Deployed by: ___________
- Version: ___________
- Issues encountered: ___________
- Resolution: ___________

