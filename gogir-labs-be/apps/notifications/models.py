from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

User = get_user_model()


# Notification Types
class NotificationType:
    CONTACT_MESSAGE = 'contact_message'
    BLOG_COMMENT = 'blog_comment'
    BLOG_COMMENT_APPROVED = 'blog_comment_approved'
    ANALYTICS_ALERT = 'analytics_alert'
    SYSTEM_ERROR = 'system_error'
    USER_LOGIN = 'user_login'
    CONTENT_PUBLISHED = 'content_published'
    CONTENT_UPDATED = 'content_updated'

    CHOICES = [
        (CONTACT_MESSAGE, 'Contact Message'),
        (BLOG_COMMENT, 'Blog Comment'),
        (BLOG_COMMENT_APPROVED, 'Blog Comment Approved'),
        (ANALYTICS_ALERT, 'Analytics Alert'),
        (SYSTEM_ERROR, 'System Error'),
        (USER_LOGIN, 'User Login'),
        (CONTENT_PUBLISHED, 'Content Published'),
        (CONTENT_UPDATED, 'Content Updated'),
    ]


class Notification(models.Model):
    """In-app notification model."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=50, choices=NotificationType.CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    data = models.JSONField(default=dict, blank=True, help_text="Additional notification context")
    read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    
    # Generic foreign key for related objects
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    related_object = GenericForeignKey('content_type', 'object_id')
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'read', '-created_at']),
            models.Index(fields=['type', 'created_at']),
            models.Index(fields=['user', 'created_at']),
        ]

    def __str__(self):
        return f"{self.type} - {self.title}"

    def mark_as_read(self):
        """Mark notification as read."""
        if not self.read:
            from django.utils import timezone
            self.read = True
            self.read_at = timezone.now()
            self.save(update_fields=['read', 'read_at'])


class NotificationPreference(models.Model):
    """User notification preferences."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notification_preferences')
    notification_type = models.CharField(max_length=50, choices=NotificationType.CHOICES)
    email_enabled = models.BooleanField(default=True)
    in_app_enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'notification_type']
        ordering = ['user', 'notification_type']

    def __str__(self):
        return f"{self.user.username} - {self.notification_type}"


class NotificationTemplate(models.Model):
    """Email templates for notifications."""
    notification_type = models.CharField(
        max_length=50,
        choices=NotificationType.CHOICES,
        unique=True
    )
    subject_template = models.CharField(max_length=200, help_text="Email subject template")
    body_template = models.TextField(help_text="Plain text email body template")
    html_template = models.TextField(blank=True, help_text="HTML email body template")
    enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['notification_type']

    def __str__(self):
        return f"{self.notification_type} Template"

