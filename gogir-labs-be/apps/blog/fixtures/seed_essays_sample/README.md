# Sample / snapshot essays (lint & dry-run)

These markdown files are **near-production snapshots** for `blog_lint` fallback
roots and local `--seed-dry-run` against `SEED_SOURCE_DIR=…/seed_essays_sample`.

They are **not** the Django unit-test corpus. Unit tests use
`../seed_essays_unit/` (minimal, stable titles and image paths).

## Safety

- Do **not** treat edits here as a substitute for `/mnt/data/blogs/project_essays`.
- Do **not** run `blog_lint --write` or `seed_blog --refresh` against live essays
  until fixtures pass.
- `_`-prefixed folders (`_on_hold`, `_backup`) and files are skipped by seed/lint.
- Bria and other names outside `ESSAY_ALLOW_LIST` must never seed.

## Refreshing from the server

When `/mnt/data/blogs/project_essays` is mounted, copy allow-listed `*.md` and
needed `images/` trees into this directory, then re-run blog_lint `--check`
and `seed_blog --dry-run` only.
