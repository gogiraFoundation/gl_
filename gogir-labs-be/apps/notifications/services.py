"""
Notification service for sending notifications.
"""
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.core.mail import send_mail
from django.template import Template, Context
from django.conf import settings
from django.utils import timezone
from typing import Optional, Dict, Any, List
import logging

from .models import Notification, NotificationPreference, NotificationTemplate, NotificationType

User = get_user_model()
logger = logging.getLogger(__name__)


class EmailService:
    """Service for rendering and sending emails."""
    
    @staticmethod
    def render_template(template_string: str, context: Dict[str, Any]) -> str:
        """Render a template string with context."""
        template = Template(template_string)
        return template.render(Context(context))
    
    @staticmethod
    def send_email(
        recipient: str,
        subject: str,
        body: str,
        html_body: Optional[str] = None,
        from_email: Optional[str] = None
    ) -> bool:
        """Send an email notification."""
        try:
            from_email = from_email or settings.DEFAULT_FROM_EMAIL
            send_mail(
                subject=subject,
                message=body,
                from_email=from_email,
                recipient_list=[recipient],
                html_message=html_body,
                fail_silently=False,
            )
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {recipient}: {e}")
            return False
    
    @staticmethod
    def send_bulk_email(
        recipients: List[str],
        subject: str,
        body: str,
        html_body: Optional[str] = None,
        from_email: Optional[str] = None
    ) -> int:
        """Send email to multiple recipients."""
        success_count = 0
        for recipient in recipients:
            if EmailService.send_email(recipient, subject, body, html_body, from_email):
                success_count += 1
        return success_count


class NotificationService:
    """Central service for sending notifications."""
    
    @staticmethod
    def get_user_preference(user: User, notification_type: str) -> NotificationPreference:
        """Get or create notification preference for user."""
        preference, created = NotificationPreference.objects.get_or_create(
            user=user,
            notification_type=notification_type,
            defaults={
                'email_enabled': True,
                'in_app_enabled': True,
            }
        )
        return preference
    
    @staticmethod
    def create_in_app_notification(
        user: User,
        notification_type: str,
        title: str,
        message: str,
        data: Optional[Dict[str, Any]] = None,
        related_object: Optional[Any] = None
    ) -> Notification:
        """Create an in-app notification."""
        notification = Notification.objects.create(
            user=user,
            type=notification_type,
            title=title,
            message=message,
            data=data or {},
        )
        
        if related_object:
            notification.content_type = ContentType.objects.get_for_model(related_object)
            notification.object_id = related_object.pk
            notification.save()
        
        return notification
    
    @staticmethod
    def send_email_notification(
        user: User,
        notification_type: str,
        context: Dict[str, Any],
        custom_subject: Optional[str] = None,
        custom_body: Optional[str] = None
    ) -> bool:
        """Send email notification using template."""
        try:
            template = NotificationTemplate.objects.get(
                notification_type=notification_type,
                enabled=True
            )
        except NotificationTemplate.DoesNotExist:
            # Use default template if not found
            subject = custom_subject or f"Notification: {notification_type}"
            body = custom_body or context.get('message', 'You have a new notification.')
            html_body = None
        else:
            subject = EmailService.render_template(template.subject_template, context)
            body = EmailService.render_template(template.body_template, context)
            html_body = EmailService.render_template(template.html_template, context) if template.html_template else None
        
        return EmailService.send_email(
            recipient=user.email,
            subject=subject,
            body=body,
            html_body=html_body
        )
    
    @staticmethod
    def send_notification(
        user: User,
        notification_type: str,
        title: str,
        message: str,
        data: Optional[Dict[str, Any]] = None,
        related_object: Optional[Any] = None,
        send_email: Optional[bool] = None,
        send_in_app: Optional[bool] = None
    ) -> Notification:
        """
        Send a notification to a user.
        
        Args:
            user: User to send notification to
            notification_type: Type of notification
            title: Notification title
            message: Notification message
            data: Additional data for the notification
            related_object: Related object (e.g., ContactMessage, Post)
            send_email: Override email preference (None = use preference)
            send_in_app: Override in-app preference (None = use preference)
        """
        # Get user preferences
        preference = NotificationService.get_user_preference(user, notification_type)
        
        # Determine if we should send email
        should_send_email = send_email if send_email is not None else preference.email_enabled
        should_send_in_app = send_in_app if send_in_app is not None else preference.in_app_enabled
        
        # Create in-app notification
        notification = None
        if should_send_in_app:
            notification = NotificationService.create_in_app_notification(
                user=user,
                notification_type=notification_type,
                title=title,
                message=message,
                data=data,
                related_object=related_object
            )
        
        # Send email notification
        if should_send_email and user.email:
            email_context = {
                'user': user,
                'title': title,
                'message': message,
                'notification_type': notification_type,
                **(data or {})
            }
            NotificationService.send_email_notification(
                user=user,
                notification_type=notification_type,
                context=email_context
            )
        
        return notification
    
    @staticmethod
    def send_bulk_notification(
        users: List[User],
        notification_type: str,
        title: str,
        message: str,
        data: Optional[Dict[str, Any]] = None,
        send_email: Optional[bool] = None,
        send_in_app: Optional[bool] = None
    ) -> List[Notification]:
        """Send notification to multiple users."""
        notifications = []
        for user in users:
            notification = NotificationService.send_notification(
                user=user,
                notification_type=notification_type,
                title=title,
                message=message,
                data=data,
                send_email=send_email,
                send_in_app=send_in_app
            )
            if notification:
                notifications.append(notification)
        return notifications
    
    @staticmethod
    def notify_admins(
        notification_type: str,
        title: str,
        message: str,
        data: Optional[Dict[str, Any]] = None,
        related_object: Optional[Any] = None
    ) -> List[Notification]:
        """Send notification to all admin users."""
        admin_users = User.objects.filter(is_staff=True, is_active=True)
        return NotificationService.send_bulk_notification(
            users=list(admin_users),
            notification_type=notification_type,
            title=title,
            message=message,
            data=data
        )

