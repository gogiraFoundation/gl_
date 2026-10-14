# Production Deployment Checklist

Use this checklist before deploying to production.

## Homelab path (api.gogirlabs.uk)

See [docs/HOMELAB_API.md](docs/HOMELAB_API.md).

- [ ] `.env.homelab` present locally, mode `600`, not committed
- [ ] `HOMELAB_BIND_IP` set; Postgres/Redis not published on the host
- [ ] `./deploy-homelab.sh` succeeds (migrations + collectstatic)
- [ ] `https://api.gogirlabs.uk/api/v1/` returns 200 with valid TLS
- [ ] ikon nginx uses `API_LAN_HOST` only on the server (not committed)
- [ ] No Pi-hole override for public `api.gogirlabs.uk`
- [ ] Kuma monitor + DB backup cron under `/mnt/data/backups/gogirlabs`
- [ ] Jellyfin / Dozzle still healthy after deploy

## Frontend (www.gogirlabs.uk)

See [docs/CLOUDFLARE_PAGES.md](docs/CLOUDFLARE_PAGES.md).

- [ ] Worker `gogir-labs-fe` deployed (Actions or `npm run deploy`)
- [ ] Build uses `NEXT_PUBLIC_API_URL=https://api.gogirlabs.uk/api/v1`
- [ ] Browser Network tab hits `api.gogirlabs.uk` only (not Heroku / stale hosts)
- [ ] Old Pages project `gl-frontend` auto-deploy **off** (or removed)
- [ ] Custom domain `www` (and apex redirect) attached to the Worker

## Pre-Deployment (classic same-host Compose)

### Code Quality

- [ ] Backend and frontend tests pass (`./run-tests.sh`)
- [ ] No linting errors
- [ ] Security scan reviewed

### Configuration

- [ ] Root `.env` created from [ENV_EXAMPLE.md](ENV_EXAMPLE.md) (not committed)
- [ ] `SECRET_KEY` strong and unique
- [ ] `DEBUG=False`
- [ ] `ALLOWED_HOSTS`, CORS, CSRF, `FRONTEND_URL`, `NEXT_PUBLIC_API_URL` correct
- [ ] Database and email credentials configured

### Infrastructure

- [ ] Server sized (≈2GB+ RAM)
- [ ] Docker / Compose installed
- [ ] DNS + TLS ready
- [ ] Firewall; SSH keys only
- [ ] Postgres/Redis not exposed publicly

### Database

- [ ] DB user/password strong
- [ ] Backup strategy in place

### Security

- [ ] No secrets in git or docs
- [ ] Rate limiting and security headers enabled
- [ ] HTTPS enforced at the edge

## Deployment (classic)

- [ ] Migrations + collectstatic
- [ ] Superuser created (once)
- [ ] Containers healthy: `docker-compose -f docker-compose.prod.yml ps`
- [ ] API and (if co-hosted) frontend health checks pass

## Functionality smoke

- [ ] Homepage, blog, portfolio, resume, search
- [ ] Contact form + newsletter subscribe/verify
- [ ] Admin login (Django + frontend admin)
- [ ] Email transactional path (contact / newsletter)

## Monitoring

- [ ] Uptime check on `https://api.gogirlabs.uk/api/v1/`
- [ ] Backup automation verified
- [ ] Logs reviewed after first deploy

## Rollback

- [ ] Previous git tag / images available
- [ ] DB backup available
- [ ] Homelab rollback steps known ([docs/HOMELAB_API.md](docs/HOMELAB_API.md))

## Notes

- Deployment date: ___________
- Deployed by: ___________
- Version / commit: ___________
- Issues / resolution: ___________
