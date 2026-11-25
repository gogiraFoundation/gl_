# Homelab API (N4020 + ikon)

Run the Gogir Labs **backend** on the N4020 host (`gogir-server`). Terminate public TLS for `api.gogirlabs.uk` on the Oracle VPS **ikon**. Keep **www** / apex on Cloudflare Workers (OpenNext).

Do **not** deploy this stack onto Traq’s Ampere box (`traqauth`). Do **not** put Postgres on the Pi. Do **not** write to `/mnt/nas`.

## Security note

Do not commit LAN addresses, public VPS IPs, SSH usernames, or private-key paths. Those live in:

- Local shell env when you run `./deploy-homelab.sh` (`HOMELAB_HOST`, `HOMELAB_SSH_KEY`, optional `SSH_JUMP` / `SSH_JUMP_KEY`)
- `.env.homelab` (gitignored) → synced as remote `.env` with mode `600`
- The live nginx upstream on ikon (`API_LAN_HOST` placeholder in the repo snippet)

Personal inventory stays in your private homelab notes, not this repo.

## Status

| Item | State |
|------|--------|
| ikon TLS (`api.gogirlabs.uk`) | Live — Let’s Encrypt, HTTP→HTTPS |
| `https://api.gogirlabs.uk/api/v1/` | Live |
| Frontend | Cloudflare Worker `gogir-labs-fe` (OpenNext) — see [CLOUDFLARE_PAGES.md](CLOUDFLARE_PAGES.md) |
| `NEXT_PUBLIC_API_URL` | `https://api.gogirlabs.uk/api/v1` (build-time; set in the Workers workflow / Wrangler deploy) |

## Architecture

```text
Internet
  ├─ www.gogirlabs.uk / gogirlabs.uk  → Cloudflare Workers (OpenNext)
  └─ api.gogirlabs.uk
        → ikon nginx TLS
              → WireGuard → Pi → LAN
                    → N4020 host :8001
                         Compose: postgres + redis + gunicorn
```

| Role | Host | Notes |
|------|------|--------|
| Frontend | Cloudflare Workers | Build env: `NEXT_PUBLIC_API_URL=https://api.gogirlabs.uk/api/v1` |
| Public edge | `ikon` | [`nginx/homelab-api.gogirlabs.uk.conf`](../nginx/homelab-api.gogirlabs.uk.conf) — replace `API_LAN_HOST` before install |
| App + DB | N4020 | Remote dir `/mnt/data/compose/gogirlabs` |
| Control plane | Pi | Unchanged; not the API host |

Repo files:

| File | Purpose |
|------|---------|
| [`docker-compose.homelab.yml`](../docker-compose.homelab.yml) | db + redis + backend (no frontend) |
| [`.env.homelab.example`](../.env.homelab.example) | Env template (copy to `.env.homelab`) |
| [`deploy-homelab.sh`](../deploy-homelab.sh) | rsync + compose up + migrate |
| [`nginx/homelab-api.gogirlabs.uk.conf`](../nginx/homelab-api.gogirlabs.uk.conf) | ikon vhost |

## Capacity gate (before first deploy)

On the N4020:

```bash
ssh gogir-server
free -h
df -h /mnt/data
docker stats --no-stream
```

Go if roughly ≥1.5–2 GB free RAM with Jellyfin idle and ≥20 GB free on `/mnt/data`. Compose caps: Postgres 512m, Redis 128m, backend 1g.

## Network reachability

From ikon, confirm the LAN path via the Pi (use your private inventory for addresses):

```bash
ssh gogir-vps
# ping Pi WG address, then N4020 LAN address
```

If the API host is unreachable from the VPS, fix WireGuard AllowedIPs / Pi LAN advertisement before enabling the nginx upstream.

## N4020 prep

```bash
ssh gogir-server
sudo mkdir -p /mnt/data/compose/gogirlabs /mnt/data/backups/gogirlabs /mnt/data/apps/gogirlabs/media
sudo chown -R "$(whoami):$(whoami)" /mnt/data/compose/gogirlabs /mnt/data/backups/gogirlabs /mnt/data/apps/gogirlabs

# API port from LAN only (ikon arrives as routed LAN traffic)
sudo ufw allow from LAN_SUBNET/24 to any port 8001 proto tcp
sudo ufw status verbose
```

