# Auth and access

## Two audiences

The public site has no login. Anyone can read the portfolio, blog, resume, and about pages, send the contact form, and subscribe to the newsletter.

The admin area is the site owner. Login is `app/admin/login/page.tsx`.

| Action | Path |
| --- | --- |
| Login | `POST /auth/token/` with username and password. Store `access` and `refresh` in `sessionStorage`. |
| Refresh | On 401, `lib/api.ts` posts `/auth/token/refresh/`, persists the new `access` (and rotated `refresh` when returned), then retries once. |
| Logout | `POST /auth/token/blacklist/` with the refresh token, then remove both tokens from `sessionStorage` and `localStorage`, then go to `/admin/login`. |
| Authenticated calls | `api` attaches `Authorization` from storage. |

`sessionStorage` is the write path. `localStorage` is only the legacy read fallback inside `lib/api.ts` and the logout clear. Do not write tokens to `localStorage` from a new screen. Do not put the access token in a cookie, a query string, or a log.

There is no dev-auth bypass. Do not add one.

## Route guard

Admin pages check for a token in an effect and `router.push('/admin/login')` when it is missing, as `app/admin/preferences/page.tsx` does. A 401 from an admin query also returns the owner to `/admin/login`.

While that check has not finished, do not flash private counts. Public pages never run this redirect.

Hiding a link is not a substitute for the check on the admin page itself.

## What stays public

These routes do not require a token: `/`, `/portfolio`, `/blog`, `/about`, `/resume`, `/contact`, `/search`, `/testimonials`, `/privacy`, and `/newsletter/*`. `/login` only redirects to `/admin/login`.

Newsletter verify and unsubscribe use the token in the URL for that subscriber action. That token is not the admin JWT. Do not send it as `Authorization`.

## Admin

Admin screens live under `/admin` (dashboard, analytics, comments, contact, newsletter, notifications, preferences). Do not add owner-only actions to a public page with a hidden control.

Do not log the access token or the refresh token.
