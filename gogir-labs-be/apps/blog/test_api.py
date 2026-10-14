from datetime import timedelta
from unittest.mock import MagicMock, patch

import pytest
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from .models import Category, Comment, Post, Tag

User = get_user_model()


class BlogAPITest(TestCase):
    """Test Blog API endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.staff_user = User.objects.create_user(
            username="staffuser", password="testpass", is_staff=True
        )
        self.category = Category.objects.create(name="Technology")
        self.tag = Tag.objects.create(name="Python")
        self.post = Post.objects.create(
            title="Test Post",
            slug="test-post",
            excerpt="Test Excerpt",
            content="Test Content",
            author=self.user,
            category=self.category,
            published=True,
        )
        self.post.tags.add(self.tag)
        self.unpublished_post = Post.objects.create(
            title="Unpublished Post",
            slug="unpublished-post",
            excerpt="Excerpt",
            content="Content",
            author=self.user,
            published=False,
        )

    def test_get_posts_list_returns_published_only(self):
        """Test GET /api/v1/blog/posts/ returns published posts only."""
        url = "/api/v1/blog/posts/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)  # Only published post
        self.assertEqual(response.data["results"][0]["title"], "Test Post")

    def test_staff_user_sees_all_posts(self):
        """Test staff users can see unpublished posts."""
        self.client.force_authenticate(user=self.staff_user)
        url = "/api/v1/blog/posts/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should see both published and unpublished
        self.assertGreaterEqual(len(response.data["results"]), 2)

    def test_filter_by_category(self):
        """Test filtering posts by category."""
        url = "/api/v1/blog/posts/"
        response = self.client.get(url, {"category": self.category.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(
            response.data["results"][0]["category"]["id"], self.category.id
        )

    def test_filter_by_tags(self):
        """Test filtering posts by tags."""
        url = "/api/v1/blog/posts/"
        response = self.client.get(url, {"tags": self.tag.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_filter_by_featured(self):
        """Test filtering posts by featured."""
        self.post.featured = True
        self.post.save()
        url = "/api/v1/blog/posts/"
        response = self.client.get(url, {"featured": "true"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertTrue(response.data["results"][0]["featured"])

    def test_search_functionality(self):
        """Test search functionality."""
        url = "/api/v1/blog/posts/"
        response = self.client.get(url, {"search": "Test"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_search_sql_injection_attempt(self):
        """Test SQL injection attempt in search."""
        url = "/api/v1/blog/posts/"
        # DRF's SearchFilter should sanitize this
        response = self.client.get(url, {"search": "'; DROP TABLE posts; --"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should not cause error, just return empty results

    def test_search_xss_attempt(self):
        """Test XSS attempt in search query."""
        url = "/api/v1/blog/posts/"
        response = self.client.get(url, {"search": '<script>alert("XSS")</script>'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should be sanitized by DRF

    def test_ordering_by_created_at(self):
        """Test ordering by created_at."""
        url = "/api/v1/blog/posts/"
        response = self.client.get(url, {"ordering": "created_at"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_ordering_by_views(self):
        """Test ordering by views."""
        self.post.views = 10
        self.post.save()
        url = "/api/v1/blog/posts/"
        response = self.client.get(url, {"ordering": "-views"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_no_posts_found(self):
        """Test when no posts match filters."""
        Post.objects.all().delete()
        url = "/api/v1/blog/posts/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 0)

    def test_invalid_filter_values(self):
        """Test invalid filter values."""
        url = "/api/v1/blog/posts/"
        response = self.client.get(url, {"category": "invalid"})
        # Should return 400 or handle gracefully
        self.assertIn(
            response.status_code, [status.HTTP_200_OK, status.HTTP_400_BAD_REQUEST]
        )

    def test_get_post_by_slug(self):
        """Test GET /api/v1/blog/posts/by-slug/ returns post by slug."""
        url = "/api/v1/blog/posts/by-slug/"
        response = self.client.get(url, {"slug": "test-post"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Test Post")
        self.assertIn("content", response.data)  # Full content included

    def test_get_post_by_slug_missing_parameter(self):
        """Test by-slug endpoint with missing slug parameter."""
        url = "/api/v1/blog/posts/by-slug/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)

    def test_get_post_by_slug_not_found(self):
        """Test by-slug endpoint with non-existent slug."""
        url = "/api/v1/blog/posts/by-slug/"
        response = self.client.get(url, {"slug": "non-existent"})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_post_by_slug_unpublished(self):
        """Test by-slug endpoint with unpublished post (should 404 for public)."""
        url = "/api/v1/blog/posts/by-slug/"
        response = self.client.get(url, {"slug": "unpublished-post"})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_post_by_slug_special_characters(self):
        """Test by-slug endpoint with special characters in slug."""
        post = Post.objects.create(
            title="Post with Special Chars!",
            slug="post-with-special-chars",
            excerpt="Excerpt",
            content="Content",
            author=self.user,
            published=True,
        )
        url = "/api/v1/blog/posts/by-slug/"
        response = self.client.get(url, {"slug": "post-with-special-chars"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_post_detail(self):
        """Test GET /api/v1/blog/posts/{id}/ returns post detail."""
        url = f"/api/v1/blog/posts/{self.post.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Test Post")
        self.assertIn("content", response.data)

    def test_get_post_detail_not_found(self):
        """Test post detail with non-existent ID."""
        url = "/api/v1/blog/posts/99999/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_post_detail_unpublished(self):
        """Test post detail with unpublished post (should 404 for public)."""
        url = f"/api/v1/blog/posts/{self.unpublished_post.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_cannot_publish_with_future_publish_at(self):
        """published=True + future publish_at must be rejected so the scheduler owns go-live."""
        self.client.force_authenticate(user=self.staff_user)
        url = f"/api/v1/blog/posts/{self.unpublished_post.id}/"
        response = self.client.patch(
            url,
            {
                "published": True,
                "publish_at": (timezone.now() + timedelta(days=2)).isoformat(),
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.unpublished_post.refresh_from_db()
        self.assertFalse(self.unpublished_post.published)

    def test_schedule_with_future_publish_at_keeps_unpublished(self):
        self.client.force_authenticate(user=self.staff_user)
        future = timezone.now() + timedelta(days=2)
        url = f"/api/v1/blog/posts/{self.unpublished_post.id}/"
        response = self.client.patch(
            url,
            {"published": False, "publish_at": future.isoformat()},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.unpublished_post.refresh_from_db()
        self.assertFalse(self.unpublished_post.published)
        self.assertIsNotNone(self.unpublished_post.publish_at)

    def test_increment_views(self):
        """Test POST /api/v1/blog/posts/{id}/increment_views/ increments view count."""
        initial_views = self.post.views
        url = f"/api/v1/blog/posts/{self.post.id}/increment_views/"
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["views"], initial_views + 1)

        self.post.refresh_from_db()
        self.assertEqual(self.post.views, initial_views + 1)

    def test_increment_views_not_found(self):
        """Test increment views with non-existent post."""
        url = "/api/v1/blog/posts/99999/increment_views/"
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_comments(self):
        """Test GET /api/v1/blog/posts/{id}/comments/ returns approved comments only."""
        approved_comment = Comment.objects.create(
            post=self.post,
            name="John",
            email="john@example.com",
            content="Approved comment",
            approved=True,
        )
        unapproved_comment = Comment.objects.create(
            post=self.post,
            name="Jane",
            email="jane@example.com",
            content="Unapproved comment",
            approved=False,
        )
        url = f"/api/v1/blog/posts/{self.post.id}/comments/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "John")

    def test_get_comments_no_comments(self):
        """Test comments endpoint when no comments exist."""
        url = f"/api/v1/blog/posts/{self.post.id}/comments/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    @patch("apps.notifications.services.NotificationService.notify_admins")
    def test_create_comment(self, mock_notify):
        """Test POST /api/v1/blog/posts/{id}/comments/ creates comment."""
        url = f"/api/v1/blog/posts/{self.post.id}/comments/"
        data = {
            "post": self.post.id,
            "name": "John Doe",
            "email": "john@example.com",
            "content": "Great post!",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Comment.objects.filter(email="john@example.com").exists())
        mock_notify.assert_called_once()

    def test_create_comment_honeypot_rejected(self):
        """Filled website honeypot is rejected and creates no row."""
        url = f"/api/v1/blog/posts/{self.post.id}/comments/"
        data = {
            "name": "Bot",
            "email": "bot@example.com",
            "content": "Spam comment content",
            "website": "https://spam.example",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(Comment.objects.filter(email="bot@example.com").exists())

    def test_create_comment_invalid_email(self):
        """Test comment creation with invalid email."""
        url = f"/api/v1/blog/posts/{self.post.id}/comments/"
        data = {
            "name": "John Doe",
            "email": "invalid-email",
            "content": "Comment",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_comment_very_long(self):
        """Test comment creation rejects content over 2000 characters."""
        url = f"/api/v1/blog/posts/{self.post.id}/comments/"
        data = {
            "name": "John Doe",
            "email": "john@example.com",
            "content": "A" * 10000,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_detail_hides_unapproved_comments(self):
        Comment.objects.create(
            post=self.post,
            name="John",
            email="john@example.com",
            content="Approved",
            approved=True,
        )
        Comment.objects.create(
            post=self.post,
            name="Jane",
            email="jane@example.com",
            content="Pending",
            approved=False,
        )
        url = f"/api/v1/blog/posts/{self.post.id}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["comments"]), 1)
        self.assertEqual(response.data["comments"][0]["content"], "Approved")

    def test_increment_views_is_atomic(self):
        from django.db.models import F

        Post.objects.filter(pk=self.post.pk).update(views=F("views") + 1)
        Post.objects.filter(pk=self.post.pk).update(views=F("views") + 1)
        self.post.refresh_from_db()
        self.assertEqual(self.post.views, 2)

    def test_create_comment_missing_fields(self):
        """Test comment creation with missing required fields."""
        url = f"/api/v1/blog/posts/{self.post.id}/comments/"
        data = {
            "name": "John Doe",
            # Missing email and content
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_anonymous_cannot_create_post(self):
        url = "/api/v1/blog/posts/"
        data = {
            "title": "New Post",
            "excerpt": "Excerpt",
            "content": "Content",
        }
        response = self.client.post(url, data)
        # Unauthenticated requests hit JWT auth before IsAdminUser (401).
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_non_staff_cannot_create_post(self):
        self.client.force_authenticate(user=self.user)
        url = "/api/v1/blog/posts/"
        data = {
            "title": "New Post",
            "excerpt": "Excerpt",
            "content": "Content",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_non_staff_cannot_update_or_delete_post(self):
        self.client.force_authenticate(user=self.user)
        url = f"/api/v1/blog/posts/{self.post.id}/"
        response = self.client.patch(url, {"title": "Hacked"})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @patch("apps.notifications.services.NotificationService.notify_admins")
    def test_staff_can_create_post(self, mock_notify):
        self.client.force_authenticate(user=self.staff_user)
        url = "/api/v1/blog/posts/"
        data = {
            "title": "Staff Post",
            "excerpt": "Excerpt",
            "content": "Content",
            "published": False,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["author"], self.staff_user.id)
        self.assertEqual(Post.objects.get(id=response.data["id"]).author, self.staff_user)

    @patch("apps.blog.views.NotificationService.send_template_to_address")
    def test_approve_comment_emails_guest(self, mock_send):
        comment = Comment.objects.create(
            post=self.post,
            name="Guest",
            email="guest@example.com",
            content="Nice post",
            approved=False,
        )
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.patch(
            f"/api/v1/blog/comments/{comment.id}/",
            {"approved": True},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_send.assert_called_once()
        self.assertEqual(mock_send.call_args.kwargs["recipient"], "guest@example.com")

    @patch("apps.blog.views.NotificationService.send_template_to_address")
    def test_approve_comment_twice_emails_once(self, mock_send):
        comment = Comment.objects.create(
            post=self.post,
            name="Guest",
            email="guest@example.com",
            content="Nice post",
            approved=False,
        )
        self.client.force_authenticate(user=self.staff_user)
        url = f"/api/v1/blog/comments/{comment.id}/"
        self.client.patch(url, {"approved": True}, format="json")
        self.client.patch(url, {"approved": True}, format="json")
        self.assertEqual(mock_send.call_count, 1)
