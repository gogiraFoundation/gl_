from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from .models import SiteProfile

User = get_user_model()


class SiteProfileAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.staff = User.objects.create_user(
            username="staff", password="pass", is_staff=True
        )
        self.user = User.objects.create_user(username="user", password="pass")

    def test_public_get_creates_singleton(self):
        response = self.client.get("/api/v1/site/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("full_name", response.data)
        self.assertEqual(SiteProfile.objects.count(), 1)

    def test_staff_can_patch(self):
        self.client.force_authenticate(user=self.staff)
        response = self.client.patch(
            "/api/v1/site/",
            {"full_name": "Test Name", "headline": "New headline"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["full_name"], "Test Name")
        self.assertEqual(SiteProfile.load().full_name, "Test Name")

    def test_anonymous_patch_forbidden(self):
        response = self.client.patch(
            "/api/v1/site/", {"full_name": "Hacked"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_non_staff_patch_forbidden(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(
            "/api/v1/site/", {"full_name": "Hacked"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
