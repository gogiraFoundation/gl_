"""Tests for idempotent blog essay seeding."""

import shutil
import tempfile
from pathlib import Path
from unittest.mock import patch

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import TestCase, override_settings

from apps.blog.blog_seed import (
    CATEGORY_NAME,
    CATEGORY_SLUG,
    EXCERPT_MAX,
    plan_essays,
    seed_blog,
)
from apps.blog.models import Category, Post
from apps.newsletter.models import PostAnnouncement

User = get_user_model()

FIXTURE_DIR = Path(__file__).resolve().parent / "fixtures" / "seed_essays_unit"
_MEDIA_TMP = tempfile.mkdtemp(prefix="blog_seed_media_")


@override_settings(
    PUBLIC_API_ORIGIN="https://api.example.test",
    MEDIA_ROOT=_MEDIA_TMP,
)
class SeedBlogTest(TestCase):
    def setUp(self):
        media = Path(settings.MEDIA_ROOT)
        if media.exists():
            shutil.rmtree(media)
        media.mkdir(parents=True, exist_ok=True)
        self.author = User.objects.create_user(
            username="staffuser", password="testpass", is_staff=True
        )

    @patch("apps.notifications.services.NotificationService.notify_admins")
    def test_seed_creates_unpublished_post(self, mock_notify):
        result = seed_blog(source_dir=FIXTURE_DIR, author=self.author)

        self.assertEqual(result["created"], 2)
        self.assertEqual(result["skipped"], 0)
        self.assertEqual(result["refreshed"], 0)
        self.assertEqual(result["category_created"], 1)
        self.assertGreaterEqual(result["images_copied"], 1)
        self.assertEqual(Post.objects.count(), 2)

        post = Post.objects.get(slug="tr-bot")
        self.assertEqual(post.title, "Sample Essay Title")
        self.assertFalse(post.published)
        self.assertIsNone(post.published_at)
        self.assertFalse(post.featured)
        self.assertEqual(post.author, self.author)
        self.assertLessEqual(len(post.excerpt), EXCERPT_MAX)
        self.assertIn("first paragraph", post.excerpt.lower())
        self.assertIn("<h2>", post.content)
        self.assertIn("<code>", post.content)
        self.assertIn("print", post.content)
        self.assertIn(
            "https://api.example.test/media/blog/essays/sample/hero.png",
            post.content,
        )
        self.assertTrue(bool(post.featured_image))
        self.assertIn("hero", post.featured_image.name)

        category = Category.objects.get(slug=CATEGORY_SLUG)
        self.assertEqual(category.name, CATEGORY_NAME)
        self.assertEqual(post.category, category)
        mock_notify.assert_not_called()
        self.assertEqual(PostAnnouncement.objects.count(), 0)

    @patch("apps.notifications.services.NotificationService.notify_admins")
    def test_seed_rewrites_html_video_media(self, mock_notify):
        seed_blog(source_dir=FIXTURE_DIR, author=self.author)
        urbana = Post.objects.get(slug="urbana")
        self.assertIn(
            "https://api.example.test/media/blog/essays/urbana/poster.png",
            urbana.content,
        )
        self.assertIn(
            "https://api.example.test/media/blog/essays/urbana/clip.webm",
            urbana.content,
        )
        self.assertIn(
            "https://api.example.test/media/blog/essays/urbana/clip.mp4",
            urbana.content,
        )
        self.assertNotIn('poster="images/', urbana.content)
        self.assertNotIn('src="images/', urbana.content)
        mock_notify.assert_not_called()

    @patch("apps.notifications.services.NotificationService.notify_admins")
    def test_seed_skips_readme_and_underscore_files(self, mock_notify):
        seed_blog(source_dir=FIXTURE_DIR, author=self.author)

        slugs = set(Post.objects.values_list("slug", flat=True))
        self.assertEqual(slugs, {"tr-bot", "urbana"})
        self.assertFalse(Post.objects.filter(title="Ignored").exists())
        mock_notify.assert_not_called()

    @patch("apps.notifications.services.NotificationService.notify_admins")
    def test_seed_skips_unlisted_markdown(self, mock_notify):
        unlisted = FIXTURE_DIR / "bria.md"
        unlisted.write_text("# Bria Hold\n\nShould not seed.\n", encoding="utf-8")
        try:
            seed_blog(source_dir=FIXTURE_DIR, author=self.author)
            slugs = set(Post.objects.values_list("slug", flat=True))
            self.assertEqual(slugs, {"tr-bot", "urbana"})
            self.assertFalse(Post.objects.filter(slug="bria").exists())
            mock_notify.assert_not_called()
        finally:
            unlisted.unlink(missing_ok=True)

    @patch("apps.notifications.services.NotificationService.notify_admins")
    def test_seed_second_run_does_not_overwrite(self, mock_notify):
        seed_blog(source_dir=FIXTURE_DIR, author=self.author)
        Post.objects.filter(slug="tr-bot").update(excerpt="Edited by admin")
        mock_notify.reset_mock()

        result = seed_blog(source_dir=FIXTURE_DIR, author=self.author)

        self.assertEqual(result["created"], 0)
        self.assertEqual(result["skipped"], 2)
        self.assertEqual(result["refreshed"], 0)
        post = Post.objects.get(slug="tr-bot")
        self.assertEqual(post.excerpt, "Edited by admin")
        mock_notify.assert_not_called()

    @patch("apps.notifications.services.NotificationService.notify_admins")
    def test_seed_refresh_rewrites_images_without_notify(self, mock_notify):
        seed_blog(source_dir=FIXTURE_DIR, author=self.author)
        Post.objects.filter(slug="tr-bot").update(
            content='<p><img src="images/sample/hero.png" /></p>',
            excerpt="stale",
        )
        mock_notify.reset_mock()

        result = seed_blog(source_dir=FIXTURE_DIR, author=self.author, refresh=True)

        self.assertEqual(result["created"], 0)
        self.assertEqual(result["skipped"], 0)
        self.assertEqual(result["refreshed"], 2)
        self.assertGreaterEqual(result["images_copied"], 0)
        post = Post.objects.get(slug="tr-bot")
        self.assertIn(
            "https://api.example.test/media/blog/essays/sample/hero.png",
            post.content,
        )
        self.assertNotIn('src="images/', post.content)
        self.assertNotEqual(post.excerpt, "stale")
        mock_notify.assert_not_called()
        self.assertEqual(PostAnnouncement.objects.count(), 0)

    @patch("apps.notifications.services.NotificationService.notify_admins")
    def test_refresh_skips_published_without_flag(self, mock_notify):
        seed_blog(source_dir=FIXTURE_DIR, author=self.author, publish=True)
        Post.objects.filter(slug="tr-bot").update(excerpt="live excerpt")
        mock_notify.reset_mock()

        result = seed_blog(source_dir=FIXTURE_DIR, author=self.author, refresh=True)

        self.assertEqual(result["skipped_published"], 2)
        self.assertEqual(result["refreshed"], 0)
        self.assertEqual(Post.objects.get(slug="tr-bot").excerpt, "live excerpt")
        mock_notify.assert_not_called()

    @patch("apps.notifications.services.NotificationService.notify_admins")
    def test_refresh_published_with_explicit_flag(self, mock_notify):
        seed_blog(source_dir=FIXTURE_DIR, author=self.author, publish=True)
        Post.objects.filter(slug="tr-bot").update(excerpt="live excerpt")
        mock_notify.reset_mock()

        result = seed_blog(
            source_dir=FIXTURE_DIR,
            author=self.author,
            refresh=True,
            update_published=True,
        )

        self.assertEqual(result["refreshed"], 2)
        self.assertEqual(result["skipped_published"], 0)
        self.assertNotEqual(Post.objects.get(slug="tr-bot").excerpt, "live excerpt")
        mock_notify.assert_not_called()

    @patch("apps.notifications.services.NotificationService.notify_admins")
    def test_refresh_preserves_hand_edited_meta(self, mock_notify):
        seed_blog(source_dir=FIXTURE_DIR, author=self.author)
        Post.objects.filter(slug="tr-bot").update(
            meta_title="Hand SEO Title",
            meta_description="Hand SEO description",
        )
        result = seed_blog(source_dir=FIXTURE_DIR, author=self.author, refresh=True)
        self.assertEqual(result["refreshed"], 2)
        post = Post.objects.get(slug="tr-bot")
        self.assertEqual(post.meta_title, "Hand SEO Title")
        self.assertEqual(post.meta_description, "Hand SEO description")

    @patch("apps.notifications.services.NotificationService.notify_admins")
    def test_featured_image_skipped_when_hash_unchanged(self, mock_notify):
        seed_blog(source_dir=FIXTURE_DIR, author=self.author)
        post = Post.objects.get(slug="tr-bot")
        first_name = post.featured_image.name
        result = seed_blog(source_dir=FIXTURE_DIR, author=self.author, refresh=True)
        post.refresh_from_db()
        self.assertEqual(result["refreshed"], 2)
        self.assertEqual(post.featured_image.name, first_name)

    @patch("apps.notifications.services.NotificationService.notify_admins")
    def test_seed_publish_uses_update_without_side_effects(self, mock_notify):
        result = seed_blog(source_dir=FIXTURE_DIR, author=self.author, publish=True)

        self.assertEqual(result["created"], 2)
        post = Post.objects.get(slug="tr-bot")
        self.assertTrue(post.published)
        self.assertIsNotNone(post.published_at)
        mock_notify.assert_not_called()
        self.assertEqual(PostAnnouncement.objects.count(), 0)

    def test_plan_essays_marks_existing_and_published(self):
        seed_blog(source_dir=FIXTURE_DIR, author=self.author, publish=True)
        planned = plan_essays(FIXTURE_DIR)
        self.assertEqual(len(planned), 2)
        by_slug = {p["slug"]: p for p in planned}
        self.assertTrue(by_slug["tr-bot"]["exists"])
        self.assertTrue(by_slug["tr-bot"]["published"])
        self.assertEqual(by_slug["tr-bot"]["image_refs"], 1)
        self.assertGreaterEqual(by_slug["urbana"]["image_refs"], 3)

    def test_command_dry_run_lists_published_without_writing(self):
        seed_blog(source_dir=FIXTURE_DIR, author=self.author, publish=True)
        from io import StringIO

        out = StringIO()
        call_command(
            "seed_blog",
            "--source-dir",
            str(FIXTURE_DIR),
            "--author",
            "staffuser",
            "--dry-run",
            "--refresh",
            stdout=out,
        )
        text = out.getvalue()
        self.assertIn("Published posts", text)
        self.assertIn("tr-bot", text)
        self.assertIn("would SKIP", text)
        # dry-run must not refresh
        self.assertEqual(Post.objects.get(slug="tr-bot").title, "Sample Essay Title")

    def test_command_dry_run_writes_nothing(self):
        call_command(
            "seed_blog",
            "--source-dir",
            str(FIXTURE_DIR),
            "--author",
            "staffuser",
            "--dry-run",
        )
        self.assertEqual(Post.objects.count(), 0)
        self.assertEqual(Category.objects.count(), 0)

    def test_command_missing_source_dir(self):
        with self.assertRaises(CommandError):
            call_command(
                "seed_blog",
                "--source-dir",
                "/nonexistent/essays",
                "--author",
                "staffuser",
            )

    def test_command_requires_staff_author(self):
        User.objects.create_user(username="plain", password="testpass")
        with self.assertRaises(CommandError):
            call_command(
                "seed_blog",
                "--source-dir",
                str(FIXTURE_DIR),
                "--author",
                "plain",
            )
