import pytest
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.db import IntegrityError
from django.utils import timezone
from .models import (
    Notification,
    NotificationPreference,
    NotificationTemplate,
    NotificationType,
)
from apps.blog.models import Post, Category
from apps.contact.models import ContactMessage

User = get_user_model()


class NotificationModelTest(TestCase):
    """Test Notification model functionality and edge cases."""

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")

    def test_notification_creation(self):
        """Test basic notification creation."""
        notification = Notification.objects.create(
            user=self.user,
            type=NotificationType.CONTACT_MESSAGE,
            title="Test Notification",
            message="Test message",
        )
        self.assertEqual(
            str(notification), f"{NotificationType.CONTACT_MESSAGE} - Test Notification"
        )
        self.assertFalse(notification.read)
        self.assertIsNone(notification.read_at)

    def test_generic_foreign_key_relationship(self):
        """Test generic foreign key relationships."""
        category = Category.objects.create(name="Test Category")
        content_type = ContentType.objects.get_for_model(Category)

        notification = Notification.objects.create(
            user=self.user,
            type=NotificationType.CONTENT_PUBLISHED,
            title="Test",
            message="Test",
            content_type=content_type,
            object_id=category.id,
        )
        self.assertEqual(notification.related_object, category)

    def test_mark_as_read_functionality(self):
        """Test mark_as_read functionality."""
        notification = Notification.objects.create(
            user=self.user,
            type=NotificationType.CONTACT_MESSAGE,
            title="Test",
            message="Test",
        )
        self.assertFalse(notification.read)
        self.assertIsNone(notification.read_at)

        notification.mark_as_read()
        self.assertTrue(notification.read)
        self.assertIsNotNone(notification.read_at)

    def test_marking_already_read_notification(self):
        """Test marking already read notification."""
        notification = Notification.objects.create(
            user=self.user,
            type=NotificationType.CONTACT_MESSAGE,
            title="Test",
            message="Test",
        )
        notification.mark_as_read()
        read_at = notification.read_at

        # Mark as read again
        notification.mark_as_read()
        self.assertTrue(notification.read)
        # read_at should be updated
        self.assertIsNotNone(notification.read_at)

    def test_notification_without_related_object(self):
        """Test notification without related object."""
        notification = Notification.objects.create(
            user=self.user,
            type=NotificationType.SYSTEM_ERROR,
            title="Test",
            message="Test",
        )
        self.assertIsNone(notification.related_object)
        self.assertIsNone(notification.content_type)
        self.assertIsNone(notification.object_id)

    def test_data_json_field(self):
        """Test data JSON field."""
        data = {"key": "value", "number": 123}
        notification = Notification.objects.create(
            user=self.user,
            type=NotificationType.CONTACT_MESSAGE,
            title="Test",
            message="Test",
            data=data,
        )
        self.assertEqual(notification.data, data)

    def test_ordering_by_created_at(self):
        """Test notifications are ordered by created_at descending."""
        notification1 = Notification.objects.create(
            user=self.user,
            type=NotificationType.CONTACT_MESSAGE,
            title="First",
            message="First",
        )
        notification2 = Notification.objects.create(
            user=self.user,
            type=NotificationType.CONTACT_MESSAGE,
            title="Second",
            message="Second",
        )

        notifications = Notification.objects.all()
        self.assertEqual(notifications[0], notification2)  # Most recent first
        self.assertEqual(notifications[1], notification1)


class NotificationPreferenceModelTest(TestCase):
    """Test NotificationPreference model functionality and edge cases."""

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")

    def test_preference_creation(self):
        """Test basic preference creation."""
        preference = NotificationPreference.objects.create(
            user=self.user,
            notification_type=NotificationType.CONTACT_MESSAGE,
            email_enabled=True,
            in_app_enabled=True,
        )
        self.assertEqual(
            str(preference),
            f"{self.user.username} - {NotificationType.CONTACT_MESSAGE}",
        )
        self.assertTrue(preference.email_enabled)
        self.assertTrue(preference.in_app_enabled)

    def test_unique_constraint_user_notification_type(self):
        """Test unique constraint on user + notification_type."""
        NotificationPreference.objects.create(
            user=self.user,
            notification_type=NotificationType.CONTACT_MESSAGE,
        )
        with self.assertRaises(IntegrityError):
            NotificationPreference.objects.create(
                user=self.user,
                notification_type=NotificationType.CONTACT_MESSAGE,
            )

    def test_duplicate_preferences(self):
        """Test duplicate preferences are prevented."""
        NotificationPreference.objects.create(
            user=self.user,
            notification_type=NotificationType.CONTACT_MESSAGE,
        )
        with self.assertRaises(IntegrityError):
            NotificationPreference.objects.create(
                user=self.user,
                notification_type=NotificationType.CONTACT_MESSAGE,
            )

    def test_email_in_app_toggle(self):
        """Test email and in-app toggles."""
        preference = NotificationPreference.objects.create(
            user=self.user,
            notification_type=NotificationType.CONTACT_MESSAGE,
            email_enabled=True,
            in_app_enabled=False,
        )
        self.assertTrue(preference.email_enabled)
        self.assertFalse(preference.in_app_enabled)

        preference.email_enabled = False
        preference.in_app_enabled = True
        preference.save()
        self.assertFalse(preference.email_enabled)
        self.assertTrue(preference.in_app_enabled)

    def test_default_values(self):
        """Test default values for preferences."""
        preference = NotificationPreference.objects.create(
            user=self.user,
            notification_type=NotificationType.CONTACT_MESSAGE,
        )
        self.assertTrue(preference.email_enabled)  # Default True
        self.assertTrue(preference.in_app_enabled)  # Default True


class NotificationTemplateModelTest(TestCase):
    """Test NotificationTemplate model functionality."""

    def test_template_creation(self):
        """Test basic template creation."""
        template = NotificationTemplate.objects.create(
            notification_type=NotificationType.CONTACT_MESSAGE,
            subject_template="New Contact: {{title}}",
            body_template="You have a new contact message.",
            html_template="<p>You have a new contact message.</p>",
        )
        self.assertEqual(str(template), f"{NotificationType.CONTACT_MESSAGE} Template")
        self.assertTrue(template.enabled)

    def test_notification_type_uniqueness(self):
        """Test notification_type must be unique."""
        NotificationTemplate.objects.create(
            notification_type=NotificationType.CONTACT_MESSAGE,
            subject_template="Test",
            body_template="Test",
        )
        with self.assertRaises(IntegrityError):
            NotificationTemplate.objects.create(
                notification_type=NotificationType.CONTACT_MESSAGE,
                subject_template="Test 2",
                body_template="Test 2",
            )

    def test_enabled_field(self):
        """Test enabled field."""
        template = NotificationTemplate.objects.create(
            notification_type=NotificationType.CONTACT_MESSAGE,
            subject_template="Test",
            body_template="Test",
            enabled=False,
        )
        self.assertFalse(template.enabled)

        template.enabled = True
        template.save()
        self.assertTrue(template.enabled)
