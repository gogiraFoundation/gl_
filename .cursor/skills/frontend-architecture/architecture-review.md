# Architecture review

Run this before finishing a change that adds a request, a cache key, a route, or a new module.

## Layer

- The new fetch uses `api` from `@/lib/api`.
- Reads that the screen caches go through `useQuery`. Writes that change server state go through `useMutation` or the existing submit handler.
- A pure helper that formats data does not import React or `api`.
- Imports follow [boundaries.md](boundaries.md).
- No second Axios instance and no hard-coded backend host.

## Cache

- The query key includes the slug, filter, or `days` value that changes the payload.
- Invalidation names those keys. It does not wipe the whole cache.
- `enabled` is false until a required id is present.
- Public reads still survive a stale JWT because the 401 retry in `lib/api.ts` remains intact.

## Authority

- Fields the API returns are not recomputed into a conflicting number.
- A derived label (reading time, formatted date) uses `formatDate` or `calculateReadingTime` when that helper already fits.
- Django paths keep the trailing slash used by sibling calls.

## Access

- A new public page does not require a token.
- A new admin page redirects to `/admin/login` when the token is missing and on 401.
- New tokens are written to `sessionStorage` only.
- Tokens are not logged.

## Check

From `gogir-labs-fe`, `npm run type-check` passes for the files you touched. `npm test` covers the new interaction when behavior can break.
