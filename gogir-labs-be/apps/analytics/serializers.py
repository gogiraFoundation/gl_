from rest_framework import serializers
from .models import PageView, Event


class PageViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageView
        fields = ['id', 'path', 'referer', 'user_agent', 'ip_address', 'session_id', 'created_at']
        read_only_fields = ['created_at']


class PageViewCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating page views (minimal data)."""
    class Meta:
        model = PageView
        fields = ['path', 'referer', 'user_agent', 'ip_address', 'session_id']


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            'id', 'event_type', 'event_name', 'path', 'metadata',
            'user_agent', 'ip_address', 'session_id', 'created_at'
        ]
        read_only_fields = ['created_at']


class EventCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating events."""
    class Meta:
        model = Event
        fields = ['event_type', 'event_name', 'path', 'metadata', 'user_agent', 'ip_address', 'session_id']

