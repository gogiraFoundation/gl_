---
name: frontend-architecture
description: >-
  Place gogir-labs frontend changes in the existing Next.js layers: routes,
  the shared Axios client, React Query, and pure helpers. Use when adding a
  page, endpoint call, hook, cache update, admin gate, or when deciding where
  code belongs and how public and admin data flows.
---

# Frontend architecture

The site frontend lives in `gogir-labs-fe`. It is a Next.js App Router client of the Django API. Server state lives in TanStack Query. The public site and the admin area share one Axios client, `lib/api.ts`. The backend remains the authority for posts, projects, resume, contacts, and newsletter state.

`product-design` chooses the job and the reader. `ui-ux-layout` places the screen. `frontend-ui` builds the components. This skill chooses the layer, the cache key, and the trust boundary.

## Precedence

1. An existing query or helper that already owns the data
2. The boundaries in this skill
3. A new module only when no existing module can take the change

Read the matching reference before editing:

| Task | Read |
| --- | --- |
| Where a file goes, and what it may import | [boundaries.md](boundaries.md) |
| API client, query keys, cache, errors | [data.md](data.md) |
| Admin session and public routes | [auth-and-access.md](auth-and-access.md) |
| Check before finishing an architectural change | [architecture-review.md](architecture-review.md) |

## Request path

```
page (gogir-labs-fe/app)
  → view (gogir-labs-fe/components/<domain>)
    → useQuery / useMutation in the page or view
      → api from @/lib/api
        → NEXT_PUBLIC_API_URL or http://localhost:8000/api/v1
```

There is no BFF. Login posts to `/auth/token/` through `api` and stores the JWT in the browser. Data requests use the same client.

## Workflow

1. Name the source of truth. Lists, detail records, and admin stats come from the API. Derive a view-only value (reading time, a label) in `lib/` from data already fetched. Do not invent a third source.
2. Call `api` from a `useQuery` or `useMutation` next to the screen that needs it. Query keys are domain tuples, as in `['analytics', 'pageviews', days]` and the portfolio slug query. Extract a shared fetcher into `lib/` only when a second caller needs the same request.
3. Shape display copy in a pure function when the same shaping is used in more than one component. Pass the result in. Do not hide a fetch inside a presentational card.
4. After a mutation, invalidate the query keys that render the changed record. Do not call `invalidateQueries()` with no key.
5. Public pages stay public. Admin pages check for an access token and send a missing session to `/admin/login`.
6. Run [architecture-review.md](architecture-review.md).

## Hard rules

- Browser data calls use `api` from `@/lib/api`. Do not create a second Axios instance or call `localhost:8000` from a component.
- Django routes in this API use a trailing slash (`/contact/`, `/auth/token/`). Match the existing call.
- New admin token writes go to `sessionStorage` (`access_token`, `refresh_token`). The client still reads a legacy `localStorage` copy. Do not add a third store, and do not write new tokens to `localStorage`.
- `ThemeContext` may persist the theme. It does not persist session or content.
- Pure functions in `lib/` do not import React or `api`.
- `QueryClient` defaults are `staleTime: 60_000` and `refetchOnWindowFocus: false` in `app/providers.tsx`. Override `staleTime` only when the screen is wrong if it is a minute behind. Do not turn window-focus refetch back on for one query. Polling (`refetchInterval`) stays limited to admin stats that already poll.
- A stale JWT must not break public reads. The response interceptor already retries a 401 once with the Authorization header removed. Do not add a second refresh loop, and do not drop that retry.
