# Gogir Labs - Portfolio Website

Portfolio site with Django REST Framework (API) and Next.js (frontend): blog, portfolio, resume, contact, newsletter, testimonials, notifications, analytics, and site settings.

## Live topology

| Surface | Host |
|---------|------|
| `www.gogirlabs.uk` | Cloudflare Workers (OpenNext) |
| `api.gogirlabs.uk` | N4020 Compose + TLS on ikon |

See [docs/HOMELAB_API.md](docs/HOMELAB_API.md) and [docs/CLOUDFLARE_PAGES.md](docs/CLOUDFLARE_PAGES.md).

## Quick Start

### Using Docker Compose (local)

```bash
./start.sh
# Or: docker-compose up -d
```

### Local Development

```bash
./start-backend.sh
./start-frontend.sh   # separate terminal
```

## Features

- Portfolio showcase with outcomes, filters, and related projects
- Blog with categories, tags, comments, scheduled publish, and RSS/Atom
- Contact form with honeypot, throttles, and admin reply
- Newsletter subscribe / verify / unsubscribe; optional post announcements
- Testimonials (public approved list + invite-token submit)
- Resume API-backed content
- Analytics events (consent-aware) and admin dashboard
- Site preferences / notifications for the owner
- Admin UI routes under `/admin/*` on the frontend plus Django admin
- Responsive layout with light/dark theme
- SEO: meta tags, feeds, semantic HTML

## Testing

```bash
./run-tests.sh

cd gogir-labs-be && pytest
cd gogir-labs-fe && npm test
```

Do not treat hardcoded pass counts in older docs as current — run the suites above.

## Architecture

### Backend (Django / DRF)

- Django 4.2 + Django REST Framework
- PostgreSQL; Redis in Compose (homelab/prod)
- SimpleJWT (access + refresh, rotation + blacklist)
- CKEditor 5 for staff-authored HTML
- Public writes are narrow and throttled (see `.cursor/skills/backend-engineering/`)

### Frontend (Next.js)

- Next.js App Router + TypeScript + Tailwind
- React Query for data fetching
- Deployed with `@opennextjs/cloudflare` to Workers (not Pages + `next-on-pages`)

## Deployment

### Prerequisites

- Docker / Docker Compose (API host)
- Domain DNS for `api` and `www`
- TLS on the public edge (ikon for API; Cloudflare for www)
- Secrets only in gitignored env files or CI secrets

### Quick commands

```bash
# Homelab API (primary)
HOMELAB_HOST='user@api-host' HOMELAB_SSH_KEY=~/.ssh/key ./deploy-homelab.sh

# Classic same-host Compose
./deploy.sh staging
./deploy.sh production

# Frontend Worker (local one-shot)
cd gogir-labs-fe && NEXT_PUBLIC_API_URL=https://api.gogirlabs.uk/api/v1 npm run deploy
```

Details: [README_DEPLOYMENT.md](./README_DEPLOYMENT.md), [DEPLOYMENT.md](./DEPLOYMENT.md), [docs/HOMELAB_API.md](./docs/HOMELAB_API.md).

## CI/CD

- **CI** (`.github/workflows/ci.yml`): backend tests, frontend lint/type/tests, security scan
- **Code quality** (`.github/workflows/code-quality.yml`): black/isort/flake8, ESLint/Prettier
- **CD** (`.github/workflows/cd.yml`): build/push Docker images on `main` / `dev`
- **Frontend Workers** (`.github/workflows/frontend-cloudflare-workers.yml`): OpenNext deploy
- **Backend checks** (`.github/workflows/backend-cloudflare-setup.yml`): production config sanity

Homelab API deploys are manual (runners cannot reach the LAN host).

### Common Actions secrets

- `DOCKER_USERNAME` / `DOCKER_PASSWORD` — image publish
- `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` — Workers deploy
- Optional: `API_ALLOWED_HOSTS`, `CLOUDFLARE_PAGES_URL` for config checks

Never put live passwords, `SECRET_KEY`, or API tokens in the repo or markdown examples.

## Documentation

| Doc | Topic |
|-----|--------|
| [ENV_EXAMPLE.md](./ENV_EXAMPLE.md) | Environment variables |
| [docs/HOMELAB_API.md](./docs/HOMELAB_API.md) | Homelab API runbook |
| [docs/CLOUDFLARE_PAGES.md](./docs/CLOUDFLARE_PAGES.md) | Frontend Workers deploy |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Classic Compose deploy |
| [README_DEPLOYMENT.md](./README_DEPLOYMENT.md) | Short deploy cheat sheet |
| [TESTING.md](./TESTING.md) | Testing guide |
| [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) | Pre-deploy checklist |
| [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) | Content / admin guide |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | PR checks |

## Security

- TLS at the edge; Django `DEBUG=False` in production
- Security headers on nginx (ikon snippet)
- Rate limits on auth and public writes
- Honeypot fields on contact / newsletter
- JWT in `sessionStorage` on the client; Bearer on the API
- CORS / CSRF origins restricted to the real frontend hosts
- Secrets via environment only (see `.gitignore`)

## Project Structure

```
gogir_labs/
├── gogir-labs-be/             # Django API (the backend to run)
│   ├── apps/                  # blog, portfolio, contact, newsletter, …
│   ├── config/                # settings, urls, pagination
│   └── requirements.txt
├── gogir-labs-fe/             # Next.js frontend + wrangler / OpenNext (the frontend to run)
├── gogir_labs-fe/             # Partial components/portfolio tree only. Not the app
├── nginx/                     # Edge snippets (homelab API, etc.)
├── scripts/                   # Repo scripts
├── docs/                      # Homelab + Cloudflare runbooks
├── .github/workflows/         # CI/CD
├── docker-compose.yml         # Local
├── docker-compose.prod.yml    # Same-host production
├── docker-compose.homelab.yml # API on N4020
├── deploy.sh                  # Classic Compose deploy
└── deploy-homelab.sh          # Homelab API deploy
```

`untitled folder/` is empty. Do not put application code there.

## Development

### Backend

```bash
cd gogir-labs-be
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd gogir-labs-fe
npm install
npm run dev
```

## Environment Variables

See [ENV_EXAMPLE.md](./ENV_EXAMPLE.md). Templates:

- Local / Compose / Heroku / Workers: blocks in `ENV_EXAMPLE.md`
- Homelab: copy [`.env.homelab.example`](./.env.homelab.example) → `.env.homelab` (gitignored)

## Contributing

1. Create a feature branch
2. Make changes
3. Run `./run-tests.sh` and the checks in [CONTRIBUTING.md](./CONTRIBUTING.md)
4. Open a pull request

## License

[Your License Here]

## Author

Emmanuel Ugbaije - Software Engineer

## Acknowledgments

- Django REST Framework, Next.js, Tailwind CSS, and other open-source projects
