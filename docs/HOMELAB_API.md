# Homelab API (N4020 + ikon)

Run the Gogir Labs **backend** on `gogir-server` (Celeron N4020). Terminate public TLS for `api.gogirlabs.uk` on Oracle VPS **ikon**. Keep **www** / apex on Cloudflare Pages.

Do **not** deploy this stack onto Traq’s Ampere box (`traqauth`). Do **not** put Postgres on the Pi. Do **not** write to `/mnt/nas`.

## Status (2026-09-27)

| Item | State |
|------|--------|
| ikon TLS (`api.gogirlabs.uk`) | **Live** — Let’s Encrypt (renews; noted expiry ~2026-12-26), HTTP→HTTPS, fail-closed on bare IP |
| `https://api.gogirlabs.uk/api/v1/` | **200** `{"status":"ok"}` |
| Blog list via API | **200** |
| Cloudflare Pages `NEXT_PUBLIC_API_URL` | **Open** — live `gl-frontend` still builds against Heroku until env is updated and redeployed (below) |

### Pages cutover (remaining)

In Cloudflare → **Workers & Pages** → **`gl-frontend`** → **Settings → Environment variables**, set for **Production** and **Preview**:

```text
NEXT_PUBLIC_API_URL=https://api.gogirlabs.uk/api/v1
```

Then **Retry deployment** (or push a no-op commit). This is a **build-time** variable — changing it without a new build leaves the Heroku URL in the bundle.

Verify after deploy (browser or DevTools → Network): API calls go to `api.gogirlabs.uk`, not `*.herokuapp.com`.

## Architecture

```text
Internet
  ├─ www.gogirlabs.uk / gogirlabs.uk  → Cloudflare Pages
  └─ api.gogirlabs.uk
        → ikon (140.238.85.163) nginx TLS
              → WireGuard → Pi (10.10.0.2) → LAN
                    → gogir-server 192.168.0.21:8001
                         Compose: postgres + redis + gunicorn
```

| Role | Host | Notes |
|------|------|--------|
| Frontend | Cloudflare Pages | `NEXT_PUBLIC_API_URL=https://api.gogirlabs.uk/api/v1` |
| Public edge | `ikon` | [`nginx/homelab-api.gogirlabs.uk.conf`](../nginx/homelab-api.gogirlabs.uk.conf) |
| App + DB | N4020 `192.168.0.21` | `/mnt/data/compose/gogirlabs` |
| Control plane | Pi `192.168.0.2` | unchanged |

Repo files:

| File | Purpose |
|------|---------|
| [`docker-compose.homelab.yml`](../docker-compose.homelab.yml) | db + redis + backend (no frontend) |
| [`.env.homelab.example`](../.env.homelab.example) | Env template (copy to `.env.homelab`) |
| [`deploy-homelab.sh`](../deploy-homelab.sh) | rsync + compose up + migrate |
| [`nginx/homelab-api.gogirlabs.uk.conf`](../nginx/homelab-api.gogirlabs.uk.conf) | ikon vhost |

## Capacity gate (before first deploy)

On N4020 (`ssh gogir-server`):

```bash
free -h
df -h /mnt/data
docker stats --no-stream
```

Go if roughly ≥1.5–2 GB free RAM with Jellyfin idle and ≥20 GB free on `/mnt/data`. Compose caps: Postgres 512m, Redis 128m, backend 1g.

## Network reachability

From `ikon`, confirm LAN path via Pi:

```bash
ssh gogir-vps
ping -c 2 10.10.0.2
ping -c 2 192.168.0.21
```

If `.21` is unreachable from the VPS, fix WireGuard AllowedIPs / Pi LAN advertisement before enabling the nginx upstream.

## N4020 prep

```bash
ssh gogir-server
sudo mkdir -p /mnt/data/compose/gogirlabs /mnt/data/backups/gogirlabs /mnt/data/apps/gogirlabs/media
sudo chown -R gogirdev:gogirdev /mnt/data/compose/gogirlabs /mnt/data/backups/gogirlabs /mnt/data/apps/gogirlabs

# API port from LAN only (ikon arrives as routed LAN traffic to .21)
sudo ufw allow from 192.168.0.0/24 to any port 8001 proto tcp
sudo ufw status verbose
```

Never publish Postgres `5432` or Redis `6379` on the host.

## Deploy from Mac

```bash
cd /Users/gogir/Desktop/IOT/gogir_labs
cp .env.homelab.example .env.homelab
# edit secrets — chmod 600 .env.homelab

# On home LAN:
./deploy-homelab.sh

# Away (ProxyJump via ikon):
HOMELAB_USE_JUMP=1 ./deploy-homelab.sh
```

