from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.urls import reverse
from django.utils import timezone

from apps.blog.models import Category, Post
from apps.portfolio.models import Project

User = get_user_model()


@override_settings(FRONTEND_URL="https://www.example.test")
class FeedFrontendUrlTests(TestCase):
    def setUp(self):
        self.author = User.objects.create_user(
            username="feed-author", password="x", is_staff=True
        )
        Post.objects.create(
            title="Hello Feed",
            slug="hello-feed",
            content="<p>Hi</p>",
            excerpt="Hi",
            author=self.author,
            published=True,
            published_at=timezone.now(),
        )

    def test_rss_item_link_uses_frontend_url(self):
        response = self.client.get(reverse("blog_feed"))
        self.assertEqual(response.status_code, 200)
        body = response.content.decode()
        self.assertIn("https://www.example.test/blog/hello-feed", body)
        self.assertNotIn("http://testserver/blog/hello-feed", body)


@override_settings(FRONTEND_URL="https://www.example.test")
class SitemapFrontendUrlTests(TestCase):
    def setUp(self):
        self.author = User.objects.create_user(
            username="map-author", password="x", is_staff=True
        )
        Post.objects.create(
            title="Hello Map",
            slug="hello-map",
            content="<p>Hi</p>",
            excerpt="Hi",
            author=self.author,
            published=True,
            published_at=timezone.now(),
        )
        Project.objects.create(
            title="Mapped Project",
            slug="mapped-project",
            description="Desc",
            published=True,
        )

    def test_sitemap_locs_use_frontend_host(self):
        response = self.client.get(reverse("django.contrib.sitemaps.views.sitemap"))
        self.assertEqual(response.status_code, 200)
        body = response.content.decode()
        self.assertIn("https://www.example.test/blog/hello-map", body)
        self.assertIn("https://www.example.test/portfolio/mapped-project", body)
        self.assertIn("https://www.example.test/about", body)

    def test_sitemap_excludes_hold_portfolio_and_unlisted_essay(self):
        essays = Category.objects.create(name="Project Essays", slug="project-essays")
        Post.objects.create(
            title="Bria Essay",
            slug="bria",
            content="<p>hold</p>",
            excerpt="hold",
            author=self.author,
            category=essays,
            published=True,
            published_at=timezone.now(),
        )
        Project.objects.create(
            title="Bria",
            slug="bria",
            description="hold",
            published=True,
        )
        response = self.client.get(reverse("django.contrib.sitemaps.views.sitemap"))
        self.assertEqual(response.status_code, 200)
        body = response.content.decode()
        self.assertNotIn("/blog/bria", body)
        self.assertNotIn("/portfolio/bria", body)
