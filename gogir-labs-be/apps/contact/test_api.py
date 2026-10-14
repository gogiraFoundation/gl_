from unittest.mock import patch

import pytest
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import TestCase
from django.test.utils import override_settings
from rest_framework import status
from rest_framework.test import APIClient

from .models import ContactMessage

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


@override_settings(REST_FRAMEWORK=TEST_REST_FRAMEWORK)
class ContactAPITest(TestCase):
    """Test Contact API endpoints."""

    def setUp(self):
        cache.clear()
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.staff_user = User.objects.create_user(
            username="staffuser", password="testpass", is_staff=True
        )

    @patch("apps.notifications.services.NotificationService.notify_admins")
    def test_create_contact_message(self, mock_notify):
        """Test POST /api/v1/contact/ creates contact message."""
        url = "/api/v1/contact/"
        data = {
            "name": "John Doe",
            "email": "john@example.com",
            "subject": "Test Subject",
            "message": "Test message content",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("message", response.data)
        self.assertTrue(
            ContactMessage.objects.filter(email="john@example.com").exists()
        )
        mock_notify.assert_called_once()

    def test_create_contact_message_missing_required_fields(self):
        """Test contact message creation with missing required fields."""
        url = "/api/v1/contact/"
        data = {
            "name": "John Doe",
            # Missing email, subject, message
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_contact_message_invalid_email(self):
        """Test contact message creation with invalid email format."""
        url = "/api/v1/contact/"
        data = {
            "name": "John Doe",
            "email": "invalid-email",
            "subject": "Test Subject",
            "message": "Test message",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_contact_message_honeypot_spam_detection(self):
        """Filled honeypot is rejected."""
        url = "/api/v1/contact/"
        data = {
            "name": "John Doe",
            "email": "john@example.com",
            "subject": "Test Subject",
            "message": "Test message",
            "website": "http://spam.com",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("apps.notifications.services.NotificationService.notify_admins")
    def test_create_contact_message_empty_honeypot_succeeds(self, mock_notify):
        """Empty honeypot field is stripped and does not crash create."""
        url = "/api/v1/contact/"
        data = {
            "name": "John Doe",
            "email": "empty-honey@example.com",
            "subject": "Test Subject",
            "message": "Test message body",
            "website": "",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            ContactMessage.objects.filter(email="empty-honey@example.com").exists()
        )

    def test_create_contact_message_very_long(self):
        """Test contact message with very long content."""
        url = "/api/v1/contact/"
        data = {
            "name": "John Doe",
            "email": "john@example.com",
            "subject": "Test Subject",
            "message": "A" * 10000,
        }
        response = self.client.post(url, data)
        # Should either succeed or return validation error
        self.assertIn(
            response.status_code, [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST]
        )

    def test_create_contact_message_xss_attempt(self):
        """Test XSS attempt in contact message."""
        url = "/api/v1/contact/"
        data = {
            "name": "John Doe",
            "email": "john@example.com",
            "subject": "Test Subject",
            "message": '<script>alert("XSS")</script>',
        }
        response = self.client.post(url, data)
        # Should save (sanitization happens at display level)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        message = ContactMessage.objects.get(email="john@example.com")
        self.assertIn("<script>", message.message)

    def test_list_contact_messages_requires_authentication(self):
        """Test GET /api/v1/contact/messages/ requires authentication."""
        url = "/api/v1/contact/messages/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_contact_messages_authenticated(self):
        """Test GET /api/v1/contact/messages/ with authentication."""
        # Clear any existing messages first
        ContactMessage.objects.all().delete()
        ContactMessage.objects.create(
            name="John Doe",
            email="john@example.com",
            subject="Test",
            message="Test message",
        )
        self.client.force_authenticate(user=self.staff_user)
        url = "/api/v1/contact/messages/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check if response is paginated or a list
        if isinstance(response.data, list):
            self.assertEqual(len(response.data), 1)
        else:
            # If paginated, check results
            self.assertGreaterEqual(len(response.data.get("results", [])), 1)

    def test_list_contact_messages_filter_by_read_status(self):
        """Test filtering contact messages by read status."""
        # Clear any existing messages first
        ContactMessage.objects.all().delete()
        read_message = ContactMessage.objects.create(
            name="John Doe",
            email="john@example.com",
            subject="Read",
            message="Message",
            read=True,
        )
        unread_message = ContactMessage.objects.create(
            name="Jane Doe",
            email="jane@example.com",
            subject="Unread",
            message="Message",
            read=False,
        )
        self.client.force_authenticate(user=self.staff_user)
        url = "/api/v1/contact/messages/"

        # Filter by read=True
        response = self.client.get(url, {"read": "true"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = (
            response.data
            if isinstance(response.data, list)
            else response.data.get("results", [])
        )
        self.assertGreaterEqual(len(data), 1)
        # Check that read message is in results
        read_ids = [msg["id"] for msg in data]
        self.assertIn(read_message.id, read_ids)

        # Filter by read=false
        response = self.client.get(url, {"read": "false"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = (
            response.data
            if isinstance(response.data, list)
            else response.data.get("results", [])
        )
        self.assertGreaterEqual(len(data), 1)
        # Check that unread message is in results
        unread_ids = [msg["id"] for msg in data]
        self.assertIn(unread_message.id, unread_ids)

    def test_list_omits_message_body(self):
        ContactMessage.objects.all().delete()
        ContactMessage.objects.create(
            name="John",
            email="john@example.com",
            subject="Sub",
            message="Secret body",
        )
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.get("/api/v1/contact/messages/")
        data = (
            response.data
            if isinstance(response.data, list)
            else response.data.get("results", [])
        )
        self.assertEqual(len(data), 1)
        self.assertNotIn("message", data[0])
        self.assertNotIn("website", data[0])

    def test_list_filter_by_replied(self):
        ContactMessage.objects.all().delete()
        replied = ContactMessage.objects.create(
            name="A",
            email="a@example.com",
            subject="A",
            message="m",
            replied=True,
        )
        ContactMessage.objects.create(
            name="B",
            email="b@example.com",
            subject="B",
            message="m",
            replied=False,
        )
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.get("/api/v1/contact/messages/", {"replied": "true"})
        data = (
            response.data
            if isinstance(response.data, list)
            else response.data.get("results", [])
        )
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["id"], replied.id)

    def test_detail_requires_staff(self):
        msg = ContactMessage.objects.create(
            name="John",
            email="john@example.com",
            subject="Sub",
            message="Body text",
        )
        response = self.client.get(f"/api/v1/contact/messages/{msg.id}/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"/api/v1/contact/messages/{msg.id}/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_detail_returns_body(self):
        msg = ContactMessage.objects.create(
            name="John",
            email="john@example.com",
            subject="Sub",
            message="Body text",
        )
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.get(f"/api/v1/contact/messages/{msg.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Body text")
        self.assertIn("reply_body", response.data)

    def test_patch_read_status(self):
        msg = ContactMessage.objects.create(
            name="John",
            email="john@example.com",
            subject="Sub",
            message="Body",
            read=False,
        )
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.patch(
            f"/api/v1/contact/messages/{msg.id}/",
            {"read": True},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        msg.refresh_from_db()
        self.assertTrue(msg.read)

    def test_patch_cannot_set_replied_flag(self):
        """replied is owned by the reply endpoint, not PATCH."""
        msg = ContactMessage.objects.create(
            name="John",
            email="john@example.com",
            subject="Sub",
            message="Body",
            replied=False,
        )
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.patch(
            f"/api/v1/contact/messages/{msg.id}/",
            {"replied": True},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        msg.refresh_from_db()
        self.assertFalse(msg.replied)

    @patch("apps.contact.views.EmailService.send_email", return_value=True)
    def test_reply_sends_email_and_marks_replied(self, mock_send):
        msg = ContactMessage.objects.create(
            name="John",
            email="john@example.com",
            subject="Hello",
            message="Original",
        )
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.post(
            f"/api/v1/contact/messages/{msg.id}/reply/",
            {"message": "Thanks for reaching out."},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_send.assert_called_once()
        self.assertEqual(mock_send.call_args.kwargs["recipient"], "john@example.com")
        msg.refresh_from_db()
        self.assertTrue(msg.replied)
        self.assertTrue(msg.read)
        self.assertEqual(msg.reply_body, "Thanks for reaching out.")
        self.assertIsNotNone(msg.replied_at)

    def test_reply_empty_message_is_400(self):
        msg = ContactMessage.objects.create(
            name="John",
            email="john@example.com",
            subject="Hello",
            message="Original",
        )
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.post(
            f"/api/v1/contact/messages/{msg.id}/reply/",
            {"message": ""},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("apps.contact.views.EmailService.send_email", return_value=False)
    def test_reply_mail_failure_leaves_unreplied(self, mock_send):
        msg = ContactMessage.objects.create(
            name="John",
            email="john@example.com",
            subject="Hello",
            message="Original",
        )
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.post(
            f"/api/v1/contact/messages/{msg.id}/reply/",
            {"message": "Thanks"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        msg.refresh_from_db()
        self.assertFalse(msg.replied)
        self.assertFalse(msg.read)

    @patch("apps.contact.views.EmailService.send_email", return_value=True)
    def test_reply_rejects_already_replied(self, mock_send):
        msg = ContactMessage.objects.create(
            name="John",
            email="john@example.com",
            subject="Hello",
            message="Original",
            replied=True,
            reply_body="Already sent",
        )
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.post(
            f"/api/v1/contact/messages/{msg.id}/reply/",
            {"message": "Second reply"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        mock_send.assert_not_called()
        msg.refresh_from_db()
        self.assertEqual(msg.reply_body, "Already sent")

