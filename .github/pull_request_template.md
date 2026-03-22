## Summary

<!-- What changed and why (1–3 sentences) -->

## Checklist

- [ ] Frontend: `npm run lint` and `npx prettier --check .` run clean in `gogir-labs-fe/` (or equivalent)
- [ ] Backend (if touched): `black --check .` and `isort --check-only .` in `gogir-labs-be/`
- [ ] If **`lib/api.ts`** changed: confirmed interceptors (JWT / 401 retry) behave as intended for both public pages and admin
- [ ] If **Cloudflare / backend CI workflow** changed: aware that missing GitHub secrets use **CI placeholders** — production still needs real env vars on the host

## Risk / rollout

<!-- Optional: deployment notes, feature flags, migrations -->
