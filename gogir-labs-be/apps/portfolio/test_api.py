from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from .models import Project

User = get_user_model()


class PortfolioAPITest(TestCase):
    """Test portfolio write permissions and public reads."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.staff_user = User.objects.create_user(
            username="staffuser", password="testpass", is_staff=True
        )
        self.project = Project.objects.create(
            title="Published Project",
            description="A published project",
            published=True,
        )
        self.unpublished = Project.objects.create(
            title="Draft Project",
            description="A draft",
            published=False,
        )

    def test_list_returns_published_only(self):
        response = self.client.get("/api/v1/portfolio/projects/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titles = [item["title"] for item in response.data["results"]]
        self.assertIn("Published Project", titles)
        self.assertNotIn("Draft Project", titles)

    def test_anonymous_cannot_create_project(self):
        response = self.client.post(
            "/api/v1/portfolio/projects/",
            {"title": "New", "description": "Desc"},
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_non_staff_cannot_create_update_or_delete(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            "/api/v1/portfolio/projects/",
            {"title": "New", "description": "Desc"},
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        url = f"/api/v1/portfolio/projects/{self.project.id}/"
        self.assertEqual(
            self.client.patch(url, {"title": "Hacked"}).status_code,
            status.HTTP_403_FORBIDDEN,
        )
        self.assertEqual(self.client.delete(url).status_code, status.HTTP_403_FORBIDDEN)

    @patch("apps.notifications.services.NotificationService.notify_admins")
    def test_staff_can_create_project(self, mock_notify):
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.post(
            "/api/v1/portfolio/projects/",
            {
                "title": "Staff Project",
                "description": "Created by staff",
                "published": False,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Project.objects.filter(title="Staff Project").exists())

    def test_detail_includes_outcomes_list_omits_them(self):
        self.project.role = "Lead Engineer"
        self.project.year = 2024
        self.project.client = "Acme"
        self.project.outcomes = ["Shipped IAM", "Cut deploy time"]
        self.project.save()

        detail = self.client.get(f"/api/v1/portfolio/projects/{self.project.id}/")
        self.assertEqual(detail.status_code, status.HTTP_200_OK)
        self.assertEqual(detail.data["role"], "Lead Engineer")
        self.assertEqual(detail.data["outcomes"], ["Shipped IAM", "Cut deploy time"])

        listing = self.client.get("/api/v1/portfolio/projects/")
        row = next(r for r in listing.data["results"] if r["id"] == self.project.id)
        self.assertEqual(row["role"], "Lead Engineer")
        self.assertEqual(row["year"], 2024)
        self.assertNotIn("outcomes", row)

    def test_outcomes_validation(self):
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.patch(
            f"/api/v1/portfolio/projects/{self.project.id}/",
            {"outcomes": "not-a-list"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.client.patch(
            f"/api/v1/portfolio/projects/{self.project.id}/",
            {"year": 1800},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
