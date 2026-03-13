# Environment variables – copy & paste reference

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

# Email (console backend by default)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=localhost
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
DEFAULT_FROM_EMAIL=noreply@localhost

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

# Email (SMTP)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-smtp-user
EMAIL_HOST_PASSWORD=your-smtp-password
DEFAULT_FROM_EMAIL=noreply@yourdomain.com

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
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
DEFAULT_FROM_EMAIL=noreply@gogirlabs.uk

# Optional: custom log directory
# DJANGO_LOG_DIR=/app/logs
```

---

## 5. Backend – Heroku

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

## 6. Frontend only – Cloudflare Pages / Vercel

Set in **Cloudflare Pages** or **Vercel** → Project → Settings → Environment variables.

**Production / Preview:**

```env
NEXT_PUBLIC_API_URL=https://api.gogirlabs.uk/api/v1
```

---

## 7. Local Docker Compose (defaults)

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
| `EMAIL_*` | ✅ | – | SMTP / email backend |
| `NEXT_PUBLIC_API_URL` | – | ✅ | Backend API base (build-time) |
| `DJANGO_LOG_DIR` | ✅ | – | Optional log directory (default `/app/logs` in prod) |
