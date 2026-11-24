---
name: backend-engineering
description: >-
  Gogir Labs backend standard for Django, DRF, and PostgreSQL. Use when
  implementing, reviewing, testing, or debugging code in gogir-labs-be:
  portfolio, blog, resume, contact, newsletter, testimonials, analytics,
  notifications, search, site, or config.
---

# Backend engineering

The API lives in `gogir-labs-be`. It is a single-owner Django site: public reads, a few public writes, and admin mutations behind JWT. There is no tenant, ledger, or partner portal.

`product-design` chooses what a visitor or the owner should be able to do. This skill chooses the layer, the permission, and the contract.

## Precedence

1. Existing production behaviour in the app you are touching
2. The serializer and permission already used by the sibling endpoint
3. This skill
4. Framework conventions

If two sources conflict, name the conflict and which one wins. Do not invent an app, an error envelope, or a permission class.

Read the matching reference before editing:

| Task | Read |
| --- | --- |
| Auth, public writes, throttles, secrets | [security.md](security.md) |
| URLs, pagination, queries, errors | [http-and-data.md](http-and-data.md) |
| Check before finishing | [review.md](review.md) |

## Layout

Settings: `config.settings`. Tests: `config.settings_test` via pytest-django. URLs mount at `/api/v1/` from `config/api_urls.py`.

| Prefix | App |
| --- | --- |
| `/api/v1/auth/token/` | SimpleJWT obtain, refresh, blacklist |
| `/api/v1/portfolio/` | portfolio |
| `/api/v1/blog/` | blog |
| `/api/v1/resume/` | resume |
| `/api/v1/testimonials/` | testimonials |
| `/api/v1/contact/` | contact |
| `/api/v1/newsletter/` | newsletter |
| `/api/v1/analytics/` | analytics |
| `/api/v1/notifications/` | notifications |
| `/api/v1/search/` | search |
| `/api/v1/site/` | site |

Django admin stays at `/admin/`. Schema is `/api/schema/`, docs at `/api/docs/` and `/api/redoc/`. Feeds are `/feed/` and `/feed/atom/`.

Celery and Redis are listed in `requirements.txt` and are not configured in `config/settings.py`. Do not add a worker, a broker, or a cache backend for one feature. Scheduled work that already exists is a management command (`publish_scheduled_posts`, `send_post_announcements`).

## Layers

```text
View → Serializer → Permission → Model
```

Mail and fan-out that already have a home go through `apps.notifications.services` or `apps.newsletter.services`. Do not grow a second email helper.

| Layer | Does | Does not |
| --- | --- | --- |
| View | HTTP, throttle scope, call serializer or an existing service | A second copy of validation |
| Serializer | Input and output, honeypot fields | Send mail as a side effect of `to_representation` |
| Permission | `AllowAny` or `IsAdminUser` (notifications: `IsAuthenticated`) | A new role matrix |
| Service | Multi-step work that already lives there (notify, send) | A new package for a one-model create |
| Model | Fields, constraints | Email inside `save()` |

A write that creates the row and then notifies admins follows `ContactMessageCreateView`: save in the view, then `NotificationService`. Keep that notification failure from being the only place the row can roll back unless the sibling already wraps both in `transaction.atomic`.

## Invariants

1. **Default deny.** `DEFAULT_PERMISSION_CLASSES` is `IsAdminUser`. A public route sets `AllowAny` on that view. Omitting it does not make the route public.
2. **Admin is `is_staff`.** Gate with `IsAdminUser`. Do not add `if user.role == "admin"`.
3. **Public writes stay narrow.** Contact, newsletter subscribe/verify/unsubscribe, analytics track, comments, search, and testimonial submit are the public mutations. New public POSTs need a throttle scope and a test.
4. **Tokens.** Never log, return in a list payload, or commit access tokens, refresh tokens, or newsletter/testimonial secrets. Logout blacklists the refresh token.
5. **Contract.** `/api/v1/` field names and status codes are stable. A breaking change needs the frontend caller updated in the same work.
6. **Secrets.** Settings come from the environment. Do not put passwords, `SECRET_KEY`, or API keys in a committed file.

## Tests

Apps keep `test_api.py` or `tests.py` next to the app. Use the existing `APIClient` style. For a new public write, cover the happy path, validation, the throttle scope's permission, and the honeypot when the serializer has one. For a new admin write, cover anonymous `401`/`403` and the staff happy path.

Run pytest from `gogir-labs-be` for the app you touched. Do not weaken an assertion to make a change pass.

## Agent safety

Do not invent models or endpoints without a requirement. Do not rename public fields, delete migrations, or upgrade a major dependency in a feature change. Prefer the smallest change that preserves the permission default.
