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


class TestimonialInviteCreateSerializer(serializers.Serializer):
    email = serializers.EmailField()


class TestimonialSubmitSerializer(serializers.Serializer):
    client_name = serializers.CharField(max_length=100)
    client_role = serializers.CharField(max_length=100)
    company = serializers.CharField(max_length=100, required=False, allow_blank=True)
    content = serializers.CharField(max_length=5000)
    rating = serializers.IntegerField(min_value=1, max_value=5, default=5)

