# Deployment Guide

## Homelab API (primary for api.gogirlabs.uk)

Live public API on home compute with TLS on Oracle VPS **ikon**, frontend on Cloudflare Workers:

- Runbook: [docs/HOMELAB_API.md](docs/HOMELAB_API.md)
- Compose: `docker-compose.homelab.yml`
- Deploy: `./deploy-homelab.sh` (requires `HOMELAB_HOST` + `HOMELAB_SSH_KEY` in the shell)
- Edge nginx: `nginx/homelab-api.gogirlabs.uk.conf` (replace `API_LAN_HOST` on the server only)
- Frontend: [docs/CLOUDFLARE_PAGES.md](docs/CLOUDFLARE_PAGES.md)

Do not commit LAN IPs, VPS IPs, or SSH key paths.

The sections below describe the older **full-stack same-host** path (`docker-compose.prod.yml` / `deploy.sh`).

## Prerequisites

- Docker and Docker Compose
- Domain DNS
- SSL certificates (Let’s Encrypt recommended)
- Server with roughly 2GB+ RAM
- SSH access to the deployment host

## Environment Setup

There are no committed `.env.production.example` / `.env.staging.example` files. Build a root `.env` from [ENV_EXAMPLE.md](ENV_EXAMPLE.md) §3 (or §5 for homelab).

```bash
# Example: start from the env reference, then:
# create .env (or .env.production) with real secrets
chmod 600 .env
```

Key production values:

- `SECRET_KEY` — strong, unique (see generator below)
- `DEBUG=False`
- `ALLOWED_HOSTS` — API hostnames only
- `DB_PASSWORD` — strong
- `EMAIL_*` — Cloudflare Email Sending or your SMTP provider
- `CORS_ALLOWED_ORIGINS` / `CSRF_TRUSTED_ORIGINS` — frontend origins
- `FRONTEND_URL` / `NEXT_PUBLIC_API_URL`

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## SSL Certificate Setup (same-host)

```bash
sudo apt-get update
sudo apt-get install certbot

# API subdomain when frontend is on Cloudflare
sudo certbot certonly --standalone -d api.gogirlabs.uk

sudo cp /etc/letsencrypt/live/api.gogirlabs.uk/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/api.gogirlabs.uk/privkey.pem nginx/ssl/key.pem
sudo chmod 644 nginx/ssl/cert.pem
sudo chmod 600 nginx/ssl/key.pem
```

## Deployment Steps (classic Compose)

```bash
chmod +x deploy.sh
./deploy.sh staging
./deploy.sh production

curl https://api.gogirlabs.uk/api/v1/blog/posts/
# Frontend: https://www.gogirlabs.uk (Cloudflare Workers)
```

## Manual Deployment Steps

```bash
git pull origin main
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput
docker-compose -f docker-compose.prod.yml restart
```

## Post-Deployment

```bash
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f backend
```

Health:

```bash
curl http://localhost:8000/api/v1/
curl http://localhost:3000/
curl http://localhost/health
```

## Monitoring and backups

```bash
docker-compose -f docker-compose.prod.yml logs -f
docker-compose -f docker-compose.prod.yml exec db pg_dump -U "$DB_USER" "$DB_NAME" > "backup_$(date +%Y%m%d_%H%M%S).sql"
```

## Rollback

```bash
docker-compose -f docker-compose.prod.yml down
# Retag / pull previous images, then:
docker-compose -f docker-compose.prod.yml up -d
```

## CI/CD

| Workflow | Role |
|----------|------|
| `ci.yml` | Tests + security scan |
| `cd.yml` | Image push on `main` / `dev` |
| `code-quality.yml` | Lint / format |
| `frontend-cloudflare-workers.yml` | www Worker deploy |
| `backend-cloudflare-setup.yml` | Config checks |

Homelab API is **not** auto-deployed from GitHub Actions.

## Troubleshooting

### Database

```bash
docker-compose -f docker-compose.prod.yml ps db
docker-compose -f docker-compose.prod.yml logs db
docker-compose -f docker-compose.prod.yml exec backend python manage.py dbshell
```

### Static files

```bash
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput --clear
docker-compose -f docker-compose.prod.yml exec nginx nginx -t
```

### Performance

```bash
docker stats
# Increase gunicorn workers in docker-compose.prod.yml if needed
```

## Security Checklist

- [ ] Strong `SECRET_KEY`
- [ ] `DEBUG=False`
- [ ] `ALLOWED_HOSTS` / CORS / CSRF correct
- [ ] TLS valid
- [ ] Strong DB and email credentials (not in git)
- [ ] Firewall; Postgres/Redis not published publicly
- [ ] Backups scheduled
- [ ] Security headers + rate limits

## Maintenance

- Weekly: logs, disk, backup verification
- Monthly: dependency and security patches
- Quarterly: cert renewal check, deeper audit

## Support

- Homelab path: [docs/HOMELAB_API.md](docs/HOMELAB_API.md)
- Env reference: [ENV_EXAMPLE.md](ENV_EXAMPLE.md)
- Checklist: [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)