Never publish Postgres `5432` or Redis `6379` on the host.

## Deploy from Mac

```bash
cd /path/to/gogir_labs
cp .env.homelab.example .env.homelab
# edit secrets — chmod 600 .env.homelab
# set HOMELAB_BIND_IP to the API host LAN address (not committed)
# keep that same IP (plus localhost) in ALLOWED_HOSTS for healthchecks / LAN curls

# On home LAN:
HOMELAB_HOST='user@api-host' \
HOMELAB_SSH_KEY="$HOME/.ssh/your-homelab-key" \
./deploy-homelab.sh

# Away (ProxyJump via ikon):
HOMELAB_HOST='user@api-host' \
HOMELAB_SSH_KEY="$HOME/.ssh/your-homelab-key" \
SSH_JUMP='user@ikon-public-host' \
SSH_JUMP_KEY="$HOME/.ssh/your-ikon-key" \
HOMELAB_USE_JUMP=1 \
./deploy-homelab.sh
```

| Variable | Required | Meaning |
|----------|----------|---------|
| `HOMELAB_HOST` | yes | `user@host` for the N4020 |
| `HOMELAB_SSH_KEY` | yes | Path to the private key for that host |
| `REMOTE_DIR` | no | Default `/mnt/data/compose/gogirlabs` |
| `HOMELAB_USE_JUMP` | no | Set `1` when off-LAN |
| `SSH_JUMP` | if jump | `user@ikon` |
| `SSH_JUMP_KEY` | if jump | Path to ikon’s private key |
| `HOMELAB_BIND_IP` | in `.env.homelab` | LAN IP used for post-deploy smoke curl |

Smoke on host after deploy (uses `HOMELAB_BIND_IP` from `.env.homelab`):

```bash
# deploy script prints HTTP status from the host
```

Create superuser once:

```bash
ssh gogir-server
cd /mnt/data/compose/gogirlabs
docker compose -f docker-compose.homelab.yml --env-file .env exec backend python manage.py createsuperuser
```

### Media serving and permissions

Homelab sets `SERVE_MEDIA=True` so Django serves `/media/` (WhiteNoise only covers static). Compose bind-mounts `/mnt/data/apps/gogirlabs/media` → `/app/media` (uid/gid 1000, matching `appuser`). If uploads or `seed_blog --refresh` fail with `Permission denied` under `/app/media`, fix ownership:

```bash
sudo chown -R 1000:1000 /mnt/data/apps/gogirlabs/media
# or, if still on the old named volume:
docker compose -f docker-compose.homelab.yml --env-file .env exec -u root backend \
  chown -R 1000:1000 /app/media
```

### Seed blog essays

The backend mounts `/mnt/data/blogs/project_essays` read-only at `/essays` (Markdown plus `images/<project>/`). After a staff user exists, seed unpublished Project Essays posts (idempotent; skips existing slugs). Local `images/...` refs are copied into `/app/media/blog/essays/` and rewritten to absolute URLs under `PUBLIC_API_ORIGIN` (default `https://api.gogirlabs.uk`):

```bash
ssh gogir-server
cd /mnt/data/compose/gogirlabs
docker compose -f docker-compose.homelab.yml --env-file .env exec backend \
  python manage.py seed_blog --source-dir /essays --dry-run
docker compose -f docker-compose.homelab.yml --env-file .env exec backend \
  python manage.py seed_blog --source-dir /essays
# Re-copy images and rewrite HTML for posts already seeded:
docker compose -f docker-compose.homelab.yml --env-file .env exec backend \
  python manage.py seed_blog --source-dir /essays --refresh
```

Review drafts in Django admin (**Blog > Posts**), then publish when ready. Keep `NEWSLETTER_BROADCASTS_ENABLED=False` unless you intend campaign fan-out. Optional `--publish` publishes new rows via `QuerySet.update` (no admin notify / announcement enqueue).

