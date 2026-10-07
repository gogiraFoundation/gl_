# Cloudflare frontend (www.gogirlabs.uk)

- **Domain**: **www.gogirlabs.uk** (and apex → www)
- **API**: **api.gogirlabs.uk** (homelab via ikon — see [HOMELAB_API.md](HOMELAB_API.md))
- **App**: Next.js in `gogir-labs-fe`
- **Adapter**: **OpenNext** (`@opennextjs/cloudflare`) on **Workers** — not Pages + `next-on-pages`

## Why Pages builds keep failing

Your build log still shows:

```text
Executing user command: npx @cloudflare/next-on-pages@1
```

That command is stored on the **Pages project `gl-frontend`** in the Cloudflare dashboard. Changing git does **not** change it. `next-on-pages` also does not support **Next 16**.

OpenNext produces a **Worker** (`.open-next/worker.js` + assets). Classic Pages expects a static output dir (`pages_build_output_dir`). That is why Wrangler warns and skips `wrangler.jsonc` on Pages.

**Do not keep retrying the Pages project with `next-on-pages`.** Use one of the paths below.

---

## Path A — GitHub Actions → Workers (recommended)

Workflow: [`.github/workflows/frontend-cloudflare-workers.yml`](../.github/workflows/frontend-cloudflare-workers.yml)

1. Cloudflare dashboard → **My Profile → API Tokens → Create Token**  
   Use template **Edit Cloudflare Workers** (needs account read + workers edit).
2. GitHub → `gogiraFoundation/gl_` → **Settings → Secrets and variables → Actions**  
   Add:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID` (Workers overview / account URL)
3. Push to `main` (or **Actions → Deploy frontend → Run workflow**).
4. Cloudflare → **Workers & Pages → `gogir-labs-fe`** (Worker) → **Custom domains** → add `www.gogirlabs.uk` (and apex redirect if needed).
5. On old Pages project **`gl-frontend`**: **Settings → Builds** → turn **Automatic deployments OFF** (or delete the project once www is on the Worker).

Build env used by the workflow:

```text
NEXT_PUBLIC_API_URL=https://api.gogirlabs.uk/api/v1
```

---

## Path B — Workers Builds in the Cloudflare dashboard

1. **Workers & Pages → Create → Import repository** (or open Worker `gogir-labs-fe` if it exists).
2. Connect `gogiraFoundation/gl_`, root directory **`gogir-labs-fe`**.
3. Build / deploy settings:

| Setting | Value |
|---------|--------|
| Build command | `npm run pages:build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `gogir-labs-fe` |

4. Variables: `NEXT_PUBLIC_API_URL=https://api.gogirlabs.uk/api/v1`
5. Disable auto-deploy on Pages project **`gl-frontend`**.
6. Point **www** at the Worker.

If you only edit **`gl-frontend` Pages** and leave Build command as `npx @cloudflare/next-on-pages@1`, builds will keep failing.

---

## Path C — Local deploy (one-shot)

```bash
cd gogir-labs-fe
npm ci
NEXT_PUBLIC_API_URL=https://api.gogirlabs.uk/api/v1 npm run deploy
```

Requires `npx wrangler login` (or API token env vars). Then attach `www.gogirlabs.uk` to Worker `gogir-labs-fe`.

---

## Repo files

| File | Role |
|------|------|
| [`gogir-labs-fe/wrangler.jsonc`](../gogir-labs-fe/wrangler.jsonc) | Worker name, assets, compat flags |
| [`gogir-labs-fe/open-next.config.ts`](../gogir-labs-fe/open-next.config.ts) | OpenNext adapter config |
| `npm run pages:build` | `opennextjs-cloudflare build` |
| `npm run deploy` | build + `opennextjs-cloudflare deploy` |

## Backend CORS (unchanged)

| Variable | Value |
|----------|--------|
| `ALLOWED_HOSTS` | `api.gogirlabs.uk` |
| `CORS_ALLOWED_ORIGINS` | `https://www.gogirlabs.uk,https://gogirlabs.uk` |
| `CSRF_TRUSTED_ORIGINS` | `https://www.gogirlabs.uk,https://gogirlabs.uk` |
| `FRONTEND_URL` | `https://www.gogirlabs.uk` |

## Verify

After a green Worker deploy:

1. Hard-refresh `https://www.gogirlabs.uk`
2. DevTools → Network → API host is `api.gogirlabs.uk` (not Heroku)
3. No more Pages logs with `next-on-pages`
