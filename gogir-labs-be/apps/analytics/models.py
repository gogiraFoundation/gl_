from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey


class PageView(models.Model):
    """Page view tracking model."""

    path = models.CharField(max_length=500, db_index=True)
    referer = models.CharField(max_length=500, blank=True)
    user_agent = models.CharField(max_length=500, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    session_id = models.CharField(max_length=100, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["path", "created_at"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"{self.path} - {self.created_at}"


class Event(models.Model):
    """Custom event tracking model."""

    EVENT_TYPES = [
        ("click", "Click"),
        ("download", "Download"),
        ("form_submit", "Form Submit"),
        ("video_play", "Video Play"),
        ("custom", "Custom"),
    ]

    event_type = models.CharField(max_length=50, choices=EVENT_TYPES, default="custom")
    event_name = models.CharField(max_length=200, db_index=True)
    path = models.CharField(max_length=500, blank=True)
    metadata = models.JSONField(
        default=dict, blank=True, help_text="Additional event data"
    )
    user_agent = models.CharField(max_length=500, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    session_id = models.CharField(max_length=100, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["event_type", "created_at"]),
            models.Index(fields=["event_name", "created_at"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"{self.event_name} - {self.event_type} - {self.created_at}"
