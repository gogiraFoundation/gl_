from rest_framework import serializers

from .models import NewsletterSubscriber


class NewsletterSubscribeSerializer(serializers.Serializer):
    """Serializer for newsletter subscription."""

    email = serializers.EmailField()
    name = serializers.CharField(required=False, allow_blank=True, max_length=255)
    source = serializers.CharField(required=False, allow_blank=True, max_length=100)
    # Honeypot field for spam protection
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    def validate_website(self, value):
        """Honeypot validation - if filled, it's spam."""
        if value:
            raise serializers.ValidationError("Spam detected")
        return value

    def validate_email(self, value):
        """Check if email is already subscribed."""
        value = value.lower().strip()
        subscriber = NewsletterSubscriber.objects.filter(email=value).first()
        if subscriber and subscriber.is_active:
            raise serializers.ValidationError(
                "This email is already subscribed to our newsletter."
            )
        return value

    def create(self, validated_data):
        """Create or reactivate subscriber."""
        email = validated_data["email"].lower().strip()
        name = validated_data.get("name", "").strip() or None
        source = validated_data.get("source", "").strip() or "unknown"

        # Remove honeypot field
        validated_data.pop("website", None)

        subscriber, created = NewsletterSubscriber.objects.get_or_create(
            email=email,
            defaults={
                "name": name,
                "source": source,
                "is_active": True,
            },
        )

        # If subscriber exists but was unsubscribed, reactivate
        if not created and not subscriber.is_active:
            subscriber.resubscribe()
            if name:
                subscriber.name = name
            subscriber.source = source
            subscriber.save()

        return subscriber


class NewsletterUnsubscribeSerializer(serializers.Serializer):
    """Serializer for newsletter unsubscription."""

    token = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)

    def validate(self, attrs):
        """Validate that either token or email is provided."""
        if not attrs.get("token") and not attrs.get("email"):
            raise serializers.ValidationError("Either token or email must be provided.")
        return attrs


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    """Serializer for admin subscriber management."""

    class Meta:
        model = NewsletterSubscriber
        fields = [
            "id",
            "email",
            "name",
            "subscribed_at",
            "unsubscribed_at",
            "is_active",
            "is_verified",
            "source",
            "metadata",
        ]
        read_only_fields = ["subscribed_at", "unsubscribed_at"]


class NewsletterSendSerializer(serializers.Serializer):
    """Serializer for sending newsletters."""

    subject = serializers.CharField(max_length=200)
    message = serializers.CharField()
    html_message = serializers.CharField(required=False, allow_blank=True)
    send_to_verified_only = serializers.BooleanField(default=True)
    test_email = serializers.EmailField(required=False)
