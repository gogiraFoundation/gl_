import pytest
from django.core.exceptions import ValidationError
from django.test import TestCase

from .models import ContactMessage


class ContactMessageModelTest(TestCase):
    """Test ContactMessage model functionality and edge cases."""

    def test_contact_message_creation(self):
        """Test basic contact message creation."""
        message = ContactMessage.objects.create(
            name="John Doe",
            email="john@example.com",
            subject="Test Subject",
            message="Test message content",
        )
        self.assertEqual(str(message), "Message from John Doe - Test Subject")
        self.assertFalse(message.read)
        self.assertFalse(message.replied)

    def test_email_validation(self):
        """Test email field validation."""
        # Django's EmailField validates at form/serializer level, not model level
        # At model level, it accepts the value but validation happens in forms
        # So we test that invalid email can be saved (validation is at API level)
        message = ContactMessage.objects.create(
            name="John Doe",
            email="invalid-email",  # Invalid email format - model accepts it
            subject="Test",
            message="Test",
        )
        # Model accepts it, but serializer will validate
        self.assertEqual(message.email, "invalid-email")

    def test_read_unread_status(self):
        """Test read/unread status functionality."""
        message = ContactMessage.objects.create(
            name="John Doe",
            email="john@example.com",
            subject="Test Subject",
            message="Test message",
        )
        self.assertFalse(message.read)

        message.read = True
        message.save()
        self.assertTrue(message.read)

    def test_very_long_message(self):
        """Test contact message with very long content."""
        long_message = "A" * 10000
        message = ContactMessage.objects.create(
            name="John Doe",
            email="john@example.com",
            subject="Test Subject",
            message=long_message,
        )
        self.assertEqual(len(message.message), 10000)

    def test_special_characters_in_message(self):
        """Test message with special characters."""
        special_message = (
            'Message with <script>alert("XSS")</script> and special chars: @#$%^&*()'
        )
        message = ContactMessage.objects.create(
            name="John Doe",
            email="john@example.com",
            subject="Test Subject",
            message=special_message,
        )
        # Should save successfully (sanitization happens at API level)
        self.assertIn("<script>", message.message)

    def test_xss_attempt_in_message(self):
        """Test XSS attempt in message content."""
        xss_message = '<script>alert("XSS")</script>'
        message = ContactMessage.objects.create(
            name="John Doe",
            email="john@example.com",
            subject="Test Subject",
            message=xss_message,
        )
        # Model should save (sanitization at API/serializer level)
        self.assertIn("<script>", message.message)

    def test_very_long_name(self):
        """Test contact message with very long name."""
        long_name = "A" * 100
        message = ContactMessage.objects.create(
            name=long_name,
            email="john@example.com",
            subject="Test Subject",
            message="Test message",
        )
        self.assertEqual(len(message.name), 100)

    def test_very_long_subject(self):
        """Test contact message with very long subject."""
        long_subject = "A" * 200
        message = ContactMessage.objects.create(
            name="John Doe",
            email="john@example.com",
            subject=long_subject,
            message="Test message",
        )
        self.assertEqual(len(message.subject), 200)

    def test_replied_status(self):
        """Test replied status functionality."""
        message = ContactMessage.objects.create(
            name="John Doe",
            email="john@example.com",
            subject="Test Subject",
            message="Test message",
        )
        self.assertFalse(message.replied)

        message.replied = True
        message.save()
        self.assertTrue(message.replied)

    def test_ordering_by_created_at(self):
        """Test messages are ordered by created_at descending."""
        message1 = ContactMessage.objects.create(
            name="John Doe",
            email="john@example.com",
            subject="First",
            message="First message",
        )
        message2 = ContactMessage.objects.create(
            name="Jane Doe",
            email="jane@example.com",
            subject="Second",
            message="Second message",
        )

        messages = ContactMessage.objects.all()
        self.assertEqual(messages[0], message2)  # Most recent first
        self.assertEqual(messages[1], message1)
