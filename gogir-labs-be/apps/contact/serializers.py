from rest_framework import serializers

from .models import ContactMessage


class ContactMessageSerializer(serializers.ModelSerializer):
    # Honeypot field for spam protection
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

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


class ContactMessageListSerializer(serializers.ModelSerializer):
    """Serializer for admin list view."""

    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "subject", "read", "replied", "created_at"]