## ikon nginx + TLS

1. Copy [`nginx/homelab-api.gogirlabs.uk.conf`](../nginx/homelab-api.gogirlabs.uk.conf) to ikon.
2. Replace `API_LAN_HOST` with the N4020 LAN address (edit only on the server; do not commit).
3. Enable the site and obtain/renew certs:

```bash
# from your machine (use your own key path / host — do not commit them)
scp nginx/homelab-api.gogirlabs.uk.conf user@ikon:~/api.gogirlabs.uk.conf

ssh gogir-vps
# edit API_LAN_HOST in the copied file, then:
sudo cp ~/api.gogirlabs.uk.conf /etc/nginx/sites-available/api.gogirlabs.uk
sudo ln -sf /etc/nginx/sites-available/api.gogirlabs.uk /etc/nginx/sites-enabled/
sudo certbot --nginx -d api.gogirlabs.uk   # if needed
sudo nginx -t && sudo systemctl reload nginx
```

Public smoke:

```bash
curl -sSI https://api.gogirlabs.uk/api/v1/
```

## DNS and frontend

| Name | Target |
|------|--------|
| `api.gogirlabs.uk` | A → ikon’s public IP (private inventory) |
| `www` / apex | Cloudflare Worker `gogir-labs-fe` |

Frontend build env: `NEXT_PUBLIC_API_URL=https://api.gogirlabs.uk/api/v1`  
Deploy path: [CLOUDFLARE_PAGES.md](CLOUDFLARE_PAGES.md) (GitHub Actions or `npm run deploy`).

**Pi-hole:** do not override public `api.gogirlabs.uk` to the N4020 LAN address.

## Observability

- Uptime Kuma (Pi): monitor `https://api.gogirlabs.uk/api/v1/` (Public group).
- Optional LAN monitor: `http://<HOMELAB_BIND_IP>:8001/api/v1/`.
- Dozzle on N4020: containers `gogirlabs-*`.

## Backups

On N4020 (example daily cron):

```bash
# /mnt/data/compose/gogirlabs/backup-db.sh
set -euo pipefail
DIR=/mnt/data/backups/gogirlabs
STAMP=$(date +%F)
cd /mnt/data/compose/gogirlabs
# shellcheck source=/dev/null
set -a && source .env && set +a
docker compose -f docker-compose.homelab.yml --env-file .env exec -T db \
  pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$DIR/db-$STAMP.sql.gz"
find "$DIR" -name 'db-*.sql.gz' -mtime +14 -delete
```

Rsync compressed dumps to ikon with your private SSH config (do not put hostnames or key paths in this repo).

Run a restore drill once before calling the API production.

## CI note

GitHub-hosted runners cannot reach the LAN API host. Homelab deploys are **manual** via `./deploy-homelab.sh` from a machine that can reach the host (LAN or jump). Docker Hub CD for classic Compose remains separate.

## Smoke matrix

| Check | Pass |
|-------|------|
| `http://<HOMELAB_BIND_IP>:8001/api/v1/` on LAN | 200 |
| `https://api.gogirlabs.uk/api/v1/` | 200 + valid cert |
| www site loads data | no CORS errors; Network tab → `api.gogirlabs.uk` |
| Contact / newsletter / admin | OK |
| Jellyfin + Dozzle Kuma | still up |
| `docker stats` Gogir stack | within mem limits |

## Rollback

1. Point `api` nginx upstream back to the previous origin (or disable the vhost).
2. On N4020: `cd /mnt/data/compose/gogirlabs && docker compose -f docker-compose.homelab.yml --env-file .env stop`
3. Restore DB from `/mnt/data/backups/gogirlabs` if needed.

## Related

- Env reference: [`ENV_EXAMPLE.md`](../ENV_EXAMPLE.md) § Homelab
- Frontend Workers: [`docs/CLOUDFLARE_PAGES.md`](CLOUDFLARE_PAGES.md)
- Classic same-host Compose: [`DEPLOYMENT.md`](../DEPLOYMENT.md)
