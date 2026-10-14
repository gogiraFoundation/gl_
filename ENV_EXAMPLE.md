# Environment Variables Reference

Use these blocks in `.env` files or your deployment platform. Replace placeholder values with your own.

---

## 1. Backend (Django) – local development

**File:** `gogir-labs-be/.env`

```env
# Required
SECRET_KEY=your-django-secret-key-min-50-chars-long-for-production

# Optional – defaults shown
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (when not using DATABASE_URL)
DB_NAME=gogirlabs
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# Or use a single URL instead of DB_* (overrides DB_*)
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gogirlabs

# CORS (optional for local)
CORS_ALLOW_ALL_ORIGINS=True
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
CSRF_TRUSTED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Email (console backend by default; nothing is delivered)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=localhost
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_USE_SSL=False
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
DEFAULT_FROM_NAME=
DEFAULT_FROM_EMAIL=noreply@localhost
NEWSLETTER_FROM_EMAIL=
EMAIL_REPLY_TO=
NEWSLETTER_BROADCASTS_ENABLED=False

# App
FRONTEND_URL=http://localhost:3000
FILE_UPLOAD_MAX_MEMORY_SIZE=10485760
DATA_UPLOAD_MAX_MEMORY_SIZE=20971520
```

---

## 2. Frontend (Next.js) – local development

**File:** `gogir-labs-fe/.env` or `gogir-labs-fe/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 3. Full stack – Docker Compose (production)

**File:** `.env` in project root (used by `docker-compose.prod.yml`)

```env
# Database
DB_NAME=gogirlabs
DB_USER=postgres
DB_PASSWORD=your-secure-db-password

# Django
SECRET_KEY=your-django-secret-key-min-50-chars-long-and-random
DEBUG=False
ALLOWED_HOSTS=api.yourdomain.com
CORS_ALLOWED_ORIGINS=https://www.yourdomain.com
CSRF_TRUSTED_ORIGINS=https://www.yourdomain.com

# Email — Cloudflare Email Sending (implicit TLS). See section 5 for the full set.
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.mx.cloudflare.net
EMAIL_PORT=465
EMAIL_USE_TLS=False
EMAIL_USE_SSL=True
EMAIL_HOST_USER=api_token
EMAIL_HOST_PASSWORD=your-cloudflare-email-sending-token
DEFAULT_FROM_NAME=Gogir Labs
DEFAULT_FROM_EMAIL=hi@yourdomain.com
NEWSLETTER_FROM_EMAIL=newsletter@yourdomain.com
EMAIL_REPLY_TO=hi@yourdomain.com
NEWSLETTER_BROADCASTS_ENABLED=False

# Frontend URL (used by backend)
FRONTEND_URL=https://www.yourdomain.com

# Next.js (build-time for frontend container)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

---

## 4. Backend only – production (e.g. Cloudflare / standalone server)

Use when the backend runs without Docker or with a different orchestrator.

```env
SECRET_KEY=your-django-secret-key-min-50-chars-long-and-random
DEBUG=False
ALLOWED_HOSTS=api.gogirlabs.uk
CORS_ALLOW_ALL_ORIGINS=False
CORS_ALLOWED_ORIGINS=https://www.gogirlabs.uk
CSRF_TRUSTED_ORIGINS=https://www.gogirlabs.uk
FRONTEND_URL=https://www.gogirlabs.uk

DATABASE_URL=postgresql://user:password@host:5432/dbname
REDIS_URL=redis://localhost:6379/0

EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.mx.cloudflare.net
EMAIL_PORT=465
EMAIL_USE_TLS=False
EMAIL_USE_SSL=True
EMAIL_HOST_USER=api_token
EMAIL_HOST_PASSWORD=your-cloudflare-email-sending-token
DEFAULT_FROM_NAME=Gogir Labs
DEFAULT_FROM_EMAIL=hi@gogirlabs.uk
NEWSLETTER_FROM_EMAIL=newsletter@gogirlabs.uk
EMAIL_REPLY_TO=hi@gogirlabs.uk
NEWSLETTER_BROADCASTS_ENABLED=False

# Optional: custom log directory
# DJANGO_LOG_DIR=/app/logs
```

---

## 5. Homelab (N4020 + ikon)

Backend runs on `gogir-server` via [`docker-compose.homelab.yml`](docker-compose.homelab.yml). Public TLS is on `ikon`; frontend is Cloudflare Workers (OpenNext).

**Local file for deploy:** copy [`.env.homelab.example`](.env.homelab.example) → `.env.homelab` (gitignored).  
**On the host:** `/mnt/data/compose/gogirlabs/.env` (mode 600). Full runbook: [`docs/HOMELAB_API.md`](docs/HOMELAB_API.md).

```env
DB_NAME=gogirlabs
DB_USER=gogirlabs
DB_PASSWORD=your-secure-db-password

SECRET_KEY=your-django-secret-key-min-50-chars-long-and-random
DEBUG=False
ALLOWED_HOSTS=api.gogirlabs.uk,localhost,127.0.0.1,GOGIR_SERVER_LAN_IP
CORS_ALLOW_ALL_ORIGINS=False
CORS_ALLOWED_ORIGINS=https://www.gogirlabs.uk,https://gogirlabs.uk
CSRF_TRUSTED_ORIGINS=https://www.gogirlabs.uk,https://gogirlabs.uk
FRONTEND_URL=https://www.gogirlabs.uk
SECURE_SSL_REDIRECT=False

EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.mx.cloudflare.net
EMAIL_PORT=465
EMAIL_USE_TLS=False
EMAIL_USE_SSL=True
EMAIL_HOST_USER=api_token
EMAIL_HOST_PASSWORD=your-cloudflare-email-sending-token
DEFAULT_FROM_NAME=Gogir Labs
DEFAULT_FROM_EMAIL=hi@gogirlabs.uk
NEWSLETTER_FROM_EMAIL=newsletter@gogirlabs.uk
EMAIL_REPLY_TO=hi@gogirlabs.uk
NEWSLETTER_BROADCASTS_ENABLED=False
```

