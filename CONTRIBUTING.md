# Contributing

## Frontend checks (before opening a PR)

From `gogir-labs-fe/`:

```bash
npm ci
npm run lint
npm run type-check
npx prettier --check .
```

Prettier must pass on the whole frontend tree (CI runs `npx prettier --check .` in `gogir-labs-fe`).

## Backend checks

From `gogir-labs-be/` (with dev deps installed):

```bash
black --check .
isort --check-only .
```

## Review notes (high impact areas)

- **`gogir-labs-fe/lib/api.ts`** — Request/response interceptors affect **all** API calls (JWT attachment, 401 retry + token clear). Call out behavior changes in the PR description.
- **`.github/workflows/backend-cloudflare-setup.yml`** — The production config sanity step uses **placeholder env values** when GitHub secrets are unset so CI stays green; real deploy values come from the API host env (homelab `.env`). See [docs/CLOUDFLARE_PAGES.md](docs/CLOUDFLARE_PAGES.md) for frontend secrets.

When you open a PR, use the checklist in `.github/pull_request_template.md`.

**Cloudflare:** Deploy the Next.js app with **OpenNext → Workers** (`gogir-labs-fe`). Do not use classic Pages + `next-on-pages` — see [docs/CLOUDFLARE_PAGES.md](docs/CLOUDFLARE_PAGES.md).

**Secrets:** Never commit `.env`, `.env.homelab`, API tokens, or private keys. Prefer placeholders in docs (`change-me…`, `your-…-token`).

**Security Scan (Trivy → SARIF):** Pull requests **from forks** cannot upload results to the base repo’s Code Scanning UI (GitHub token limitation). The workflow still runs Trivy; only the upload step is skipped. Same-repo PRs and pushes upload when `security-events: write` is allowed.
