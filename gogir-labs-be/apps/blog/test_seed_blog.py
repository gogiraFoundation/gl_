"""Tests for idempotent blog essay seeding."""

from pathlib import Path
from unittest.mock import patch

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

FIXTURE_DIR = Path(__file__).resolve().parent / "fixtures" / "seed_essays_sample"


@override_settings(PUBLIC_API_ORIGIN="https://api.example.test")
class SeedBlogTest(TestCase):
    def setUp(self):
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
        self.assertEqual(result["images_copied"], 1)
        self.assertEqual(Post.objects.count(), 2)
        self.assertFalse(Post.objects.get(slug="urbana").published)

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
        self.assertEqual(Post.objects.count(), 2)
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
        self.assertGreaterEqual(result["images_copied"], 1)
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
    def test_seed_publish_uses_update_without_side_effects(self, mock_notify):
        result = seed_blog(source_dir=FIXTURE_DIR, author=self.author, publish=True)

        self.assertEqual(result["created"], 2)
        post = Post.objects.get(slug="tr-bot")
        self.assertTrue(post.published)
        self.assertIsNotNone(post.published_at)
        mock_notify.assert_not_called()
        self.assertEqual(PostAnnouncement.objects.count(), 0)

    def test_plan_essays_marks_existing(self):
        seed_blog(source_dir=FIXTURE_DIR, author=self.author)
        planned = plan_essays(FIXTURE_DIR)
        self.assertEqual(len(planned), 2)
        self.assertTrue(all(item["exists"] for item in planned))
        by_slug = {item["slug"]: item for item in planned}
        self.assertEqual(set(by_slug), {"tr-bot", "urbana"})
        self.assertEqual(by_slug["tr-bot"]["image_refs"], 1)
        self.assertEqual(by_slug["urbana"]["image_refs"], 0)

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
