## Cloudflare Pages deployment (frontend)

- **Domain**: **www.gogirlabs.uk** (frontend on Cloudflare Pages)
- **API**: **api.gogirlabs.uk** (backend on your server)
- **Project root**: this repository
- **Project type**: Next.js (App Router)
- **Build directory**: `gogir-labs-fe`

### 1. Create Cloudflare Pages project

- In the Cloudflare dashboard, create a new Pages project and connect it to the `gl_` GitHub repository (`gogiraFoundation/gl_`).
- When asked for the project settings:
  - **Framework preset**: Next.js
  - **Root directory**: `gogir-labs-fe`
  - **Build command**: `npm install && npm run build`
  - **Output directory**: leave as the default suggested for Next.js.
- Set the **custom domain** for the project to **www.gogirlabs.uk** (and optionally gogirlabs.uk with redirect to www).

### 2. Environment variables

Set the following in Cloudflare Pages (**Settings → Environment variables**) for **Production** and **Preview**:

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_API_URL` | `https://api.gogirlabs.uk/api/v1` |

The frontend will call the backend at this URL.

### 3. Backend (Django) configuration

On the server where the backend runs, set these environment variables (e.g. in `.env.production` or your Docker/Compose env):

| Variable | Value |
|----------|--------|
| `ALLOWED_HOSTS` | `api.gogirlabs.uk` |
| `CORS_ALLOW_ALL_ORIGINS` | `False` |
| `CORS_ALLOWED_ORIGINS` | `https://www.gogirlabs.uk` |
| `CSRF_TRUSTED_ORIGINS` | `https://www.gogirlabs.uk` |
| `FRONTEND_URL` | `https://www.gogirlabs.uk` |

These are read by `config/settings.py`; multiple origins can be comma-separated.

### 3b. GitHub Actions (`Backend Cloudflare Setup` workflow)

The workflow `.github/workflows/backend-cloudflare-setup.yml` runs `scripts/check-prod-config.sh` to ensure required variables are present. You can set these **repository secrets** so CI validates your real values (otherwise the workflow uses safe CI placeholders and still passes):

| Secret | Purpose |
|--------|---------|
| `API_ALLOWED_HOSTS` | Comma-separated hosts (e.g. `api.gogirlabs.uk`) |
| `CLOUDFLARE_PAGES_URL` | Frontend origin used for CORS/CSRF/FRONTEND_URL (e.g. `https://www.gogirlabs.uk`) |

### 4. DNS (Cloudflare)

- **www.gogirlabs.uk** → Cloudflare Pages (CNAME to your Pages project, or use the Pages custom domain wizard).
- **api.gogirlabs.uk** → Your backend server (A or CNAME to the server running Nginx/Docker). If the server is behind Cloudflare, enable proxy (orange cloud) and use “Full (strict)” SSL.

