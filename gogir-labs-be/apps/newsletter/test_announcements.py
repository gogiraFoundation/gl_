from datetime import timedelta
from io import StringIO
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase, TransactionTestCase, override_settings
from django.utils import timezone
from rest_framework.test import APIClient

from apps.blog.models import Post
from apps.newsletter.models import NewsletterSubscriber, PostAnnouncement

User = get_user_model()


class PostAnnouncementOutboxTest(TransactionTestCase):
    """on_commit requires TransactionTestCase to fire inside the test."""

    def setUp(self):
        self.author = User.objects.create_user(username="author", password="pass")

    def test_publish_creates_one_pending_announcement(self):
        post = Post.objects.create(
            title="Hello",
            excerpt="excerpt",
            content="body",
            author=self.author,
            published=False,
        )
        post.published = True
        post.save()
        self.assertEqual(PostAnnouncement.objects.filter(post=post).count(), 1)
        announcement = PostAnnouncement.objects.get(post=post)
        self.assertEqual(announcement.status, PostAnnouncement.STATUS_PENDING)

        post.title = "Hello again"
        post.save()
        self.assertEqual(PostAnnouncement.objects.filter(post=post).count(), 1)


@override_settings(NEWSLETTER_BROADCASTS_ENABLED=False)
class SendPostAnnouncementsCommandTest(TestCase):
    def setUp(self):
        self.author = User.objects.create_user(username="author", password="pass")
        self.post = Post.objects.create(
            title="Hello",
            excerpt="excerpt",
            content="body",
            author=self.author,
            published=True,
        )
        PostAnnouncement.objects.create(post=self.post)

    def test_command_leaves_pending_when_broadcasts_disabled(self):
        call_command("send_post_announcements")
        announcement = PostAnnouncement.objects.get(post=self.post)
        self.assertEqual(announcement.status, PostAnnouncement.STATUS_PENDING)


@override_settings(NEWSLETTER_BROADCASTS_ENABLED=True)
class SendPostAnnouncementsEnabledTest(TestCase):
    def setUp(self):
        self.author = User.objects.create_user(username="author", password="pass")
        self.post = Post.objects.create(
            title="Hello",
            excerpt="excerpt",
            content="body",
            author=self.author,
            published=True,
        )
        PostAnnouncement.objects.create(post=self.post)
        NewsletterSubscriber.objects.create(
            email="reader@example.com", is_active=True, is_verified=True
        )
        NewsletterSubscriber.objects.create(
            email="pending@example.com", is_active=True, is_verified=False
        )

    @patch("apps.newsletter.management.commands.send_post_announcements.EmailService.send_email")
    @patch(
        "apps.newsletter.management.commands.send_post_announcements.NewsletterService.lifecycle_from_email",
        return_value="Newsletter <news@example.com>",
    )
    def test_sends_to_verified_only_and_is_idempotent(self, mock_from, mock_send):
        mock_send.return_value = True
        call_command("send_post_announcements")
        self.assertEqual(mock_send.call_count, 1)
        kwargs = mock_send.call_args.kwargs
        self.assertEqual(kwargs.get("from_email"), "Newsletter <news@example.com>")
        announcement = PostAnnouncement.objects.get(post=self.post)
        self.assertEqual(announcement.status, PostAnnouncement.STATUS_SENT)
        self.assertEqual(announcement.delivered_to, ["reader@example.com"])

        mock_send.reset_mock()
        call_command("send_post_announcements")
        mock_send.assert_not_called()

    @patch("apps.newsletter.management.commands.send_post_announcements.EmailService.send_email")
    def test_total_failure_stays_pending_for_retry(self, mock_send):
        mock_send.return_value = False
        call_command("send_post_announcements")
        announcement = PostAnnouncement.objects.get(post=self.post)
        self.assertEqual(announcement.status, PostAnnouncement.STATUS_PENDING)
        self.assertEqual(announcement.delivered_to, [])
        self.assertEqual(announcement.sent_count, 0)

        mock_send.return_value = True
        call_command("send_post_announcements")
        announcement.refresh_from_db()
        self.assertEqual(announcement.status, PostAnnouncement.STATUS_SENT)
        self.assertEqual(announcement.delivered_to, ["reader@example.com"])

    @patch("apps.newsletter.management.commands.send_post_announcements.EmailService.send_email")
    def test_partial_failure_retries_only_undelivered(self, mock_send):
        NewsletterSubscriber.objects.create(
            email="second@example.com", is_active=True, is_verified=True
        )
        # Fail only for second@; order of queryset iteration is not guaranteed.
        mock_send.side_effect = (
            lambda **kwargs: kwargs["recipient"] == "reader@example.com"
        )
        call_command("send_post_announcements")
        announcement = PostAnnouncement.objects.get(post=self.post)
        self.assertEqual(announcement.status, PostAnnouncement.STATUS_PENDING)
        self.assertEqual(announcement.delivered_to, ["reader@example.com"])

        mock_send.reset_mock()
        mock_send.side_effect = None
        mock_send.return_value = True
        call_command("send_post_announcements")
        announcement.refresh_from_db()
        self.assertEqual(announcement.status, PostAnnouncement.STATUS_SENT)
        self.assertEqual(mock_send.call_count, 1)
        self.assertEqual(mock_send.call_args.kwargs["recipient"], "second@example.com")
        self.assertCountEqual(
            announcement.delivered_to,
            ["reader@example.com", "second@example.com"],
        )


class PublishScheduledPostsCommandTest(TestCase):
    def setUp(self):
        self.author = User.objects.create_user(username="author", password="pass")
        self.client = APIClient()

    def test_publishes_due_posts_only(self):
        due = Post.objects.create(
            title="Due",
            excerpt="e",
            content="c",
            author=self.author,
            published=False,
            publish_at=timezone.now() - timedelta(minutes=5),
        )
        future = Post.objects.create(
            title="Future",
            excerpt="e",
            content="c",
            author=self.author,
            published=False,
            publish_at=timezone.now() + timedelta(days=1),
        )
        # Future post is not public yet
        listing = self.client.get("/api/v1/blog/posts/")
        titles = [item["title"] for item in listing.data["results"]]
        self.assertNotIn("Future", titles)
        self.assertNotIn("Due", titles)

        call_command("publish_scheduled_posts", stdout=StringIO())
        due.refresh_from_db()
        future.refresh_from_db()
        self.assertTrue(due.published)
        self.assertFalse(future.published)

        listing = self.client.get("/api/v1/blog/posts/")
        titles = [item["title"] for item in listing.data["results"]]
        self.assertIn("Due", titles)
        self.assertNotIn("Future", titles)