Include `localhost` (compose healthcheck) and your `HOMELAB_BIND_IP` so LAN curls are not rejected by Django’s host check. Inbound aliases are Cloudflare **Email Routing**, not Django. Onboard `gogirlabs.uk`, verify one personal inbox, and route `hi@`, `newsletter@`, and `dev@` (old public links) to that inbox. `EMAIL_HOST_PASSWORD` is an API token with **Email Sending: Edit**. `EMAIL_USE_TLS` and `EMAIL_USE_SSL` cannot both be true.

Compose injects `DATABASE_URL` / `REDIS_URL` to the `db` and `redis` services. Frontend build: `NEXT_PUBLIC_API_URL=https://api.gogirlabs.uk/api/v1`.

Deploy (hosts and key paths stay in your shell — do not commit them):

```bash
HOMELAB_HOST='user@api-host' HOMELAB_SSH_KEY=~/.ssh/key ./deploy-homelab.sh
# Off LAN: also set SSH_JUMP, SSH_JUMP_KEY, HOMELAB_USE_JUMP=1
```

---

## 6. Backend – Heroku

Set in **Heroku** → your app → **Settings** → **Config Vars**.  
`ALLOWED_HOSTS` is auto-extended with `*.herokuapp.com` when `DYNO` is set; you can still set it to add custom domains.

```env
SECRET_KEY=your-django-secret-key-min-50-chars-long-and-random
DEBUG=False
# Optional: add custom domain(s); *.herokuapp.com is allowed automatically
# ALLOWED_HOSTS=your-app.herokuapp.com,api.yourdomain.com
```

Add the **Heroku Postgres** add-on so `DATABASE_URL` is set. For CORS/CSRF from a frontend, add:

```env
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://www.yourdomain.com
CSRF_TRUSTED_ORIGINS=https://your-frontend.vercel.app,https://www.yourdomain.com
```

---

## 7. Frontend only – Cloudflare Workers (OpenNext)

`NEXT_PUBLIC_API_URL` is a **build-time** variable. Set it in:

- GitHub Actions workflow [`.github/workflows/frontend-cloudflare-workers.yml`](.github/workflows/frontend-cloudflare-workers.yml), or
- Local: `NEXT_PUBLIC_API_URL=… npm run deploy`, or
- Cloudflare Workers Builds env if you deploy from the dashboard

```env
NEXT_PUBLIC_API_URL=https://api.gogirlabs.uk/api/v1
```

Do not put Cloudflare API tokens, account IDs, or Wrangler credentials in this file. Use GitHub Actions secrets or `wrangler login`. See [`docs/CLOUDFLARE_PAGES.md`](docs/CLOUDFLARE_PAGES.md).

---

## 8. Local Docker Compose (defaults)

If you use `docker-compose.yml` and only need to override the API URL for the frontend, you can rely on defaults. Optional **`gogir-labs-be/.env`**:

```env
SECRET_KEY=dev-secret-key-change-in-production
DEBUG=True
```

Optional **`gogir-labs-fe/.env`** (frontend already gets `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1` from compose):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## Quick reference table

| Variable | Backend | Frontend | Description |
|---------|---------|----------|--------------|
| `SECRET_KEY` | ✅ | – | Django secret (min 50 chars in prod) |
| `DEBUG` | ✅ | – | `True` dev, `False` prod |
| `ALLOWED_HOSTS` | ✅ | – | Comma-separated hostnames |
| `DATABASE_URL` or `DB_*` | ✅ | – | PostgreSQL connection |
| `REDIS_URL` | ✅ | – | Optional Redis (production) |
| `CORS_ALLOWED_ORIGINS` | ✅ | – | Comma-separated frontend origins |
| `CSRF_TRUSTED_ORIGINS` | ✅ | – | Same as CORS for form/API |
| `FRONTEND_URL` | ✅ | – | Frontend base URL |
| `EMAIL_*` | ✅ | – | SMTP backend, host, port, TLS/SSL, credentials |
| `DEFAULT_FROM_EMAIL` / `DEFAULT_FROM_NAME` | ✅ | – | From address for contact and other notifications |
| `NEWSLETTER_FROM_EMAIL` | ✅ | – | From address for verify, welcome, and unsubscribe mail |
| `EMAIL_REPLY_TO` | ✅ | – | Reply-To on outbound mail (public inbox) |
| `NEWSLETTER_BROADCASTS_ENABLED` | ✅ | – | `False` keeps campaign fan-out off the transactional sender |
| `ANALYTICS_IP_RETENTION_DAYS` | ✅ | – | Days before `purge_analytics` nulls IP/UA (default `30`) |
| `ANALYTICS_ROW_RETENTION_DAYS` | ✅ | – | Days before `purge_analytics` deletes rows (default `365`) |
| `NEXT_PUBLIC_API_URL` | – | ✅ | Backend API base (build-time) |
| `DJANGO_LOG_DIR` | ✅ | – | Optional log directory (default `/app/logs` in prod) |
