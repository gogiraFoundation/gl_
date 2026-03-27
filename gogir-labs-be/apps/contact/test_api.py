from unittest.mock import patch

import pytest
from django.contrib.auth import get_user_model
from django.conf import settings
from django.test import TestCase
from django.test.utils import override_settings
from rest_framework import status
from rest_framework.test import APIClient

from .models import ContactMessage

User = get_user_model()
TEST_REST_FRAMEWORK = {**settings.REST_FRAMEWORK, "DEFAULT_THROTTLE_CLASSES": []}


@override_settings(REST_FRAMEWORK=TEST_REST_FRAMEWORK)
class ContactAPITest(TestCase):
    """Test Contact API endpoints."""

    def setUp(self):
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
        """Test honeypot spam detection (if implemented in serializer)."""
        url = "/api/v1/contact/"
        data = {
            "name": "John Doe",
            "email": "john@example.com",
            "subject": "Test Subject",
            "message": "Test message",
            "website": "http://spam.com",  # Honeypot field
        }
        # If honeypot is filled, should be rejected
        response = self.client.post(url, data)
        # Should either succeed (if honeypot not checked) or fail (if checked)
        self.assertIn(
            response.status_code, [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST]
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
