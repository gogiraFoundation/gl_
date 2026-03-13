"""
Middleware for system error notifications.
"""

import logging

from django.utils.deprecation import MiddlewareMixin

from .models import NotificationType
from .services import NotificationService

logger = logging.getLogger(__name__)


class ErrorNotificationMiddleware(MiddlewareMixin):
    """Middleware to send notifications on system errors."""

    def process_exception(self, request, exception):
        """Send notification when an exception occurs."""
        # Only notify on 500 errors, not 404s
        if hasattr(exception, "status_code") and exception.status_code == 404:
            return None

        try:
            NotificationService.notify_admins(
                notification_type=NotificationType.SYSTEM_ERROR,
                title=f"System Error: {type(exception).__name__}",
                message=f"An error occurred: {str(exception)}\n\nPath: {request.path}\nMethod: {request.method}",
                data={
                    "error_type": type(exception).__name__,
                    "error_message": str(exception),
                    "path": request.path,
                    "method": request.method,
                    "user": (
                        str(request.user)
                        if request.user.is_authenticated
                        else "Anonymous"
                    ),
                    "timestamp": str(
                        logger.handlers[0].formatter.formatTime(
                            logger.makeRecord("", 0, "", 0, "", (), None)
                        )
                        if logger.handlers
                        else ""
                    ),
                },
            )
        except Exception as e:
            # Don't let notification errors break the app
            logger.error(f"Failed to send error notification: {e}")

        return None
