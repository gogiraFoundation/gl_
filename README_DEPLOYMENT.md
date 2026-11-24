# Deployment Quick Start

Primary production path today:

| Surface | How |
|---------|-----|
| API (`api.gogirlabs.uk`) | Homelab Compose on N4020 + TLS on ikon — [`docs/HOMELAB_API.md`](docs/HOMELAB_API.md) |
| Frontend (`www.gogirlabs.uk`) | Cloudflare Workers (OpenNext) — [`docs/CLOUDFLARE_PAGES.md`](docs/CLOUDFLARE_PAGES.md) |

Classic same-host stack (`docker-compose.prod.yml` + `./deploy.sh`) is documented in [`DEPLOYMENT.md`](DEPLOYMENT.md) for alternate hosts.

## Homelab API

```bash
cp .env.homelab.example .env.homelab
chmod 600 .env.homelab
# Fill secrets. Never commit .env.homelab.

HOMELAB_HOST='user@api-host' \
HOMELAB_SSH_KEY="$HOME/.ssh/your-homelab-key" \
./deploy-homelab.sh

# Off LAN:
HOMELAB_USE_JUMP=1 \
HOMELAB_HOST='user@api-host' \
HOMELAB_SSH_KEY="$HOME/.ssh/your-homelab-key" \
SSH_JUMP='user@ikon' \
SSH_JUMP_KEY="$HOME/.ssh/your-ikon-key" \
./deploy-homelab.sh
```

Generate a Django secret:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Full env blocks: [`ENV_EXAMPLE.md`](ENV_EXAMPLE.md).

## Frontend (Workers)

```bash
# GitHub Actions on push to main (gogir-labs-fe/**), or:
cd gogir-labs-fe
NEXT_PUBLIC_API_URL=https://api.gogirlabs.uk/api/v1 npm run deploy
```

Required Actions secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

## Classic Compose (staging / production)

```bash
# Requires a root .env (see ENV_EXAMPLE.md § Full stack)
./deploy.sh staging
./deploy.sh production
```

There are no committed `.env.production.example` / `.env.staging.example` files — use [`ENV_EXAMPLE.md`](ENV_EXAMPLE.md) §3 (classic) or §5 (homelab).

## CI/CD (GitHub Actions)

| Workflow | Role |
|----------|------|
| `.github/workflows/ci.yml` | Tests, image build, security scan |
| `.github/workflows/code-quality.yml` | Lint / format |
| `.github/workflows/cd.yml` | Push backend/frontend images on `main` / `dev` |
| `.github/workflows/frontend-cloudflare-workers.yml` | Deploy OpenNext Worker |
| `.github/workflows/backend-cloudflare-setup.yml` | Backend config checks |

Homelab API deploy is **manual** (runners cannot reach the LAN host).

## Health checks

```bash
curl -sSI https://api.gogirlabs.uk/api/v1/
curl -sSI https://www.gogirlabs.uk/
```

On the API host after homelab deploy:

```bash
docker compose -f docker-compose.homelab.yml --env-file .env ps
docker compose -f docker-compose.homelab.yml --env-file .env logs -f backend
```

## Backups

Homelab: see backup section in [`docs/HOMELAB_API.md`](docs/HOMELAB_API.md).  
Classic Compose: `./backup.sh production` / `./restore.sh …` when those scripts are on the host.

## Troubleshooting

- Homelab / ikon / WireGuard: [`docs/HOMELAB_API.md`](docs/HOMELAB_API.md)
- Workers cutover / OpenNext: [`docs/CLOUDFLARE_PAGES.md`](docs/CLOUDFLARE_PAGES.md)
- Same-host Compose: [`DEPLOYMENT.md`](DEPLOYMENT.md)
