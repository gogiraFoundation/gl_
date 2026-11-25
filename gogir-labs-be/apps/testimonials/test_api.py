from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from .models import Testimonial, TestimonialInvite

User = get_user_model()


class TestimonialAPITest(TestCase):
    """Test testimonial write permissions and public reads."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.staff_user = User.objects.create_user(
            username="staffuser", password="testpass", is_staff=True
        )
        self.testimonial = Testimonial.objects.create(
            client_name="Alice",
            client_role="CTO",
            content="Great work",
            published=True,
        )
        self.unpublished = Testimonial.objects.create(
            client_name="Bob",
            client_role="CEO",
            content="Draft",
            published=False,
        )

    def test_list_returns_published_only(self):
        response = self.client.get("/api/v1/testimonials/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        names = [item["client_name"] for item in response.data["results"]]
        self.assertIn("Alice", names)
        self.assertNotIn("Bob", names)

    def test_anonymous_cannot_create(self):
        response = self.client.post(
            "/api/v1/testimonials/",
            {
                "client_name": "Eve",
                "client_role": "Dev",
                "content": "Spam",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_non_staff_cannot_create_update_or_delete(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            "/api/v1/testimonials/",
            {
                "client_name": "Eve",
                "client_role": "Dev",
                "content": "Spam",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        url = f"/api/v1/testimonials/{self.testimonial.id}/"
        self.assertEqual(
            self.client.patch(url, {"content": "Hacked"}).status_code,
            status.HTTP_403_FORBIDDEN,
        )
        self.assertEqual(self.client.delete(url).status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_can_create(self):
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.post(
            "/api/v1/testimonials/",
            {
                "client_name": "Carol",
                "client_role": "PM",
                "content": "Excellent",
                "published": False,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Testimonial.objects.filter(client_name="Carol").exists())

    @patch("apps.testimonials.views.EmailService.send_email", return_value=True)
    def test_staff_can_invite(self, mock_send):
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.post(
            "/api/v1/testimonials/invites/",
            {"email": "client@example.com"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            TestimonialInvite.objects.filter(email="client@example.com").exists()
        )
        mock_send.assert_called_once()

    @patch("apps.testimonials.views.EmailService.send_email", return_value=False)
    def test_invite_mail_failure_deletes_invite(self, mock_send):
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.post(
            "/api/v1/testimonials/invites/",
            {"email": "client@example.com"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertFalse(
            TestimonialInvite.objects.filter(email="client@example.com").exists()
        )

    def test_submit_creates_unpublished(self):
        invite = TestimonialInvite.objects.create(email="client@example.com")
        response = self.client.post(
            f"/api/v1/testimonials/submit/{invite.token}/",
            {
                "client_name": "Dana",
                "client_role": "Founder",
                "company": "Acme",
                "content": "Wonderful partner",
                "rating": 5,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        row = Testimonial.objects.get(client_name="Dana")
        self.assertFalse(row.published)
        invite.refresh_from_db()
        self.assertIsNotNone(invite.used_at)

        # Second submit with same token fails
        response = self.client.post(
            f"/api/v1/testimonials/submit/{invite.token}/",
            {
                "client_name": "Dana",
                "client_role": "Founder",
                "content": "Again",
                "rating": 5,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Public list still hides unpublished
        listing = self.client.get("/api/v1/testimonials/")
        names = [item["client_name"] for item in listing.data["results"]]
        self.assertNotIn("Dana", names)

    def test_anonymous_cannot_invite(self):
        response = self.client.post(
            "/api/v1/testimonials/invites/",
            {"email": "x@example.com"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
