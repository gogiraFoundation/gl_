from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

User = get_user_model()


class StaffWritePermissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="member", password="testpass")
        self.staff = User.objects.create_user(
            username="editor", password="testpass", is_staff=True
        )

    def test_anonymous_writes_are_rejected(self):
        response = self.client.post(
            "/api/v1/blog/posts/",
            {"title": "Nope", "excerpt": "e", "content": "c"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_non_staff_cannot_write_public_content(self):
        self.client.force_authenticate(user=self.user)
        cases = [
            (
                "/api/v1/blog/posts/",
                {"title": "Nope", "excerpt": "e", "content": "c"},
            ),
            (
                "/api/v1/portfolio/projects/",
                {"title": "Nope", "description": "d", "published": False},
            ),
            (
                "/api/v1/testimonials/",
                {
                    "client_name": "A",
                    "client_role": "B",
                    "content": "C",
                    "rating": 5,
                },
            ),
        ]
        for url, payload in cases:
            response = self.client.post(url, payload, format="json")
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, url)

    def test_staff_can_create_blog_post(self):
        self.client.force_authenticate(user=self.staff)
        response = self.client.post(
            "/api/v1/blog/posts/",
            {
                "title": "Staff Draft",
                "excerpt": "Excerpt",
                "content": "Body",
                "published": False,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
