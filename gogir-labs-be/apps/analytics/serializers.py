from rest_framework import serializers

from .models import Event, PageView


class PageViewSerializer(serializers.ModelSerializer):
    # CharField avoids DRF 3.14 + Django 5.2 GenericIPAddressField validator unpack bug.
    ip_address = serializers.CharField(read_only=True, allow_null=True)

    class Meta:
        model = PageView
        fields = [
            "id",
            "path",
            "referer",
            "user_agent",
            "ip_address",
            "session_id",
            "created_at",
        ]
        read_only_fields = ["ip_address", "created_at"]


class PageViewCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating page views (IP is forced null in the view)."""

    class Meta:
        model = PageView
        fields = ["path", "referer", "user_agent", "session_id"]


class EventSerializer(serializers.ModelSerializer):
    ip_address = serializers.CharField(read_only=True, allow_null=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "event_type",
            "event_name",
            "path",
            "metadata",
            "user_agent",
            "ip_address",
            "session_id",
            "created_at",
        ]
        read_only_fields = ["ip_address", "created_at"]


class EventCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating events (IP is forced null in the view)."""

    class Meta:
        model = Event
        fields = [
            "event_type",
            "event_name",
            "path",
            "metadata",
            "user_agent",
            "session_id",
        ]
