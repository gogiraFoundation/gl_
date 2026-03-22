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
- **`.github/workflows/backend-cloudflare-setup.yml`** — The production config sanity step uses **placeholder env values** when GitHub secrets are unset so CI stays green; real deploy values still come from your server/Heroku env. See [docs/CLOUDFLARE_PAGES.md](docs/CLOUDFLARE_PAGES.md) for optional repo secrets.

When you open a PR, use the checklist in `.github/pull_request_template.md`.

**Security Scan (Trivy → SARIF):** Pull requests **from forks** cannot upload results to the base repo’s Code Scanning UI (GitHub token limitation). The workflow still runs Trivy; only the upload step is skipped. Same-repo PRs and pushes upload when `security-events: write` is allowed.
