"""
Management command to seed project essay markdown into blog posts.
"""

from pathlib import Path

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

from apps.blog.blog_seed import plan_essays, seed_blog

User = get_user_model()


class Command(BaseCommand):
    help = (
        "Seed Project Essays blog posts from a markdown directory "
        "(idempotent; skips existing slugs unless --refresh)"
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--source-dir",
            required=True,
            type=str,
            help="Directory containing essay *.md files",
        )
        parser.add_argument(
            "--author",
            type=str,
            default=None,
            help="Staff username for post authorship (default: first is_staff user)",
        )
        parser.add_argument(
            "--publish",
            action="store_true",
            help=(
                "Publish newly created posts via QuerySet.update "
                "(no admin notify / newsletter announcement)"
            ),
        )
        parser.add_argument(
            "--refresh",
            action="store_true",
            help=(
                "Re-import content and images for existing slugs "
                "(does not change published flag)"
            ),
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Parse and report planned creates/skips without writing",
        )

    def handle(self, *args, **options):
        source_dir = Path(options["source_dir"])
        if not source_dir.is_dir():
            raise CommandError(f"Source directory not found: {source_dir}")

        author = self._resolve_author(options.get("author"))

        if options["dry_run"]:
            planned = plan_essays(source_dir)
            to_create = [p for p in planned if not p["exists"]]
            to_skip = [p for p in planned if p["exists"]]
            mode = "refresh" if options["refresh"] else "skip"
            self.stdout.write(
                f"Dry run: {len(to_create)} would create, "
                f"{len(to_skip)} existing would {mode}, "
                f"{sum(p['image_refs'] for p in planned)} image refs "
                f"(author={author.get_username()})."
            )
            for item in to_create:
                self.stdout.write(
                    f"  + {item['slug']} ({item['filename']}, "
                    f"{item['image_refs']} images)"
                )
            for item in to_skip:
                mark = "~" if options["refresh"] else "="
                self.stdout.write(
                    f"  {mark} {item['slug']} "
                    f"({'refresh' if options['refresh'] else 'exists'}, "
                    f"{item['image_refs']} images)"
                )
            return

        result = seed_blog(
            source_dir=source_dir,
            author=author,
            publish=options["publish"],
            refresh=options["refresh"],
        )
        self.stdout.write(
            self.style.SUCCESS(
                "Blog seed complete: "
                f"{result['category_created']} categor"
                f"{'y' if result['category_created'] == 1 else 'ies'} created, "
                f"{result['created']} post"
                f"{'' if result['created'] == 1 else 's'} created, "
                f"{result['refreshed']} refreshed, "
                f"{result['skipped']} skipped, "
                f"{result['images_copied']} image"
                f"{'' if result['images_copied'] == 1 else 's'} copied."
            )
        )

    def _resolve_author(self, username: str | None):
        if username:
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist as exc:
                raise CommandError(f"User not found: {username}") from exc
            if not user.is_staff:
                raise CommandError(f"User is not staff: {username}")
            return user

        user = User.objects.filter(is_staff=True).order_by("id").first()
        if user is None:
            raise CommandError(
                "No staff user found. Create one with createsuperuser "
                "or pass --author USERNAME."
            )
        return user
