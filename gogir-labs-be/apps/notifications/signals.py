"""
Django signals for system-wide notifications.
"""

from django.contrib.auth import get_user_model
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver

from .models import NotificationType
from .services import NotificationService

User = get_user_model()


@receiver(user_logged_in)
def notify_on_login(sender, request, user, **kwargs):
    """Send notification when admin user logs in."""
    if user.is_staff:
        NotificationService.send_notification(
            user=user,
            notification_type=NotificationType.USER_LOGIN,
            title="Successful Login",
            message=f"You have successfully logged in to the admin panel.",
            data={
                "ip_address": request.META.get("REMOTE_ADDR", "Unknown"),
                "user_agent": request.META.get("HTTP_USER_AGENT", "Unknown"),
            },
            send_email=False,  # Don't email on every login
        )
