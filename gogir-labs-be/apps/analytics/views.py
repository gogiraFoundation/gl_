from datetime import timedelta

from django.db.models import Count, Q
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from .models import Event, PageView
from .serializers import (
    EventCreateSerializer,
    PageViewCreateSerializer,
)


def truncate_user_agent(value: str) -> str:
    return (value or "")[:200]


def parse_days(request, default: int = 30) -> int | Response:
    raw = request.query_params.get("days", str(default))
    try:
        days = int(raw)
    except (TypeError, ValueError):
        return Response(
            {"detail": "days must be an integer."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if days < 1 or days > 365:
        return Response(
            {"detail": "days must be between 1 and 365."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    return days


class PageViewTrackView(generics.CreateAPIView):
    """
    Track a page view.
    Public endpoint for analytics tracking.
    """

    queryset = PageView.objects.all()
    serializer_class = PageViewCreateSerializer
    permission_classes = [AllowAny]
    throttle_scope = "analytics_track"

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user_agent = truncate_user_agent(data.get("user_agent", ""))
        serializer.save(ip_address=None, user_agent=user_agent)
        return Response({"status": "tracked"}, status=status.HTTP_201_CREATED)


class PageViewStatsView(generics.GenericAPIView):
    """
    Get page view statistics (admin only).
    """

    permission_classes = [IsAdminUser]

    def get(self, request):
        days = parse_days(request)
        if isinstance(days, Response):
            return days
        start_date = timezone.now() - timedelta(days=days)

        total_views = PageView.objects.filter(created_at__gte=start_date).count()

        top_pages = (
            PageView.objects.filter(created_at__gte=start_date)
            .values("path")
            .annotate(count=Count("id"))
            .order_by("-count")[:10]
        )

        views_by_day = (
            PageView.objects.filter(created_at__gte=start_date)
            .annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(count=Count("id"))
            .order_by("day")
        )

        unique_visitors = (
            PageView.objects.filter(created_at__gte=start_date)
            .values("session_id")
            .distinct()
            .count()
        )

        top_referrers = (
            PageView.objects.filter(created_at__gte=start_date)
            .exclude(Q(referer="") | Q(referer__isnull=True))
            .values("referer")
            .annotate(count=Count("id"))
            .order_by("-count")[:10]
        )

        return Response(
            {
                "total_views": total_views,
                "unique_visitors": unique_visitors,
                "top_pages": list(top_pages),
                "views_by_day": list(views_by_day),
                "top_referrers": list(top_referrers),
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
    throttle_scope = "analytics_track"

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user_agent = truncate_user_agent(data.get("user_agent", ""))
        serializer.save(ip_address=None, user_agent=user_agent)
        return Response({"status": "tracked"}, status=status.HTTP_201_CREATED)


class EventStatsView(generics.GenericAPIView):
    """
    Get event statistics (admin only).
    """

    permission_classes = [IsAdminUser]

    def get(self, request):
        days = parse_days(request)
        if isinstance(days, Response):
            return days
        start_date = timezone.now() - timedelta(days=days)

        total_events = Event.objects.filter(created_at__gte=start_date).count()

        events_by_type = (
            Event.objects.filter(created_at__gte=start_date)
            .values("event_type")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        top_events = (
            Event.objects.filter(created_at__gte=start_date)
            .values("event_name")
            .annotate(count=Count("id"))
            .order_by("-count")[:10]
        )

        events_by_day = (
            Event.objects.filter(created_at__gte=start_date)
            .annotate(day=TruncDate("created_at"))
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
