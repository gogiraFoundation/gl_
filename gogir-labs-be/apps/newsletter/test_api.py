from unittest.mock import patch

import pytest
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core import mail
from django.core.cache import cache
from django.test import TestCase
from django.test.utils import override_settings
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate

from .models import NewsletterSubscriber

User = get_user_model()
TEST_REST_FRAMEWORK = {
    **settings.REST_FRAMEWORK,
    "DEFAULT_THROTTLE_CLASSES": [],
    "DEFAULT_THROTTLE_RATES": {
        **settings.REST_FRAMEWORK.get("DEFAULT_THROTTLE_RATES", {}),
        "auth": "100000/minute",
        "contact": "100000/minute",
        "newsletter_subscribe": "100000/minute",
        "newsletter_verify": "100000/minute",
        "newsletter_unsubscribe": "100000/minute",
        "analytics_track": "100000/minute",
        "search": "100000/minute",
        "comments": "100000/minute",
        "anon": "100000/minute",
        "user": "100000/minute",
    },
}
GENERIC_UNSUBSCRIBE_MESSAGE = (
    "If a matching subscription exists, it has been unsubscribed successfully."
)
GENERIC_UNSUBSCRIBE_LINK_MESSAGE = (
    "If a matching subscription exists, an unsubscribe link has been sent."
)


