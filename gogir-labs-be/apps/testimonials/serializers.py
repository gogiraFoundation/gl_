from rest_framework import serializers

from .models import Testimonial


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = [
            "id",
            "client_name",
            "client_role",
            "company",
            "content",
            "rating",
            "client_image",
            "company_logo",
            "featured",
            "published",
            "order",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class TestimonialListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views."""

    class Meta:
        model = Testimonial
        fields = [
            "id",
            "client_name",
            "client_role",
            "company",
            "content",
            "rating",
            "client_image",
            "company_logo",
            "featured",
            "created_at",
        ]
