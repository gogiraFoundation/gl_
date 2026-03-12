## Cloudflare Pages deployment (frontend)

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

### 2. Environment variables

Set the following environment variable for both **Production** and **Preview** environments in Cloudflare Pages:

- `NEXT_PUBLIC_API_URL`: `https://api.yourdomain.com/api/v1`

Replace `api.yourdomain.com` with the public HTTPS URL of the Django backend behind Nginx.

### 3. Django CORS/CSRF configuration

- Ensure the backend environment includes:
  - `CORS_ALLOW_ALL_ORIGINS=False`
  - `CORS_ALLOWED_ORIGINS=<Cloudflare Pages URL>,<any other allowed origins>`
  - `CSRF_TRUSTED_ORIGINS=<Cloudflare Pages URL>`

These values are read by `config/settings.py` via `decouple.Csv`, so multiple origins can be provided as a comma-separated list.

