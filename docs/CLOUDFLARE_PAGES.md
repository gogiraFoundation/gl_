# Cloudflare frontend (www.gogirlabs.uk)

- **Domain**: **www.gogirlabs.uk** (and apex → www)
- **API**: **api.gogirlabs.uk** (homelab via ikon — see [HOMELAB_API.md](HOMELAB_API.md))
- **App**: Next.js in `gogir-labs-fe`
- **Adapter**: **OpenNext for Cloudflare** (`@opennextjs/cloudflare`) — not deprecated `@cloudflare/next-on-pages`

`next-on-pages` only supports Next ≤ 15.5.2. This app is on **Next 16.3.x**, so Pages/Workers must use OpenNext.

## Recommended: Workers deploy (OpenNext)

OpenNext produces a Worker (`.open-next/`) plus assets. Deploy with Wrangler (git-connected Workers Builds, or `npm run deploy` locally/CI).

### Build settings (Cloudflare dashboard) — must match this

Project **`gl-frontend`** → **Settings → Builds & deployments**:

| Setting | Value |
|---------|--------|
| Root directory | `gogir-labs-fe` |
| **Build command** | **`npm run pages:build`** |
| **Deploy command** | **`npx wrangler deploy`** |
| **Build output directory** | **clear / empty** (do not use `.vercel/output/static`) |

**Save**, then **Retry deployment**.

If the build log still contains:

```text
Executing user command: npx @cloudflare/next-on-pages@1
```

the dashboard command was **not** updated (or not saved). Git/`main` already has OpenNext; Cloudflare will keep failing until that UI field changes.

Expected good log lines:

```text
Executing user command: npm run pages:build
…
OpenNext — Cloudflare build
…
Worker saved in `.open-next/worker.js`
```

The Pages warning *“wrangler.json … does not appear to be valid … pages_build_output_dir”* is expected for an OpenNext **Worker** config. Ignore it; Wrangler uses `main` + `assets`, not Pages static output.

Do **not** use:

- `npx @cloudflare/next-on-pages@1` (peer conflicts + Next 16 unsupported)
- `npx wrangler versions upload` without a valid Worker entry (fails with missing entry-point)

Repo config: [`gogir-labs-fe/wrangler.jsonc`](../gogir-labs-fe/wrangler.jsonc), [`gogir-labs-fe/open-next.config.ts`](../gogir-labs-fe/open-next.config.ts).

### Local scripts

```bash
cd gogir-labs-fe
npm ci
NEXT_PUBLIC_API_URL=https://api.gogirlabs.uk/api/v1 npm run pages:build
npm run preview   # optional local Wrangler preview
npm run deploy    # build + deploy to Cloudflare Workers
```

### Custom domain

Attach **www.gogirlabs.uk** (and apex redirect) to the Worker / Pages project in the Cloudflare dashboard after the first successful deploy.

## Environment variables

Set for **Production** and **Preview** (build-time):

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_API_URL` | `https://api.gogirlabs.uk/api/v1` |

Replace any Heroku `*.herokuapp.com/api/v1` value. `NEXT_PUBLIC_*` is baked at build — change requires a new deployment.

Confirm in DevTools that API calls hit `api.gogirlabs.uk`, not Heroku.

## Backend (Django) CORS

On the API host (homelab Compose / ikon edge), ensure:

| Variable | Value |
|----------|--------|
| `ALLOWED_HOSTS` | `api.gogirlabs.uk` |
| `CORS_ALLOW_ALL_ORIGINS` | `False` |
| `CORS_ALLOWED_ORIGINS` | `https://www.gogirlabs.uk,https://gogirlabs.uk` |
| `CSRF_TRUSTED_ORIGINS` | `https://www.gogirlabs.uk,https://gogirlabs.uk` |
| `FRONTEND_URL` | `https://www.gogirlabs.uk` |

## Optional caching

OpenNext can use R2 for incremental cache ([docs](https://opennext.js.org/cloudflare/caching)). The repo ships without R2 so Always Free / zero-config deploys work; enable later if you need ISR cache durability.

## DNS

- **www.gogirlabs.uk** / apex → Cloudflare frontend (Worker/Pages custom domain)
- **api.gogirlabs.uk** → ikon (`140.238.85.163`), Full (strict) if proxied

## GitHub secrets (optional CI check)

Workflow `.github/workflows/backend-cloudflare-setup.yml` can validate:

| Secret | Purpose |
|--------|---------|
| `API_ALLOWED_HOSTS` | e.g. `api.gogirlabs.uk` |
| `CLOUDFLARE_PAGES_URL` | e.g. `https://www.gogirlabs.uk` |