@override_settings(REST_FRAMEWORK=TEST_REST_FRAMEWORK)
class NewsletterAPITest(TestCase):
    """Test Newsletter API endpoints."""

    def setUp(self):
        cache.clear()
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.staff_user = User.objects.create_user(
            username="staffuser", password="testpass", is_staff=True
        )

    @patch("apps.newsletter.services.NewsletterService.send_verification_email")
    def test_subscribe_creates_subscriber(self, mock_send_email):
        """Test POST /api/v1/newsletter/subscribe/ creates subscriber."""
        url = "/api/v1/newsletter/subscribe/"
        data = {
            "email": "test@example.com",
            "name": "Test User",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("message", response.data)
        self.assertTrue(
            NewsletterSubscriber.objects.filter(email="test@example.com").exists()
        )
        mock_send_email.assert_called_once()

    @patch("apps.newsletter.services.NewsletterService.send_verification_email")
    def test_subscribe_duplicate_email(self, mock_send_email):
        """Active verified address returns the same 201 and skips verification mail."""
        NewsletterSubscriber.objects.create(
            email="test@example.com", is_active=True, is_verified=True
        )
        url = "/api/v1/newsletter/subscribe/"
        data = {
            "email": "test@example.com",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mock_send_email.assert_not_called()

    def test_subscribe_invalid_email_format(self):
        """Test subscribing with invalid email format."""
        url = "/api/v1/newsletter/subscribe/"
        data = {
            "email": "invalid-email",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("apps.newsletter.services.NewsletterService.send_verification_email")
    def test_subscribe_email_case_sensitivity(self, mock_send_email):
        """Normalized email matches an existing row (one subscriber)."""
        NewsletterSubscriber.objects.create(email="test@example.com")
        url = "/api/v1/newsletter/subscribe/"
        data = {
            "email": "Test@Example.com",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            NewsletterSubscriber.objects.filter(
                email__iexact="test@example.com"
            ).count(),
            1,
        )

    @patch("apps.newsletter.services.NewsletterService.send_verification_email")
    def test_subscribe_matches_legacy_mixed_case_row(self, mock_send_email):
        """Legacy mixed-case rows are matched and normalized, not duplicated."""
        # Bypass model.save() lowercasing to simulate a pre-normalization row.
        NewsletterSubscriber.objects.all().delete()
        subscriber = NewsletterSubscriber(email="placeholder@example.com")
        subscriber.save()
        NewsletterSubscriber.objects.filter(pk=subscriber.pk).update(
            email="Test@Example.com"
        )
        url = "/api/v1/newsletter/subscribe/"
        response = self.client.post(url, {"email": "test@example.com"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(NewsletterSubscriber.objects.count(), 1)
        subscriber.refresh_from_db()
        self.assertEqual(subscriber.email, "test@example.com")

    @patch("apps.newsletter.services.NewsletterService.send_welcome_email")
    def test_verify_subscriber(self, mock_send_welcome):
        """Test POST /api/v1/newsletter/verify/{token}/ verifies subscriber."""
        subscriber = NewsletterSubscriber.objects.create(email="test@example.com")
        url = f"/api/v1/newsletter/verify/{subscriber.verification_token}/"
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)

        subscriber.refresh_from_db()
        self.assertTrue(subscriber.is_verified)
        mock_send_welcome.assert_called_once()

    @patch("apps.newsletter.services.NewsletterService.send_verification_email")
    def test_subscribe_unverified_resend_is_cooled_down(self, mock_send_email):
        """A recent verification stamp suppresses another mail. The response stays generic."""
        subscriber = NewsletterSubscriber.objects.create(email="again@example.com")
        subscriber.metadata = {"verification_sent_at": timezone.now().isoformat()}
        subscriber.save(update_fields=["metadata"])
        response = self.client.post(
            "/api/v1/newsletter/subscribe/", {"email": "again@example.com"}
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mock_send_email.assert_not_called()

    @patch("apps.newsletter.services.NewsletterService.send_welcome_email")
    def test_verify_get_does_not_confirm(self, mock_send_welcome):
        """GET must not verify. Mail scanners prefetch links."""
        subscriber = NewsletterSubscriber.objects.create(email="get@example.com")
        url = f"/api/v1/newsletter/verify/{subscriber.verification_token}/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        subscriber.refresh_from_db()
        self.assertFalse(subscriber.is_verified)
        mock_send_welcome.assert_not_called()

    def test_verify_invalid_token(self):
        """Test verification with invalid token."""
        url = "/api/v1/newsletter/verify/invalid-token/"
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch("apps.newsletter.services.NewsletterService.send_welcome_email")
    def test_verify_already_verified(self, mock_send_welcome):
        """Test verifying already verified subscriber."""
        subscriber = NewsletterSubscriber.objects.create(
            email="test@example.com",
            is_verified=True,
        )
        url = f"/api/v1/newsletter/verify/{subscriber.verification_token}/"
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("already verified", response.data["message"].lower())

    @patch("apps.newsletter.services.NewsletterService.send_welcome_email")
    @patch("apps.newsletter.services.NewsletterService.send_unsubscribe_confirmation")
    def test_verify_after_unsubscribe_rejects_old_token(
        self, mock_send_confirmation, mock_send_welcome
    ):
        """Old verification token must not re-confirm after unsubscribe."""
        subscriber = NewsletterSubscriber.objects.create(
            email="reverify@example.com",
            is_verified=True,
        )
        old_token = subscriber.verification_token
        self.client.post(
            "/api/v1/newsletter/unsubscribe/",
            {"token": subscriber.unsubscribe_token},
        )
        response = self.client.post(f"/api/v1/newsletter/verify/{old_token}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        subscriber.refresh_from_db()
        self.assertFalse(subscriber.is_active)
        self.assertFalse(subscriber.is_verified)
        mock_send_welcome.assert_not_called()

    @patch("apps.newsletter.services.NewsletterService.send_unsubscribe_confirmation")
    def test_unsubscribe_by_token(self, mock_send_confirmation):
        """Test POST /api/v1/newsletter/unsubscribe/ with token."""
        subscriber = NewsletterSubscriber.objects.create(
            email="test@example.com",
            is_active=True,
        )
        url = "/api/v1/newsletter/unsubscribe/"
        data = {
            "token": subscriber.unsubscribe_token,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        subscriber.refresh_from_db()
        self.assertFalse(subscriber.is_active)
        mock_send_confirmation.assert_called_once()

    @patch("apps.newsletter.services.NewsletterService.send_unsubscribe_confirmation")
    def test_unsubscribe_by_token_with_empty_email_field(self, mock_send_confirmation):
        """Frontend may send email='' alongside token; treat blank as absent."""
        subscriber = NewsletterSubscriber.objects.create(
            email="token-empty@example.com",
            is_active=True,
        )
        url = "/api/v1/newsletter/unsubscribe/"
        response = self.client.post(
            url,
            {"token": subscriber.unsubscribe_token, "email": ""},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        subscriber.refresh_from_db()
        self.assertFalse(subscriber.is_active)

    @patch("apps.newsletter.services.NewsletterService.send_unsubscribe_link_email")
    def test_unsubscribe_by_email(self, mock_send_link):
        """Email-only unsubscribe sends a link and leaves the row active."""
        subscriber = NewsletterSubscriber.objects.create(
            email="test@example.com",
            is_active=True,
        )
        url = "/api/v1/newsletter/unsubscribe/"
        data = {
            "email": "test@example.com",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], GENERIC_UNSUBSCRIBE_LINK_MESSAGE)

        subscriber.refresh_from_db()
        self.assertTrue(subscriber.is_active)
        mock_send_link.assert_called_once()

    @patch("apps.newsletter.services.NewsletterService.send_unsubscribe_link_email")
    def test_unsubscribe_by_email_is_case_insensitive(self, mock_send_link):
        """Lookup uses email__iexact and normalizes stored casing."""
        subscriber = NewsletterSubscriber.objects.create(
            email="legacy@example.com",
            is_active=True,
        )
        NewsletterSubscriber.objects.filter(pk=subscriber.pk).update(
            email="Legacy@Example.com"
        )
        url = "/api/v1/newsletter/unsubscribe/"
        response = self.client.post(url, {"email": "LEGACY@example.com"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], GENERIC_UNSUBSCRIBE_LINK_MESSAGE)
        subscriber.refresh_from_db()
        self.assertEqual(subscriber.email, "legacy@example.com")
        self.assertTrue(subscriber.is_active)
        mock_send_link.assert_called_once()

    def test_unsubscribe_invalid_token(self):
        """Test unsubscribe with invalid token."""
        url = "/api/v1/newsletter/unsubscribe/"
        data = {
            "token": "invalid-token",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], GENERIC_UNSUBSCRIBE_MESSAGE)

    def test_unsubscribe_nonexistent_email(self):
        """Test unsubscribe with non-existent email."""
        url = "/api/v1/newsletter/unsubscribe/"
        data = {
            "email": "nonexistent@example.com",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], GENERIC_UNSUBSCRIBE_LINK_MESSAGE)

    def test_unsubscribe_already_unsubscribed(self):
        """Inactive email still gets the generic link message and stays inactive."""
        subscriber = NewsletterSubscriber.objects.create(
            email="test@example.com",
            is_active=False,
        )
        url = "/api/v1/newsletter/unsubscribe/"
        data = {
            "email": "test@example.com",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], GENERIC_UNSUBSCRIBE_LINK_MESSAGE)
        subscriber.refresh_from_db()
        self.assertFalse(subscriber.is_active)

    def test_unsubscribe_missing_both_token_and_email(self):
        """Test unsubscribe with missing both token and email."""
        url = "/api/v1/newsletter/unsubscribe/"
        data = {}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_subscribers_requires_authentication(self):
        """Test GET /api/v1/newsletter/subscribers/ requires authentication."""
        url = "/api/v1/newsletter/subscribers/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_subscribers_authenticated(self):
        """Test GET /api/v1/newsletter/subscribers/ with authentication."""
        # Clear any existing subscribers first
        NewsletterSubscriber.objects.all().delete()
        NewsletterSubscriber.objects.create(email="test1@example.com")
        NewsletterSubscriber.objects.create(email="test2@example.com")
        self.client.force_authenticate(user=self.staff_user)
        url = "/api/v1/newsletter/subscribers/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check if response is paginated or a list
        if isinstance(response.data, list):
            self.assertEqual(len(response.data), 2)
        else:
            # If paginated, check results
            self.assertGreaterEqual(len(response.data.get("results", [])), 2)

    def test_list_subscribers_filter_by_active(self):
        """Test filtering subscribers by active status."""
        # Clear any existing subscribers first
        NewsletterSubscriber.objects.all().delete()
        active = NewsletterSubscriber.objects.create(
            email="active@example.com",
            is_active=True,
        )
        inactive = NewsletterSubscriber.objects.create(
            email="inactive@example.com",
            is_active=False,
        )
        self.client.force_authenticate(user=self.staff_user)
        url = "/api/v1/newsletter/subscribers/"

        response = self.client.get(url, {"is_active": "true"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = (
            response.data
            if isinstance(response.data, list)
            else response.data.get("results", [])
        )
        self.assertGreaterEqual(len(data), 1)
        # Check that active subscriber is in results
        active_ids = [sub["id"] for sub in data]
        self.assertIn(active.id, active_ids)

    def test_list_subscribers_filter_by_verified(self):
        """Test filtering subscribers by verified status."""
        # Clear any existing subscribers first
        NewsletterSubscriber.objects.all().delete()
        verified = NewsletterSubscriber.objects.create(
            email="verified@example.com",
            is_verified=True,
        )
        unverified = NewsletterSubscriber.objects.create(
            email="unverified@example.com",
            is_verified=False,
        )
        self.client.force_authenticate(user=self.staff_user)
        url = "/api/v1/newsletter/subscribers/"

        response = self.client.get(url, {"is_verified": "true"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = (
            response.data
            if isinstance(response.data, list)
            else response.data.get("results", [])
        )
        self.assertGreaterEqual(len(data), 1)
        # Check that verified subscriber is in results
        verified_ids = [sub["id"] for sub in data]
        self.assertIn(verified.id, verified_ids)

    def test_list_subscribers_search_by_email(self):
        """Test searching subscribers by email."""
        # Clear any existing subscribers first
        NewsletterSubscriber.objects.all().delete()
        NewsletterSubscriber.objects.create(email="john@example.com")
        NewsletterSubscriber.objects.create(email="jane@example.com")
        self.client.force_authenticate(user=self.staff_user)
        url = "/api/v1/newsletter/subscribers/"

        response = self.client.get(url, {"search": "john"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = (
            response.data
            if isinstance(response.data, list)
            else response.data.get("results", [])
        )
        self.assertGreaterEqual(len(data), 1)
        # Check that john@example.com is in results
        emails = [sub["email"] for sub in data]
        self.assertIn("john@example.com", emails)

    def test_stats_requires_authentication(self):
        """Test GET /api/v1/newsletter/stats/ requires authentication."""
        url = "/api/v1/newsletter/stats/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_stats_authenticated(self):
        """Test GET /api/v1/newsletter/stats/ with authentication."""
        NewsletterSubscriber.objects.create(
            email="active@example.com",
            is_active=True,
            is_verified=True,
        )
        NewsletterSubscriber.objects.create(
            email="inactive@example.com",
            is_active=False,
        )
        self.client.force_authenticate(user=self.staff_user)
        url = "/api/v1/newsletter/stats/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("total_subscribers", response.data)
        self.assertIn("active_subscribers", response.data)
        self.assertIn("verified_subscribers", response.data)


MAIL_SETTINGS = dict(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    DEFAULT_FROM_EMAIL="hi@gogirlabs.uk",
    DEFAULT_FROM_NAME="Gogir Labs",
    NEWSLETTER_FROM_EMAIL="newsletter@gogirlabs.uk",
    EMAIL_REPLY_TO="hi@gogirlabs.uk",
    NEWSLETTER_BROADCASTS_ENABLED=False,
    FRONTEND_URL="https://www.gogirlabs.uk",
)


@override_settings(**MAIL_SETTINGS)
class NewsletterOutboundMailTest(TestCase):
    """Lifecycle mail uses newsletter@ and replies go to hi@."""

    def test_verification_email_uses_newsletter_sender(self):
        subscriber = NewsletterSubscriber.objects.create(email="reader@example.com")

        from apps.newsletter.services import NewsletterService

        self.assertTrue(NewsletterService.send_verification_email(subscriber))
        message = mail.outbox[0]
        self.assertEqual(message.from_email, "Gogir Labs <newsletter@gogirlabs.uk>")
        self.assertEqual(message.reply_to, ["hi@gogirlabs.uk"])
        self.assertEqual(message.to, ["reader@example.com"])
        self.assertIn(subscriber.verification_token, message.body)

    def test_campaign_is_refused_while_broadcasts_are_disabled(self):
        NewsletterSubscriber.objects.create(
            email="reader@example.com", is_active=True, is_verified=True
        )
        from apps.newsletter.services import NewsletterService

        result = NewsletterService.send_newsletter(subject="Issue", message="Body")

        self.assertFalse(result["success"])
        self.assertTrue(result["disabled"])
        self.assertEqual(result["sent_count"], 0)
        self.assertEqual(len(mail.outbox), 0)

    def test_preview_still_sends_one_message(self):
        from apps.newsletter.services import NewsletterService

        result = NewsletterService.send_newsletter(
            subject="Issue",
            message="Body",
            test_email="preview@example.com",
        )

        self.assertTrue(result["success"])
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ["preview@example.com"])
        self.assertEqual(
            mail.outbox[0].from_email, "Gogir Labs <newsletter@gogirlabs.uk>"
        )

    def test_send_endpoint_returns_403_when_campaigns_are_disabled(self):
        from apps.newsletter.views import NewsletterSendView

        staff = User.objects.create_user(
            username="mailstaff", password="testpass", is_staff=True
        )
        request = APIRequestFactory().post(
            "/api/v1/newsletter/send/",
            {"subject": "Issue", "message": "Body"},
            format="json",
        )
        force_authenticate(request, user=staff)

        response = NewsletterSendView.as_view()(request)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(response.data["disabled"])
        self.assertEqual(len(mail.outbox), 0)
