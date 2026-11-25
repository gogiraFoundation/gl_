# Unit fixtures for `seed_blog` tests

**Test data only** — not production essays.

- `tr_bot.md` — minimal allow-listed essay (slug `tr-bot`) with one markdown image.
- `urbana.md` — allow-listed essay with `<video poster>` / `<source src>` for HTML media rewrite tests.
- `_ignored.md` — must never seed.
- `README.md` — must never seed.

Production-like copies for lint / dry-run live under `../seed_essays_sample/`
(and on the server at `/mnt/data/blogs/project_essays`). Do not run
`seed_blog --refresh` or `blog_lint --write` against live essays from here.
