import secrets

from django.db import models
from django.utils import timezone


class NewsletterSubscriber(models.Model):
    """Newsletter subscriber model."""

    email = models.EmailField(unique=True, db_index=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    verification_token = models.CharField(
        max_length=64, unique=True, null=True, blank=True
    )
    unsubscribe_token = models.CharField(
        max_length=64, unique=True, null=True, blank=True
    )
    source = models.CharField(
        max_length=100, blank=True
    )  # 'homepage', 'contact', 'blog', etc.
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-subscribed_at"]
        verbose_name = "Newsletter Subscriber"
        verbose_name_plural = "Newsletter Subscribers"

    def __str__(self):
        return f"{self.email} ({'Active' if self.is_active else 'Inactive'})"

    def save(self, *args, **kwargs):
        if self.email:
            self.email = self.email.lower().strip()
        if not self.verification_token:
            self.verification_token = secrets.token_urlsafe(32)
        if not self.unsubscribe_token:
            self.unsubscribe_token = secrets.token_urlsafe(32)
        super().save(*args, **kwargs)

    def verify(self):
        """Mark subscriber as verified."""
        self.is_verified = True
        self.save(update_fields=["is_verified"])

    def unsubscribe(self):
        """Unsubscribe the user.

        Clears verification and rotates the verification token so a previously
        emailed verify link cannot re-confirm consent after opt-out.
        """
        self.is_active = False
        self.unsubscribed_at = timezone.now()
        self.is_verified = False
        self.verification_token = secrets.token_urlsafe(32)
        self.save(
            update_fields=[
                "is_active",
                "unsubscribed_at",
                "is_verified",
                "verification_token",
            ]
        )

    def resubscribe(self):
        """Resubscribe a previously unsubscribed user.

        Requires a fresh verification click; rotates the verification token so
        an old link cannot confirm the new consent.
        """
        self.is_active = True
        self.unsubscribed_at = None
        self.is_verified = False
        self.verification_token = secrets.token_urlsafe(32)
        self.save(
            update_fields=[
                "is_active",
                "unsubscribed_at",
                "is_verified",
                "verification_token",
            ]
        )


class PostAnnouncement(models.Model):
    """Outbox row for one-to-one new-post notices to subscribers."""

    STATUS_PENDING = "pending"
    STATUS_SENT = "sent"
    STATUS_SKIPPED = "skipped"
    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_SENT, "Sent"),
        (STATUS_SKIPPED, "Skipped"),
    ]

    post = models.OneToOneField(
        "blog.Post",
        on_delete=models.CASCADE,
        related_name="announcement",
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING
    )
    sent_count = models.PositiveIntegerField(default=0)
    delivered_to = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Announcement for {self.post_id} ({self.status})"

