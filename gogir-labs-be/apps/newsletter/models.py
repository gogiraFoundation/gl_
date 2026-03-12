from django.db import models
from django.utils import timezone
import secrets


class NewsletterSubscriber(models.Model):
    """Newsletter subscriber model."""
    email = models.EmailField(unique=True, db_index=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=64, unique=True, null=True, blank=True)
    unsubscribe_token = models.CharField(max_length=64, unique=True, null=True, blank=True)
    source = models.CharField(max_length=100, blank=True)  # 'homepage', 'contact', 'blog', etc.
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-subscribed_at']
        verbose_name = 'Newsletter Subscriber'
        verbose_name_plural = 'Newsletter Subscribers'

    def __str__(self):
        return f"{self.email} ({'Active' if self.is_active else 'Inactive'})"

    def save(self, *args, **kwargs):
        if not self.verification_token:
            self.verification_token = secrets.token_urlsafe(32)
        if not self.unsubscribe_token:
            self.unsubscribe_token = secrets.token_urlsafe(32)
        super().save(*args, **kwargs)

    def verify(self):
        """Mark subscriber as verified."""
        self.is_verified = True
        self.save(update_fields=['is_verified'])

    def unsubscribe(self):
        """Unsubscribe the user."""
        self.is_active = False
        self.unsubscribed_at = timezone.now()
        self.save(update_fields=['is_active', 'unsubscribed_at'])

    def resubscribe(self):
        """Resubscribe a previously unsubscribed user."""
        self.is_active = True
        self.unsubscribed_at = None
        self.save(update_fields=['is_active', 'unsubscribed_at'])

