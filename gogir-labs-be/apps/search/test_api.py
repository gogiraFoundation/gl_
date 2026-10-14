from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.blog.models import Post

User = get_user_model()


class SearchAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.author = User.objects.create_user(username="author", password="pass")
        for i in range(25):
            Post.objects.create(
                title=f"Python tip {i}",
                excerpt="excerpt",
                content="content about python",
                author=self.author,
                published=True,
            )

    def test_invalid_type_returns_400(self):
        response = self.client.get("/api/v1/search/", {"q": "python", "type": "widgets"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_limit_returns_400(self):
        response = self.client.get("/api/v1/search/", {"q": "python", "limit": "abc"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_category_returns_400(self):
        response = self.client.get(
            "/api/v1/search/", {"q": "python", "category": "abc"}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_limit_is_capped_at_20(self):
        response = self.client.get("/api/v1/search/", {"q": "python", "limit": 1000})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertLessEqual(len(response.data["blog_posts"]), 20)

    def test_query_too_long_returns_400(self):
        response = self.client.get("/api/v1/search/", {"q": "a" * 201})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_search_tracks_search_event_type(self):
        from apps.analytics.models import Event

        response = self.client.get("/api/v1/search/", {"q": "python"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            Event.objects.filter(event_type="search", event_name="search_query").exists()
        )
        event = Event.objects.filter(event_type="search").first()
        self.assertIsNone(event.ip_address)

    def test_search_includes_testimonials_and_resume(self):
        from apps.resume.models import Experience, Skill
        from apps.testimonials.models import Testimonial
        from datetime import date

        Testimonial.objects.create(
            client_name="Searchable Client",
            client_role="CTO",
            content="Loved the python work",
            published=True,
        )
        Testimonial.objects.create(
            client_name="Hidden",
            client_role="CEO",
            content="python draft",
            published=False,
        )
        Experience.objects.create(
            title="Python Engineer",
            company="Labs",
            start_date=date(2024, 1, 1),
            description="x",
        )
        Skill.objects.create(name="Python", category="programming")

        response = self.client.get("/api/v1/search/", {"q": "python"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("testimonials", response.data)
        self.assertIn("resume", response.data)
        names = [t["client_name"] for t in response.data["testimonials"]]
        self.assertIn("Searchable Client", names)
        self.assertNotIn("Hidden", names)
        self.assertTrue(any(e["title"] == "Python Engineer" for e in response.data["resume"]["experience"]))

        typed = self.client.get(
            "/api/v1/search/", {"q": "python", "type": "testimonials"}
        )
        self.assertEqual(typed.data["blog_posts"], [])
        self.assertEqual(typed.data["projects"], [])
        self.assertGreater(len(typed.data["testimonials"]), 0)
