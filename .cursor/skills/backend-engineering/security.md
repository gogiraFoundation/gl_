# Security

## Who can call what

| Surface | Permission | Notes |
| --- | --- | --- |
| Public read (portfolio, blog, resume, search, site, approved testimonials) | `AllowAny` on that view | Still paginated |
| Public write (contact, comments, newsletter, analytics track, testimonial submit) | `AllowAny` plus a `throttle_scope` | Honeypot where the serializer already has `website` |
| Admin lists and mutations | `IsAdminUser` | Staff JWT |
| Notifications and preferences | `IsAuthenticated` | Match the existing viewset. Do not widen it to `AllowAny` |
| Token obtain, refresh, blacklist | `AllowAny` plus throttle scope `auth` | Blacklist does not require a prior access token; the refresh token is the credential |
| Schema and Swagger | `AllowAny` in `config/urls.py` | Docs are public. That does not make API handlers public |

A missing `permission_classes` inherits `IsAdminUser`. That is the safe default. Setting `AllowAny` on a view that returns inboxes, drafts, or subscriber lists is a bug.

Cross-user data is not a tenant problem. There is one site. Still do not return another person's draft, unapproved comment, or subscriber row on a public serializer.

## Authentication

SimpleJWT in `config/settings.py`:

- Access token lifetime 1 hour. Refresh 7 days. Rotation on, blacklist after rotation.
- Client stores tokens in `sessionStorage` (see the frontend architecture skill). The API accepts `Authorization: Bearer`.
- Do not put the access token in a query string, a log line, or an email body.
- Do not log the refresh token accepted by `/auth/token/blacklist/`.

Login responses are the SimpleJWT pair (`access`, `refresh`). Do not wrap them in a new envelope.

## Throttles

Rates live in `REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]`. Reuse a scope before adding one.

| Scope | Rate | Use |
| --- | --- | --- |
| `anon` | 120/minute | Default anonymous |
| `user` | 600/minute | Default authenticated |
| `auth` | 10/minute | Token obtain, refresh, blacklist |
| `contact` | 5/minute | Contact create |
| `newsletter_subscribe` | 5/minute | Subscribe |
| `newsletter_verify` | 30/minute | Verify link |
| `newsletter_unsubscribe` | 5/minute | Unsubscribe |
| `analytics_track` | 120/minute | Page views and events |
| `search` | 60/minute | Search |
| `comments` | 10/minute | Public comments |
| `views` | 30/minute | Post view increments |
| `testimonial_submit` | 5/minute | Invite submission |

Set `throttle_scope` on the view and `ScopedRateThrottle` when the sibling does. Do not raise a public write limit to make a test pass. Tests that need a quiet throttle use `config.test_auth`, which already overrides rates.

Auth responses must not reveal whether a username exists beyond what SimpleJWT already returns. Do not add a "user not found" branch with a different status.

## Public writes

- Contact and newsletter serializers treat `website` as a honeypot: write-only, rejected when filled, stripped when empty. Keep it off response serializers.
- Newsletter verify and unsubscribe tokens are credentials for that one subscriber action. Verification is POST only; GET does not look up or confirm the token. Repeat verification mail for an unverified address waits 15 minutes. Responses name the outcome for that address. They do not list other subscribers.
- Testimonial submit accepts only a valid invite token. A used or unknown token is a generic failure, not a roster.
- Analytics track accepts anonymous events. Do not attach the body to a log at info level. Do not require a JWT for the track endpoints that are already `AllowAny`.

## Uploads and HTML

CKEditor uploads use `CKEDITOR_5_FILE_UPLOAD_PERMISSION = "staff"`. Do not serve arbitrary upload paths as executable. Blog HTML rendered on the client is sanitized there; the API still stores staff-authored content, not anonymous HTML from a comment, unless the comment serializer already allows a plain string.

Prefer the ORM. If raw SQL is required, bind parameters. Never format user input into a query string.

## Logs and privacy

Log an event name and a record id. Do not log passwords, tokens, `Authorization`, or the full contact message body.

Newsletter addresses and contact emails are personal data. A delete or purge path must say what it removes and what it keeps (a sent announcement is not undone by unsubscribing). Do not add `user.delete()` as a shortcut for that.
