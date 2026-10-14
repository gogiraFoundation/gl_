# Product review

Run this before finishing a feature that changes what a visitor or the owner can see or do. Layout checks stay in `ui-ux-layout`.

## Job

- One sentence names the reader, the decision, and the outcome.
- The primary action is that decision's verb.
- The destination already exists, or the new surface has a reason no current destination can carry the job.

## Principles

- The first screen answers the job without an admin control.
- The work or the writing comes before biography and before newsletter.
- A public claim opens a project, a post, or a named outcome.
- Owner actions stay under `/admin`.

## Access

- Public pages work with no token.
- Admin pages redirect to `/admin/login` when the session is missing.
- Newsletter and testimonial links act on that token only. They do not list other people.
- Copy does not print a token, a permission key, or a status code as the message.

## Claims

- Each public number opens the set it counts, or sits next to the outcome it describes.
- Loading does not show a fake zero.
- Copy does not say "live", "compliant", or "AI-powered" unless the page names the actual system.
- A failed section keeps the sections that loaded.

## Consequence

- Delete, purge, and send actions name the object.
- A successful form leaves the new state visible on the surface.
- Analytics events follow the existing consent path. A new event does not fire around the banner.

## Handoff

When the decisions above hold, implement the structure with `ui-ux-layout` and the components with `frontend-ui`.
