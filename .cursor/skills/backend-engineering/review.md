# Backend review

Run this before finishing a change that adds a route, a write, a permission, or a migration.

## Surface

- The view sets `permission_classes` on purpose. Public reads and the known public writes are `AllowAny`. Everything else stays `IsAdminUser` or the existing `IsAuthenticated`.
- A new public POST has a `throttle_scope` from [security.md](security.md), or a new rate with a reason.
- Honeypot `website` stays write-only and off the response.
- Staff-only fields (drafts, subscriber lists, contact bodies, analytics breakdowns) are absent from the public serializer.

## Contract

- Path is under `/api/v1/` and uses a trailing slash.
- Response shape matches the sibling. No new success envelope.
- A renamed or removed field is updated in `gogir-labs-fe` in the same change.
- 400/401/403/404 mean what the table in [http-and-data.md](http-and-data.md) says.

## Data

- Lists are paginated.
- The public queryset cannot see drafts or unapproved rows.
- Relations used by the serializer are selected or prefetched.
- Mail and admin notifications go through the existing services.
- Tokens and message bodies are not logged.

## Tests

- Happy path for the new behaviour.
- Validation failure.
- Anonymous call to an admin route is rejected.
- Honeypot or invite-token failure when that input exists.
- Pytest for the app passes.

## Done

A change is not done if an anonymous client can read the admin inbox, a retried subscribe creates a second subscriber, or a token appears in a log or a response it did not already belong in.
