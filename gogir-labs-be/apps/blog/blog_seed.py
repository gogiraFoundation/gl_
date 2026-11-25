"""
Idempotent seed of project essay markdown into unpublished blog posts.

Publish (when requested) uses QuerySet.update so Post.save does not notify
admins or enqueue PostAnnouncement when published flips to True.

Local `images/...` markdown and HTML refs are copied into MEDIA_ROOT/blog/essays/
and rewritten to public media URLs so the Next.js site can load them from the API host.
"""

from __future__ import annotations

import hashlib
import logging
import re
import shutil
from pathlib import Path

import markdown
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser
from django.core.files import File
from django.db import transaction
from django.utils import timezone
from django.utils.text import slugify

from .models import Category, Post

logger = logging.getLogger(__name__)

CATEGORY_NAME = "Project Essays"
CATEGORY_SLUG = "project-essays"
CATEGORY_DESCRIPTION = "Project essays and write-ups"

# Hard allow-list: only these filenames seed. Unknown *.md are skipped (blocks
# hold-backs such as a Bria essay from leaking via folder contents).
ESSAY_SLUG_MAP: dict[str, str] = {
    "00-about-the-author.md": "about-the-author",
    "00-introduction.md": "introduction",
    "afri.md": "afri",
    "gogir-labs.md": "gogir-labs",
    "traq-frontend.md": "traq-frontend",
    "traqhq.md": "traqhq",
    "tr_bot.md": "tr-bot",
    "uk-energy-eff.md": "uk-energy-eff",
    "uk-re-market-intel.md": "uk-re-market-intel",
    "urbana.md": "urbana",
}
ESSAY_ALLOW_LIST: frozenset[str] = frozenset(ESSAY_SLUG_MAP.keys())
ALLOWED_ESSAY_SLUGS: frozenset[str] = frozenset(ESSAY_SLUG_MAP.values())

# Display order for "Next essay" and home lists (introduction first; bio is About).
ESSAY_LIST_ORDER: tuple[str, ...] = (
    "introduction",
    "tr-bot",
    "traqhq",
    "traq-frontend",
    "urbana",
    "gogir-labs",
    "afri",
    "uk-energy-eff",
    "uk-re-market-intel",
)

MARKDOWN_EXTENSIONS = ["fenced_code", "tables", "nl2br", "sane_lists"]
EXCERPT_MAX = 300
MEDIA_ESSAY_PREFIX = Path("blog/essays")

# ![alt](images/project/file.png) — relative paths only
_MD_IMAGE_RE = re.compile(
    r"!\[([^\]]*)\]\((images/[^)\s]+)\)",
)

# HTML media under images/: <img src>, <source src>, <video poster>
_HTML_MEDIA_RE = re.compile(
    r"(?P<prefix><(?P<tag>img|source|video)\b[^>]*?\b(?P<attr>src|poster)\s*=\s*[\"'])"
    r"(?P<path>images/[^\"']+)"
    r"(?P<suffix>[\"'])",
    re.IGNORECASE,
)


def discover_essay_paths(source_dir: Path) -> list[Path]:
    """Allow-listed *.md only; non-recursive; skip README, _-prefixed names, hidden."""
    paths: list[Path] = []
    for path in sorted(source_dir.glob("*.md")):
        name = path.name
        if name == "README.md" or name.startswith("_") or name.startswith("."):
            continue
        if name not in ESSAY_ALLOW_LIST:
            logger.info("Skipping essay outside allow-list: %s", path.name)
            continue
        paths.append(path)
    return paths


def slug_for_filename(filename: str) -> str:
    if filename in ESSAY_SLUG_MAP:
        return ESSAY_SLUG_MAP[filename]
    # Unlisted files never reach seed; keep a deterministic fallback for tests.
    stem = Path(filename).stem
    return slugify(stem.replace("_", "-")) or slugify(stem)


def public_post_visibility_q():
    """
    Public reads: any non–project-essay post, or a project essay whose slug is
    on the hard allow-list. Import lazily so callers need django.db.models.Q.
    """
    from django.db.models import Q

    return ~Q(category__slug=CATEGORY_SLUG) | Q(
        category__slug=CATEGORY_SLUG, slug__in=ALLOWED_ESSAY_SLUGS
    )


def parse_essay(raw: str, filename: str) -> dict[str, str]:
    """Extract title, body markdown (H1 stripped), and excerpt from raw markdown."""
    lines = raw.splitlines()
    title = None
    body_start = 0
    for i, line in enumerate(lines):
        if line.startswith("# "):
            title = line[2:].strip()
            body_start = i + 1
            break

    if not title:
        title = Path(filename).stem.replace("-", " ").replace("_", " ").title()

    body_md = "\n".join(lines[body_start:]).lstrip("\n")
    excerpt = _excerpt_from_markdown(body_md or raw)
    return {
        "title": title[:200],
        "body_md": body_md,
        "excerpt": excerpt[:EXCERPT_MAX],
    }


