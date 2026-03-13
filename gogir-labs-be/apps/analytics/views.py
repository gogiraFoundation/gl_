from datetime import timedelta

from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.notifications.models import NotificationType
from apps.notifications.services import NotificationService

from .models import Event, PageView
from .serializers import (
    EventCreateSerializer,
    EventSerializer,
    PageViewCreateSerializer,
    PageViewSerializer,
)


class PageViewTrackView(generics.CreateAPIView):
    """
    Track a page view.
    Public endpoint for analytics tracking.
    """

    queryset = PageView.objects.all()
    serializer_class = PageViewCreateSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        # Extract IP address from request if not provided
        data = request.data.copy()
        if not data.get("ip_address"):
            # Get client IP from request
            x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
            if x_forwarded_for:
                ip = x_forwarded_for.split(",")[0].strip()
            else:
                ip = request.META.get("REMOTE_ADDR")
            data["ip_address"] = ip

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        pageview = serializer.save()

        # Check for traffic spikes (optional - can be configured)
        # This is a simple example - you can make it more sophisticated
        # Only check every 10th view to avoid too many notifications
        total_views = PageView.objects.filter(path=pageview.path).count()
        if total_views % 10 == 0:  # Check every 10 views
            recent_views = PageView.objects.filter(
                path=pageview.path,
                created_at__gte=timezone.now() - timedelta(minutes=5),
            ).count()

            # Alert if more than 100 views in 5 minutes (configurable threshold)
            if recent_views > 100:
                NotificationService.notify_admins(
                    notification_type=NotificationType.ANALYTICS_ALERT,
                    title=f"Traffic Spike Detected: {pageview.path}",
                    message=f"High traffic detected on {pageview.path}\n\n{recent_views} views in the last 5 minutes.",
                    data={
                        "alert_type": "Traffic Spike",
                        "path": pageview.path,
                        "view_count": recent_views,
                        "time_window": "5 minutes",
                    },
                    related_object=pageview,
                )

        return Response({"status": "tracked"}, status=status.HTTP_201_CREATED)


class PageViewStatsView(generics.GenericAPIView):
    """
    Get page view statistics (admin only).
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get date range from query params
        days = int(request.query_params.get("days", 30))
        start_date = timezone.now() - timedelta(days=days)

        # Total page views
        total_views = PageView.objects.filter(created_at__gte=start_date).count()

        # Top pages
        top_pages = (
            PageView.objects.filter(created_at__gte=start_date)
            .values("path")
            .annotate(count=Count("id"))
            .order_by("-count")[:10]
        )

        # Views by day
        views_by_day = (
            PageView.objects.filter(created_at__gte=start_date)
            .extra(select={"day": "date(created_at)"})
            .values("day")
            .annotate(count=Count("id"))
            .order_by("day")
        )

        # Unique visitors (by session)
        unique_visitors = (
            PageView.objects.filter(created_at__gte=start_date)
            .values("session_id")
            .distinct()
            .count()
        )

        return Response(
            {
                "total_views": total_views,
                "unique_visitors": unique_visitors,
                "top_pages": list(top_pages),
                "views_by_day": list(views_by_day),
            }
        )


class EventTrackView(generics.CreateAPIView):
    """
    Track a custom event.
    Public endpoint for event tracking.
    """

    queryset = Event.objects.all()
    serializer_class = EventCreateSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        # Extract IP address from request if not provided
        data = request.data.copy()
        if not data.get("ip_address"):
            # Get client IP from request
            x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
            if x_forwarded_for:
                ip = x_forwarded_for.split(",")[0].strip()
            else:
                ip = request.META.get("REMOTE_ADDR")
            data["ip_address"] = ip

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"status": "tracked"}, status=status.HTTP_201_CREATED)


class EventStatsView(generics.GenericAPIView):
    """
    Get event statistics (admin only).
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get date range from query params
        days = int(request.query_params.get("days", 30))
        start_date = timezone.now() - timedelta(days=days)

        # Total events
        total_events = Event.objects.filter(created_at__gte=start_date).count()

        # Events by type
        events_by_type = (
            Event.objects.filter(created_at__gte=start_date)
            .values("event_type")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        # Top events
        top_events = (
            Event.objects.filter(created_at__gte=start_date)
            .values("event_name")
            .annotate(count=Count("id"))
            .order_by("-count")[:10]
        )

        # Events by day
        events_by_day = (
            Event.objects.filter(created_at__gte=start_date)
            .extra(select={"day": "date(created_at)"})
            .values("day")
            .annotate(count=Count("id"))
            .order_by("day")
        )

        return Response(
            {
                "total_events": total_events,
                "events_by_type": list(events_by_type),
                "top_events": list(top_events),
                "events_by_day": list(events_by_day),
            }
        )