Defaults:

| Variable | Default |
|----------|---------|
| `HOMELAB_HOST` | `gogirdev@192.168.0.21` |
| `HOMELAB_SSH_KEY` | `~/Desktop/azagba/gogir-agent` |
| `REMOTE_DIR` | `/mnt/data/compose/gogirlabs` |
| `SSH_JUMP` | `ubuntu@140.238.85.163` |
| `SSH_JUMP_KEY` | `~/Desktop/azagba/ssh-key-2026-08-12.key` |

Smoke on host after deploy:

```bash
curl -sS -o /dev/null -w '%{http_code}\n' http://192.168.0.21:8001/api/v1/
```

Create superuser once:

```bash
ssh gogir-server
cd /mnt/data/compose/gogirlabs
docker compose -f docker-compose.homelab.yml --env-file .env exec backend python manage.py createsuperuser
```

## ikon nginx + TLS

Copy the snippet from this repo, enable the site, obtain/renew certs:

```bash
# from Mac, after editing paths if needed
scp -i ~/Desktop/azagba/ssh-key-2026-08-12.key \
  nginx/homelab-api.gogirlabs.uk.conf \
  ubuntu@140.238.85.163:~/api.gogirlabs.uk.conf

ssh gogir-vps
sudo cp ~/api.gogirlabs.uk.conf /etc/nginx/sites-available/api.gogirlabs.uk
sudo ln -sf /etc/nginx/sites-available/api.gogirlabs.uk /etc/nginx/sites-enabled/
sudo certbot --nginx -d api.gogirlabs.uk   # if needed
sudo nginx -t && sudo systemctl reload nginx
```

Public smoke:

```bash
curl -sSI https://api.gogirlabs.uk/api/v1/
```

## DNS and Cloudflare Pages

| Name | Target |
|------|--------|
| `api.gogirlabs.uk` | A → `140.238.85.163` (ikon) |
| `www` / apex | Cloudflare Pages (unchanged) |

Pages env: `NEXT_PUBLIC_API_URL=https://api.gogirlabs.uk/api/v1`

**Pi-hole:** do not override public `api.gogirlabs.uk` to `192.168.0.21`.

## Observability

- Uptime Kuma (Pi): monitor `https://api.gogirlabs.uk/api/v1/` (Public group).
- Optional Compute monitor: `http://192.168.0.21:8001/api/v1/`.
- Labs Manager Directory: add public DNS + internal URL in `inventory.json`.
- Dozzle on N4020: containers `gogirlabs-*`.

## Backups

On N4020 (example daily cron):

```bash
# /mnt/data/compose/gogirlabs/backup-db.sh
set -euo pipefail
DIR=/mnt/data/backups/gogirlabs
STAMP=$(date +%F)
cd /mnt/data/compose/gogirlabs
docker compose -f docker-compose.homelab.yml --env-file .env exec -T db \
  pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$DIR/db-$STAMP.sql.gz"
find "$DIR" -name 'db-*.sql.gz' -mtime +14 -delete
```

Rsync to ikon (reuse your VPS key pattern):

```bash
rsync -az -e "ssh -i ~/.ssh/id_ed25519_vps -o IdentitiesOnly=yes" \
  /mnt/data/backups/gogirlabs/ ubuntu@10.10.0.1:~/gogirlabs-backups/
```

Run a restore drill once before calling the API production.

## CI note

GitHub-hosted runners cannot reach `192.168.0.21`. Homelab deploys are **manual** via `./deploy-homelab.sh` from the Mac (LAN or `HOMELAB_USE_JUMP=1`). Existing Docker Hub CD remains unrelated.

## Smoke matrix

| Check | Pass |
|-------|------|
| `http://192.168.0.21:8001/api/v1/` on LAN | 200 |
| `https://api.gogirlabs.uk/api/v1/` | 200 + valid cert |
| Pages site loads data | no CORS errors |
| Contact / newsletter / admin | OK |
| Jellyfin + Dozzle Kuma | still up |
| `docker stats` Gogir stack | within mem limits |

## Rollback

1. Point `api` nginx upstream back to the previous origin (or disable the vhost).
2. On N4020: `cd /mnt/data/compose/gogirlabs && docker compose -f docker-compose.homelab.yml --env-file .env stop`
3. Restore DB from `/mnt/data/backups/gogirlabs` if needed.

## Related

- Homelab source of truth: `~/Desktop/azagba/HOMELAB.md`
- Env reference: [`ENV_EXAMPLE.md`](../ENV_EXAMPLE.md) § Homelab
- Cloudflare Pages: [`docs/CLOUDFLARE_PAGES.md`](CLOUDFLARE_PAGES.md)
