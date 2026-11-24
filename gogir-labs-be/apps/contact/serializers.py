from rest_framework import serializers

from .models import ContactMessage


class ContactMessageSerializer(serializers.ModelSerializer):
    # Honeypot field for spam protection
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)
    message = serializers.CharField(max_length=5000)

    class Meta:
        model = ContactMessage
        fields = [
            "id",
            "name",
            "email",
            "subject",
            "message",
            "website",
            "read",
            "replied",
            "created_at",
        ]
        read_only_fields = ["read", "replied", "created_at"]

    def validate_website(self, value):
        """Honeypot validation - if filled, it's spam."""
        if value:
            raise serializers.ValidationError("Spam detected")
        return value

    def create(self, validated_data):
        validated_data.pop("website", None)
        return super().create(validated_data)


class ContactMessageListSerializer(serializers.ModelSerializer):
    """Serializer for admin list view (no message body)."""

    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "subject", "read", "replied", "created_at"]


class ContactMessageDetailSerializer(serializers.ModelSerializer):
    """Full message for staff detail and update."""

    class Meta:
        model = ContactMessage
        fields = [
            "id",
            "name",
            "email",
            "subject",
            "message",
            "read",
            "replied",
            "reply_body",
            "replied_at",
            "created_at",
        ]
        read_only_fields = [
            "name",
            "email",
            "subject",
            "message",
            "replied",
            "reply_body",
            "replied_at",
            "created_at",
        ]


class ContactMessageReplySerializer(serializers.Serializer):
    message = serializers.CharField(min_length=1, max_length=10000)
