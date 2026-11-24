import pytest
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.test import TestCase
from django.utils import timezone

from .models import NewsletterSubscriber


class NewsletterSubscriberModelTest(TestCase):
    """Test NewsletterSubscriber model functionality and edge cases."""

    def test_subscriber_creation(self):
        """Test basic subscriber creation."""
        subscriber = NewsletterSubscriber.objects.create(
            email="test@example.com",
            name="Test User",
        )
        self.assertEqual(str(subscriber), "test@example.com (Active)")
        self.assertTrue(subscriber.is_active)
        self.assertFalse(subscriber.is_verified)
        self.assertTrue(subscriber.verification_token)
        self.assertTrue(subscriber.unsubscribe_token)

    def test_email_uniqueness(self):
        """Test email must be unique."""
        NewsletterSubscriber.objects.create(email="test@example.com")
        with self.assertRaises(IntegrityError):
            NewsletterSubscriber.objects.create(email="test@example.com")

    def test_token_generation_on_save(self):
        """Test tokens are generated on save."""
        subscriber = NewsletterSubscriber.objects.create(
            email="test@example.com",
        )
        self.assertIsNotNone(subscriber.verification_token)
        self.assertIsNotNone(subscriber.unsubscribe_token)
        self.assertEqual(
            len(subscriber.verification_token), 43
        )  # token_urlsafe(32) length
        self.assertEqual(len(subscriber.unsubscribe_token), 43)

    def test_duplicate_email_subscription(self):
        """Test duplicate email subscription attempt."""
        NewsletterSubscriber.objects.create(email="test@example.com")
        with self.assertRaises(IntegrityError):
            NewsletterSubscriber.objects.create(email="test@example.com")

    def test_invalid_email_format(self):
        """Test invalid email format handling."""
        # Django's EmailField validates at form/serializer level, not model level
        # At model level, it accepts the value but validation happens in forms
        # So we test that invalid email can be saved (validation is at API level)
        subscriber = NewsletterSubscriber.objects.create(email="invalid-email")
        # Model accepts it, but serializer will validate
        self.assertEqual(subscriber.email, "invalid-email")

    def test_verification_workflow(self):
        """Test email verification workflow."""
        subscriber = NewsletterSubscriber.objects.create(
            email="test@example.com",
        )
        self.assertFalse(subscriber.is_verified)

        subscriber.verify()
        self.assertTrue(subscriber.is_verified)

    def test_already_verified_subscriber(self):
        """Test verifying already verified subscriber."""
        subscriber = NewsletterSubscriber.objects.create(
            email="test@example.com",
        )
        subscriber.verify()
        self.assertTrue(subscriber.is_verified)

        # Verify again should still work
        subscriber.verify()
        self.assertTrue(subscriber.is_verified)

    def test_unsubscribe_workflow(self):
        """Test unsubscribe workflow rotates verification token."""
        subscriber = NewsletterSubscriber.objects.create(
            email="test@example.com",
            is_verified=True,
        )
        old_token = subscriber.verification_token
        self.assertTrue(subscriber.is_active)
        self.assertIsNone(subscriber.unsubscribed_at)

        subscriber.unsubscribe()
        self.assertFalse(subscriber.is_active)
        self.assertIsNotNone(subscriber.unsubscribed_at)
        self.assertFalse(subscriber.is_verified)
        self.assertNotEqual(subscriber.verification_token, old_token)

    def test_already_unsubscribed_user(self):
        """Test unsubscribing already unsubscribed user."""
        subscriber = NewsletterSubscriber.objects.create(
            email="test@example.com",
        )
        subscriber.unsubscribe()
        unsubscribed_at = subscriber.unsubscribed_at

        # Unsubscribe again
        subscriber.unsubscribe()
        self.assertFalse(subscriber.is_active)
        # unsubscribed_at should be updated
        self.assertIsNotNone(subscriber.unsubscribed_at)

    def test_resubscribe_functionality(self):
        """Test resubscribe requires fresh verification and rotates the token."""
        subscriber = NewsletterSubscriber.objects.create(
            email="test@example.com",
            is_verified=True,
        )
        old_token = subscriber.verification_token
        subscriber.unsubscribe()
        self.assertFalse(subscriber.is_active)

        subscriber.resubscribe()
        self.assertTrue(subscriber.is_active)
        self.assertIsNone(subscriber.unsubscribed_at)
        self.assertFalse(subscriber.is_verified)
        self.assertNotEqual(subscriber.verification_token, old_token)

    def test_email_is_normalized_to_lowercase(self):
        """Emails are stored lowercased so case variants collide on uniqueness."""
        subscriber = NewsletterSubscriber.objects.create(email="Test@Example.com")
        self.assertEqual(subscriber.email, "test@example.com")

        with self.assertRaises(Exception):
            NewsletterSubscriber.objects.create(email="TEST@example.com")

    def test_token_uniqueness(self):
        """Test token uniqueness (unlikely collision but testable)."""
        subscriber1 = NewsletterSubscriber.objects.create(
            email="test1@example.com",
        )
        subscriber2 = NewsletterSubscriber.objects.create(
            email="test2@example.com",
        )
        # Tokens should be different
        self.assertNotEqual(
            subscriber1.verification_token, subscriber2.verification_token
        )
        self.assertNotEqual(
            subscriber1.unsubscribe_token, subscriber2.unsubscribe_token
        )

    def test_source_field(self):
        """Test source field for tracking subscription origin."""
        subscriber = NewsletterSubscriber.objects.create(
            email="test@example.com",
            source="homepage",
        )
        self.assertEqual(subscriber.source, "homepage")

    def test_metadata_field(self):
        """Test metadata JSON field."""
        metadata = {"referrer": "google.com", "campaign": "summer2024"}
        subscriber = NewsletterSubscriber.objects.create(
            email="test@example.com",
            metadata=metadata,
        )
        self.assertEqual(subscriber.metadata, metadata)

    def test_ordering_by_subscribed_at(self):
        """Test subscribers are ordered by subscribed_at descending."""
        subscriber1 = NewsletterSubscriber.objects.create(
            email="test1@example.com",
        )
        subscriber2 = NewsletterSubscriber.objects.create(
            email="test2@example.com",
        )

        subscribers = NewsletterSubscriber.objects.all()
        self.assertEqual(subscribers[0], subscriber2)  # Most recent first
        self.assertEqual(subscribers[1], subscriber1)
