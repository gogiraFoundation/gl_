# Boundaries

Paths are relative to `gogir-labs-fe/`.

## Directory

| Path | Owns | Must not own |
| --- | --- | --- |
| `app/` | Routes, root layout, providers | Shared view models copied into every page |
| `app/admin/` | Authenticated owner tools | The public header and footer |
| `components/<domain>` | Views for one area (blog, portfolio, contact, newsletter, resume, admin) | A second HTTP client |
| `components/layout` | Public header, footer, nav | Page-specific fetches |
| `components/ui` | Shared visual pieces (chips, motion, breadcrumbs) | Domain rules |
| `lib/api.ts` | The Axios client, token attachment, 401 retry | JSX |
| `lib/` | Pure helpers (`formatDate`, `cn`, reading time, portfolio copy) | React components |
| `hooks/` | Cross-cutting client behavior (analytics events) | New endpoint URLs that only one page uses |
| `contexts/` | Theme and analytics consent wiring | A second copy of server data |

A page file may own its query when it is the only caller, as the portfolio and search pages do. Large presentational JSX belongs in `components/<domain>`, not inline once it is reused.

## Import direction

Allowed:

```
app → components, hooks, lib
components → hooks, lib, components/ui, components/layout
hooks → lib, contexts
lib (except api.ts) → other pure lib modules
```

Forbidden:

- `lib/` helpers other than `api.ts` importing a component or hook
- A new file creating its own Axios instance
- A circular import between a query and a pure helper. Fetch in the query. Pass fetched values into the helper.

## Adding a page

1. Add `app/<route>/page.tsx`.
2. Public pages render `Header` and `Footer` inside the page, matching portfolio and home. There is no shared `(public)` layout group.
3. Admin pages live under `app/admin/` and do not mount the public header.
4. Interactive pages that call `useQuery`, `useState`, or browser APIs are `'use client'`. A page that only renders static copy can stay a server component.

Do not add a route that only redirects unless an existing public URL already points at the old path.

## Adding an endpoint

1. Call `api.get` / `api.post` / `api.patch` / `api.delete` and return `response.data`.
2. Wrap reads in `useQuery` with a key that includes every input that changes the result (slug, filter, `days`).
3. Wrap writes in `useMutation` or the existing submit handler. On success, invalidate the keys the screen reads.
4. Map field errors onto the form. A non-field failure is a message on the form, not a swallowed `console.error` alone.
5. Add or extend a Jest test that mocks `@/lib/api` when the interaction is new.

## Types

API shapes used by one screen can live in that file, as the portfolio page does. A type shared by a query and a pure helper moves to `lib/` or a domain module next to both. Do not duplicate the same interface in two components.

Prefer a narrow prop over passing the whole payload into a card that renders two fields.
