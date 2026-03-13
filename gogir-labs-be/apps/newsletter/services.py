"""
Newsletter service for sending newsletters and managing subscriptions.
"""

import logging
from typing import List, Optional

from django.conf import settings
from django.template import Context, Template

from apps.notifications.services import EmailService

from .models import NewsletterSubscriber

logger = logging.getLogger(__name__)


class NewsletterService:
    """Service for newsletter operations."""

    @staticmethod
    def send_verification_email(subscriber: NewsletterSubscriber) -> bool:
        """Send verification email to subscriber."""
        try:
            verification_url = f"{settings.FRONTEND_URL or 'http://localhost:3000'}/newsletter/verify/{subscriber.verification_token}"

            subject = "Verify your newsletter subscription"
            plain_body = f"""
Hello {subscriber.name or 'there'},

Thank you for subscribing to our newsletter! Please verify your email address by clicking the link below:

{verification_url}

If you did not subscribe to this newsletter, please ignore this email.

Best regards,
Emmanuel Ugbaije
"""
            html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .button {{ display: inline-block; padding: 12px 24px; background-color: #8b5cf6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
        .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }}
    </style>
</head>
<body>
    <div class="container">
        <h2>Verify Your Newsletter Subscription</h2>
        <p>Hello {subscriber.name or 'there'},</p>
        <p>Thank you for subscribing to our newsletter! Please verify your email address by clicking the button below:</p>
        <a href="{verification_url}" class="button">Verify Email Address</a>
        <p>If you did not subscribe to this newsletter, please ignore this email.</p>
        <div class="footer">
            <p>Best regards,<br>Emmanuel Ugbaije</p>
        </div>
    </div>
</body>
</html>
"""

            return EmailService.send_email(
                recipient=subscriber.email,
                subject=subject,
                body=plain_body,
                html_body=html_body,
            )
        except Exception as e:
            logger.error(
                f"Failed to send verification email to {subscriber.email}: {e}"
            )
            return False

    @staticmethod
    def send_welcome_email(subscriber: NewsletterSubscriber) -> bool:
        """Send welcome email to verified subscriber."""
        try:
            unsubscribe_url = f"{settings.FRONTEND_URL or 'http://localhost:3000'}/newsletter/unsubscribe?token={subscriber.unsubscribe_token}"

            subject = "Welcome to our newsletter!"
            plain_body = f"""
Hello {subscriber.name or 'there'},

Thank you for subscribing to our newsletter! You'll receive updates about:

- Latest blog posts and articles
- New projects and portfolio updates
- Tips and insights on software development and data analysis
- Industry news and trends

You can unsubscribe at any time by visiting:
{unsubscribe_url}

Best regards,
Emmanuel Ugbaije
"""
            html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }}
        a {{ color: #8b5cf6; }}
    </style>
</head>
<body>
    <div class="container">
        <h2>Welcome to our newsletter!</h2>
        <p>Hello {subscriber.name or 'there'},</p>
        <p>Thank you for subscribing to our newsletter! You'll receive updates about:</p>
        <ul>
            <li>Latest blog posts and articles</li>
            <li>New projects and portfolio updates</li>
            <li>Tips and insights on software development and data analysis</li>
            <li>Industry news and trends</li>
        </ul>
        <p>You can <a href="{unsubscribe_url}">unsubscribe at any time</a>.</p>
        <div class="footer">
            <p>Best regards,<br>Emmanuel Ugbaije</p>
        </div>
    </div>
</body>
</html>
"""

            return EmailService.send_email(
                recipient=subscriber.email,
                subject=subject,
                body=plain_body,
                html_body=html_body,
            )
        except Exception as e:
            logger.error(f"Failed to send welcome email to {subscriber.email}: {e}")
            return False

    @staticmethod
    def send_newsletter(
        subject: str,
        message: str,
        html_message: Optional[str] = None,
        send_to_verified_only: bool = True,
        test_email: Optional[str] = None,
    ) -> dict:
        """Send newsletter to all active subscribers."""
        try:
            queryset = NewsletterSubscriber.objects.filter(is_active=True)
            if send_to_verified_only:
                queryset = queryset.filter(is_verified=True)

            subscribers = list(queryset.values_list("email", flat=True))

            if test_email:
                # Send test email to single recipient
                success = EmailService.send_email(
                    recipient=test_email,
                    subject=f"[TEST] {subject}",
                    body=message,
                    html_body=html_message,
                )
                return {
                    "success": success,
                    "sent_count": 1 if success else 0,
                    "total_count": 1,
                    "message": (
                        "Test email sent" if success else "Failed to send test email"
                    ),
                }

            # Send to all subscribers
            success_count = 0
            for email in subscribers:
                unsubscribe_token = NewsletterSubscriber.objects.get(
                    email=email
                ).unsubscribe_token
                unsubscribe_url = f"{settings.FRONTEND_URL or 'http://localhost:3000'}/newsletter/unsubscribe?token={unsubscribe_token}"

                # Add unsubscribe link to message
                plain_message = f"{message}\n\n---\nUnsubscribe: {unsubscribe_url}"
                html_with_unsubscribe = f"{html_message or message}<hr><p><a href='{unsubscribe_url}'>Unsubscribe</a></p>"

                if EmailService.send_email(
                    recipient=email,
                    subject=subject,
                    body=plain_message,
                    html_body=html_with_unsubscribe,
                ):
                    success_count += 1

            return {
                "success": True,
                "sent_count": success_count,
                "total_count": len(subscribers),
                "message": f"Newsletter sent to {success_count} of {len(subscribers)} subscribers",
            }
        except Exception as e:
            logger.error(f"Failed to send newsletter: {e}")
            return {
                "success": False,
                "sent_count": 0,
                "total_count": 0,
                "message": f"Error sending newsletter: {str(e)}",
            }

    @staticmethod
    def send_unsubscribe_confirmation(subscriber: NewsletterSubscriber) -> bool:
        """Send confirmation email after unsubscription."""
        try:
            subject = "You've been unsubscribed"
            plain_body = f"""
Hello {subscriber.name or 'there'},

You have been successfully unsubscribed from our newsletter. You will no longer receive emails from us.

If you changed your mind, you can resubscribe at any time by visiting our website.

Best regards,
Emmanuel Ugbaije
"""
            html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }}
    </style>
</head>
<body>
    <div class="container">
        <h2>You've been unsubscribed</h2>
        <p>Hello {subscriber.name or 'there'},</p>
        <p>You have been successfully unsubscribed from our newsletter. You will no longer receive emails from us.</p>
        <p>If you changed your mind, you can resubscribe at any time by visiting our website.</p>
        <div class="footer">
            <p>Best regards,<br>Emmanuel Ugbaije</p>
        </div>
    </div>
</body>
</html>
"""

            return EmailService.send_email(
                recipient=subscriber.email,
                subject=subject,
                body=plain_body,
                html_body=html_body,
            )
        except Exception as e:
            logger.error(
                f"Failed to send unsubscribe confirmation to {subscriber.email}: {e}"
            )
            return False
