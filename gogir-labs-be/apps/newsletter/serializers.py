from datetime import timedelta

from django.utils import timezone
from django.utils.dateparse import parse_datetime
from rest_framework import serializers

from .models import NewsletterSubscriber


SUBSCRIBE_SUCCESS_MESSAGE = (
    "Successfully subscribed! Please check your email to verify your subscription."
)
# Repeat subscribe calls must not turn into a verification-mail loop.
VERIFICATION_RESEND_COOLDOWN = timedelta(minutes=15)


def verification_recently_sent(subscriber) -> bool:
    """True when a verification mail for this row was stamped inside the cooldown."""
    raw = (subscriber.metadata or {}).get("verification_sent_at")
    if not raw:
        return False
    sent_at = parse_datetime(str(raw))
    if sent_at is None:
        return False
    if timezone.is_naive(sent_at):
        sent_at = timezone.make_aware(sent_at, timezone.get_current_timezone())
    return timezone.now() - sent_at < VERIFICATION_RESEND_COOLDOWN


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
        """Normalize email. Do not reveal whether the address is already subscribed."""
        return value.lower().strip()

    def create(self, validated_data):
        """Create, reactivate, or return an existing subscriber."""
        email = validated_data["email"]
        name = validated_data.get("name", "").strip() or None
        source = validated_data.get("source", "").strip() or "unknown"
        validated_data.pop("website", None)

        # Case-insensitive match so mixed-case legacy rows are not duplicated.
        subscriber = NewsletterSubscriber.objects.filter(email__iexact=email).first()
        if subscriber is None:
            subscriber = NewsletterSubscriber.objects.create(
                email=email,
                name=name,
                source=source,
                is_active=True,
            )
            subscriber._send_verification = True
            return subscriber

        if not subscriber.is_active:
            subscriber.resubscribe()
            if name:
                subscriber.name = name
            subscriber.source = source
            subscriber.email = email
            subscriber.save()
            subscriber._send_verification = True
            return subscriber

        update_fields = []
        if subscriber.email != email:
            subscriber.email = email
            update_fields.append("email")
        if name and not subscriber.name:
            subscriber.name = name
            update_fields.append("name")
        if update_fields:
            subscriber.save(update_fields=update_fields)

        # Active verified addresses do not get another verification email.
        # Unverified rows are cooled down so a repeated POST cannot spam the inbox.
        subscriber._send_verification = not subscriber.is_verified and not (
            verification_recently_sent(subscriber)
        )
        return subscriber


class NewsletterUnsubscribeSerializer(serializers.Serializer):
    """Serializer for newsletter unsubscription."""

    token = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)

    def validate(self, attrs):
        """Validate that either token or email is provided."""
        token = (attrs.get("token") or "").strip()
        email = (attrs.get("email") or "").strip()
        if not token and not email:
            raise serializers.ValidationError("Either token or email must be provided.")
        attrs["token"] = token or None
        attrs["email"] = email or None
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