def _excerpt_from_markdown(md: str) -> str:
    """First non-empty paragraph as plain text, capped at EXCERPT_MAX."""
    text = re.sub(r"```[\s\S]*?```", " ", md)
    text = re.sub(r"`[^`]+`", " ", text)
    text = re.sub(r"!\[([^\]]*)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"^#{1,6}\s+.*$", "", text, flags=re.MULTILINE)
    text = re.sub(r"^[-*+]\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return "Project essay."
    if len(text) <= EXCERPT_MAX:
        return text
    return text[: EXCERPT_MAX - 1].rstrip() + "…"


def markdown_to_html(body_md: str) -> str:
    return markdown.markdown(body_md, extensions=MARKDOWN_EXTENSIONS)


def _infer_api_origin() -> str:
    explicit = getattr(settings, "PUBLIC_API_ORIGIN", "") or ""
    if explicit:
        return explicit.rstrip("/")
    for host in getattr(settings, "ALLOWED_HOSTS", []) or []:
        if not host or host.startswith(".") or "*" in host:
            continue
        if host in ("localhost", "127.0.0.1") or host.replace(".", "").isdigit():
            continue
        if host.startswith("api.") or ".api." in host:
            return f"https://{host}"
    for host in getattr(settings, "ALLOWED_HOSTS", []) or []:
        if host and not host.startswith(".") and "*" not in host:
            if (
                host not in ("localhost", "127.0.0.1")
                and not host.replace(".", "").isdigit()
            ):
                return f"https://{host}"
    return ""


def public_media_url(media_relative: str) -> str:
    """Build a URL for a path under MEDIA_ROOT (posix, no leading slash on relative)."""
    media_url = settings.MEDIA_URL or "/media/"
    path = media_url.rstrip("/") + "/" + media_relative.lstrip("/")
    origin = _infer_api_origin()
    if origin:
        return origin + path
    return path


def _file_sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def _copy_image_if_needed(src: Path, dest: Path) -> bool:
    """Copy src→dest when missing or content hash differs. Returns True if copied."""
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.is_file() and _file_sha256(dest) == _file_sha256(src):
        return False
    shutil.copy2(src, dest)
    return True


def rewrite_and_copy_images(
    source_dir: Path, body_md: str
) -> tuple[str, int, Path | None]:
    """
    Copy local images/ refs into MEDIA_ROOT/blog/essays/ and rewrite markdown + HTML URLs.

    Returns (rewritten_markdown, images_copied, preferred_featured_source_path).
    """
    source_dir = source_dir.resolve()
    images_root = (source_dir / "images").resolve()
    media_root = Path(settings.MEDIA_ROOT)
    copied = 0
    featured_source: Path | None = None
    hero_source: Path | None = None

    def materialise(rel: str) -> str | None:
        """Copy images/… → media; return public URL or None to leave unchanged."""
        nonlocal copied, featured_source, hero_source
        src = (source_dir / rel).resolve()
        try:
            src.relative_to(images_root)
        except ValueError:
            logger.warning("Skipping image outside images/: %s", rel)
            return None
        if not src.is_file():
            logger.warning("Missing essay image: %s", src)
            return None

        under = Path(*Path(rel).parts[1:])  # drop leading images/
        dest_rel = MEDIA_ESSAY_PREFIX / under
        dest = media_root / dest_rel
        try:
            if _copy_image_if_needed(src, dest):
                copied += 1
        except PermissionError as exc:
            raise PermissionError(
                f"Cannot write essay images under {media_root} ({exc}). "
                "On homelab, ensure /app/media is writable by uid 1000 "
                "(bind-mount /mnt/data/apps/gogirlabs/media, or: "
                "docker compose exec -u root backend chown -R 1000:1000 /app/media)."
            ) from exc
        if featured_source is None:
            featured_source = src
        if src.name.lower() in ("hero.png", "hero.jpg", "hero.jpeg", "hero.webp"):
            hero_source = src
        return public_media_url(dest_rel.as_posix())

    def replace_md(match: re.Match[str]) -> str:
        alt = match.group(1)
        rel = match.group(2)
        url = materialise(rel)
        if url is None:
            return match.group(0)
        return f"![{alt}]({url})"

    def replace_html(match: re.Match[str]) -> str:
        rel = match.group("path")
        url = materialise(rel)
        if url is None:
            return match.group(0)
        return f"{match.group('prefix')}{url}{match.group('suffix')}"

    rewritten = _MD_IMAGE_RE.sub(replace_md, body_md)
    rewritten = _HTML_MEDIA_RE.sub(replace_html, rewritten)
    return rewritten, copied, hero_source or featured_source


def _featured_image_unchanged(post: Post, source_path: Path) -> bool:
    """True when post already has a featured image whose bytes match source."""
    if not post.featured_image:
        return False
    try:
        current = Path(post.featured_image.path)
    except (ValueError, NotImplementedError):
        return False
    if not current.is_file():
        return False
    try:
        return _file_sha256(current) == _file_sha256(source_path)
    except OSError:
        return False


def _assign_featured_image(post: Post, source_path: Path | None) -> bool:
    """Save featured image only when source is new or content hash changed."""
    if source_path is None or not source_path.is_file():
        return False
    if _featured_image_unchanged(post, source_path):
        return False
    with source_path.open("rb") as fh:
        post.featured_image.save(source_path.name, File(fh), save=False)
    return True


def _fill_meta_if_empty(post: Post, title: str, excerpt: str) -> None:
    """Only populate SEO fields when blank — never overwrite hand edits."""
    if not (post.meta_title or "").strip():
        post.meta_title = title
    if not (post.meta_description or "").strip():
        post.meta_description = excerpt


def build_essay_payload(source_dir: Path, path: Path) -> dict:
    """Parse one essay file into create/update field values."""
    raw = path.read_text(encoding="utf-8")
    parsed = parse_essay(raw, path.name)
    body_md, images_copied, featured_src = rewrite_and_copy_images(
        source_dir, parsed["body_md"]
    )
    html = markdown_to_html(body_md)
    return {
        "slug": slug_for_filename(path.name),
        "filename": path.name,
        "title": parsed["title"],
        "excerpt": parsed["excerpt"],
        "content": html,
        "featured_source": featured_src,
        "images_copied": images_copied,
    }


def count_media_refs(body_md: str) -> int:
    md = len(_MD_IMAGE_RE.findall(body_md))
    html = len(_HTML_MEDIA_RE.findall(body_md))
    return md + html


def plan_essays(source_dir: Path) -> list[dict]:
    """Parse essays and return planned create/update payloads (no image copy)."""
    planned: list[dict] = []
    for path in discover_essay_paths(source_dir):
        raw = path.read_text(encoding="utf-8")
        parsed = parse_essay(raw, path.name)
        slug = slug_for_filename(path.name)
        existing = Post.objects.filter(slug=slug).first()
        planned.append(
            {
                "filename": path.name,
                "slug": slug,
                "title": parsed["title"],
                "excerpt": parsed["excerpt"],
                "image_refs": count_media_refs(parsed["body_md"]),
                "exists": existing is not None,
                "published": bool(existing.published) if existing else False,
            }
        )
    return planned


def seed_blog(
    *,
    source_dir: Path,
    author: AbstractBaseUser,
    publish: bool = False,
    refresh: bool = False,
    update_published: bool = False,
) -> dict:
    """
    Create missing Project Essays posts from markdown. Returns counts.

    Existing slugs are skipped unless refresh=True (then content/images updated;
    published flag is left unchanged). Published posts are never refreshed unless
    update_published=True. When publish is True, newly created rows are published
    via QuerySet.update.
    """
    source_dir = Path(source_dir)
    if not source_dir.is_dir():
        raise FileNotFoundError(f"Source directory not found: {source_dir}")

    created = 0
    skipped = 0
    refreshed = 0
    skipped_published = 0
    category_created = 0
    images_copied = 0
    newly_created_ids: list[int] = []

    with transaction.atomic():
        category, cat_created = Category.objects.get_or_create(
            slug=CATEGORY_SLUG,
            defaults={
                "name": CATEGORY_NAME,
                "description": CATEGORY_DESCRIPTION,
            },
        )
        if cat_created:
            category_created = 1

        for path in discover_essay_paths(source_dir):
            payload = build_essay_payload(source_dir, path)
            images_copied += payload["images_copied"]
            slug = payload["slug"]

            existing = Post.objects.filter(slug=slug).first()
            if existing is not None:
                if not refresh:
                    skipped += 1
                    continue
                if existing.published and not update_published:
                    skipped_published += 1
                    logger.info(
                        "Skipping published post %s (pass --update-published to refresh)",
                        slug,
                    )
                    continue
                existing.title = payload["title"]
                existing.excerpt = payload["excerpt"]
                existing.content = payload["content"]
                _fill_meta_if_empty(existing, payload["title"], payload["excerpt"])
                if existing.category_id is None:
                    existing.category = category
                _assign_featured_image(existing, payload["featured_source"])
                # save() is safe: published flag unchanged so no notify/announcement.
                existing.save()
                refreshed += 1
                continue

            post = Post(
                slug=slug,
                title=payload["title"],
                author=author,
                excerpt=payload["excerpt"],
                content=payload["content"],
                category=category,
                published=False,
                featured=False,
                meta_title=payload["title"],
                meta_description=payload["excerpt"],
            )
            _assign_featured_image(post, payload["featured_source"])
            post.save()
            created += 1
            newly_created_ids.append(post.pk)

        # QuerySet.update skips Post.save(), so no admin notify / announcement.
        if publish and newly_created_ids:
            Post.objects.filter(pk__in=newly_created_ids).update(
                published=True,
                published_at=timezone.now(),
            )

    return {
        "created": created,
        "skipped": skipped,
        "refreshed": refreshed,
        "skipped_published": skipped_published,
        "category_created": category_created,
        "images_copied": images_copied,
    }
