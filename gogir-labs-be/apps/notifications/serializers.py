from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Notification, NotificationPreference, NotificationTemplate

User = get_user_model()


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for notifications."""

    type_display = serializers.CharField(source="get_type_display", read_only=True)
    related_object = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            "id",
            "type",
            "type_display",
            "title",
            "message",
            "data",
            "read",
            "read_at",
            "related_object",
            "created_at",
        ]
        read_only_fields = ["read", "read_at", "created_at"]

    def get_related_object(self, obj):
        """Return related object id and type for GenericForeignKey (schema-friendly)."""
        if obj.content_type_id and obj.object_id:
            return {
                "content_type_id": obj.content_type_id,
                "object_id": obj.object_id,
            }
        return None


class NotificationListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for notification lists."""

    type_display = serializers.CharField(source="get_type_display", read_only=True)

    class Meta:
        model = Notification
        fields = [
            "id",
            "type",
            "type_display",
            "title",
            "message",
            "read",
            "created_at",
        ]


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    """Serializer for notification preferences."""

    notification_type_display = serializers.CharField(
        source="get_notification_type_display", read_only=True
    )

    class Meta:
        model = NotificationPreference
        fields = [
            "id",
            "notification_type",
            "notification_type_display",
            "email_enabled",
            "in_app_enabled",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class NotificationTemplateSerializer(serializers.ModelSerializer):
    """Serializer for notification templates."""

    notification_type_display = serializers.CharField(
        source="get_notification_type_display", read_only=True
    )

    class Meta:
        model = NotificationTemplate
        fields = [
            "id",
            "notification_type",
            "notification_type_display",
            "subject_template",
            "body_template",
            "html_template",
            "enabled",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]
