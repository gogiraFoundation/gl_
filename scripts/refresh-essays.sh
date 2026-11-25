#!/usr/bin/env bash
# Lint essay markdown (GL + Azagba via blog_lint config), optionally seed_blog --refresh.
# Does not publish posts.
#
# Safety: --write-lint defaults to blog_lint --diff (no file changes).
# Pass BLOG_LINT_APPLY=1 to actually --write (still only with --fix-uk if set).
# Always scopes GL essays via --roots so Azagba is not rewritten unintentionally
# when only GL seeding is intended — override with BLOG_LINT_ROOTS.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BE="$ROOT/gogir-labs-be"
LINT_DIR="${BLOG_LINT_DIR:-$HOME/.cursor/blog-lint}"
MODE="lint-only"
# Default lint roots for seed workflows: GL essays only
LINT_ROOTS="${BLOG_LINT_ROOTS:-gl-project-essays}"

usage() {
  cat <<'EOF'
Usage: ./scripts/refresh-essays.sh [--lint-only|--seed-dry-run|--seed] [--write-lint]

  --lint-only       Run blog_lint --check on configured roots (default)
  --write-lint      Dry-run diffs by default (blog_lint --diff --roots …).
                    Set BLOG_LINT_APPLY=1 to pass --write (still backs up).
                    Optional: BLOG_LINT_FIX_UK=1 to include --fix-uk.
  --seed-dry-run    Lint check (warnings OK), then manage.py seed_blog --dry-run
  --seed            Lint check (warnings OK), then manage.py seed_blog --refresh

Env:
  BLOG_LINT_DIR       Override blog-lint package dir
  BLOG_LINT_ROOTS     Space-separated --roots (default: gl-project-essays)
  BLOG_LINT_APPLY=1   Actually write when --write-lint is set
  BLOG_LINT_FIX_UK=1  Pass --fix-uk with write/diff
  SEED_SOURCE_DIR     Essay markdown directory for seed (default: /essays)

Requires essay mount at /essays inside the API environment for seed steps
(see docker-compose.homelab.yml).
EOF
}

WRITE_LINT=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --lint-only) MODE="lint-only" ;;
    --write-lint) WRITE_LINT=1 ;;
    --seed-dry-run) MODE="seed-dry-run" ;;
    --seed) MODE="seed" ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; usage; exit 2 ;;
  esac
  shift
done

if [[ ! -d "$LINT_DIR" ]]; then
  echo "blog_lint not found at $LINT_DIR" >&2
  exit 1
fi

# shellcheck disable=SC2206
ROOT_ARGS=(--roots $LINT_ROOTS)

lint_check() {
  # Warnings must not block seed-dry-run; only hard errors fail the script (set -e).
  (cd "$LINT_DIR" && python3 -m blog_lint --check "${ROOT_ARGS[@]}")
}

lint_write_or_diff() {
  local extra=()
  if [[ "${BLOG_LINT_FIX_UK:-0}" == "1" ]]; then
    extra+=(--fix-uk)
  fi
  if [[ "${BLOG_LINT_APPLY:-0}" == "1" ]]; then
    echo "==> blog_lint --write (BLOG_LINT_APPLY=1) roots=${LINT_ROOTS}"
    (cd "$LINT_DIR" && python3 -m blog_lint --write "${extra[@]}" "${ROOT_ARGS[@]}")
  else
    echo "==> blog_lint --diff (default for --write-lint; set BLOG_LINT_APPLY=1 to write)"
    (cd "$LINT_DIR" && python3 -m blog_lint --diff "${extra[@]}" "${ROOT_ARGS[@]}")
  fi
}

echo "==> blog_lint"
if [[ "$WRITE_LINT" -eq 1 ]]; then
  lint_write_or_diff
fi
lint_check

SEED_SOURCE="${SEED_SOURCE_DIR:-/essays}"

if [[ "$MODE" == "lint-only" ]]; then
  echo "==> done (lint only)"
  exit 0
fi

if [[ ! -d "$BE" ]]; then
  echo "Backend not found: $BE" >&2
  exit 1
fi

if [[ ! -d "$SEED_SOURCE" ]]; then
  echo "WARNING: Seed source missing: $SEED_SOURCE" >&2
  echo "On homelab API host this is usually /essays (mounted from /mnt/data/blogs/project_essays)." >&2
  echo "Set SEED_SOURCE_DIR to a local essay directory to dry-run." >&2
  # Missing root is a warning — do not block unrelated lint; but seed cannot run.
  exit 0
fi

cd "$BE"
if [[ "$MODE" == "seed-dry-run" ]]; then
  echo "==> seed_blog --dry-run --source-dir $SEED_SOURCE"
  python manage.py seed_blog --source-dir "$SEED_SOURCE" --dry-run
elif [[ "$MODE" == "seed" ]]; then
  echo "==> seed_blog --refresh --source-dir $SEED_SOURCE"
  python manage.py seed_blog --source-dir "$SEED_SOURCE" --refresh
fi

echo "==> done ($MODE). Publish remains a manual admin step."
