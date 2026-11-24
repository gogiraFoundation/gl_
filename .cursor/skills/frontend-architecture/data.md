# Data

## One client

`lib/api.ts` creates the Axios instance.

- `baseURL` is `NEXT_PUBLIC_API_URL` or `http://localhost:8000/api/v1`.
- `withCredentials: true`.
- Browser calls go to that base. Do not point a component at a hard-coded host.
- Do not add a Next.js rewrite for data. Auth and content both use `api`.

## Headers the client already sets

| Header | When |
| --- | --- |
| `Authorization: Bearer` | `access_token` is in `sessionStorage`, else the legacy `localStorage` key |

Do not set `Authorization` again at the call site. Public requests still send the header when a token happens to be stored. The 401 interceptor clears both stores and retries that request once without the header so portfolio, blog, and search keep working.

## Query keys

Include the resource and the inputs. Examples already in use:

| Key | Data |
| --- | --- |
| `['analytics', 'pageviews', days]` | Admin page-view stats |
| `['analytics', 'events', days]` | Admin event stats |
| `['notifications', 'stats']` | Admin notification counts |

`enabled` must be false while a required id or slug is missing. Do not fetch with an empty slug.

`QueryClient` in `app/providers.tsx` uses `staleTime: 60_000` and `refetchOnWindowFocus: false`. Notification stats already poll every 30 seconds. A new poll needs the same kind of reason: the number goes stale while the owner is watching that screen.

## Invalidation

Invalidate the narrowest key that is still correct.

- A changed post invalidates the post list and that slug.
- A changed project invalidates the project list and that slug.
- An admin reply or preference save invalidates the list the admin screen is showing.

Do not `invalidateQueries()` with no filter. Optimistic updates, if added, are followed by invalidation so the server stays the authority.

## Errors

- Network and HTTP failures stay as thrown Axios errors from the query or mutation.
- Show the form's own error state for a failed submit, as `ContactForm` does with `submitStatus`.
- One failed admin widget does not blank the widgets whose queries succeeded.
- Do not log tokens, refresh tokens, or the `Authorization` header.

## Tests and live API

Tests mock `@/lib/api`. They do not call the Django process. A new request the test triggers must be on the mock, or the assertion is about the UI state rather than a real response.
