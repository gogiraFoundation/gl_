# Actors and scope

Design for one of two readers. Do not invent roles.

## Public visitor

No account. They use `Header` and `Footer`.

They can read home, portfolio, blog, about, resume, privacy, and search; send the contact form; subscribe, verify, and unsubscribe; submit a testimonial only when they hold that invite link.

They cannot see admin, tokens, contact inboxes, draft controls, or analytics.

Copy says "you" only inside a form or a subscribe flow. Marketing copy talks about the work, not about "my dashboard".

## Site owner

Signs in at `/admin/login`. The session is the JWT in `sessionStorage`.

They can use `/admin` and its tools: analytics, comments, contact, newsletter, notifications, preferences.

They still use the public site as a visitor when they are not in `/admin`. Do not add an "edit this page" control on the public project or post.

## What not to mix

| If the reader is | The screen must not |
| --- | --- |
| Visitor | Show unread message counts, tokens, or draft posts |
| Owner in admin | Use the public nav as the only way to reach an admin tool |
| Either | Offer a second login, a public signup, or a tenant switcher |

Newsletter verify and testimonial submit are visitor flows gated by the link token, not by the admin JWT. The page explains that one action. It does not reveal other subscribers or other invites.

## Permissions

There is no client permission map. The split is public route versus admin route. A missing admin token redirects to `/admin/login`. Do not show a disabled button labeled with a permission key.

Access denied copy says what is unavailable in plain language ("Sign in to open the dashboard"), not an HTTP status alone.
