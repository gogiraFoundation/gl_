from datetime import date

from rest_framework import serializers

from .models import Category, Project, ProjectImage, Technology


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = ["id", "name", "slug", "icon"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description"]


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ["id", "image", "caption", "order"]


class OutcomesMixin:
    def validate_outcomes(self, value):
        if value is None:
            return []
        if not isinstance(value, list):
            raise serializers.ValidationError("outcomes must be a list of strings.")
        if len(value) > 8:
            raise serializers.ValidationError("outcomes may contain at most 8 items.")
        cleaned = []
        for item in value:
            if not isinstance(item, str):
                raise serializers.ValidationError("Each outcome must be a string.")
            if len(item) > 300:
                raise serializers.ValidationError(
                    "Each outcome must be at most 300 characters."
                )
            cleaned.append(item)
        return cleaned

    def validate_year(self, value):
        if value is None:
            return value
        max_year = date.today().year + 1
        if value < 1990 or value > max_year:
            raise serializers.ValidationError(
                f"year must be between 1990 and {max_year}."
            )
        return value


class ProjectSerializer(OutcomesMixin, serializers.ModelSerializer):
    technologies = TechnologySerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    technology_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Technology.objects.all(),
        source="technologies",
        write_only=True,
        required=False,
    )

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "long_description",
            "featured_image",
            "video",
            "video_url",
            "github_url",
            "live_url",
            "category",
            "technologies",
            "technology_ids",
            "role",
            "year",
            "client",
            "outcomes",
            "featured",
            "published",
            "images",
            "created_at",
            "updated_at",
            "order",
        ]
        read_only_fields = ["slug", "created_at", "updated_at"]


class ProjectListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views."""

    technologies = TechnologySerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "featured_image",
            "video",
            "video_url",
            "github_url",
            "live_url",
            "category",
            "technologies",
            "role",
            "year",
            "client",
            "featured",
            "created_at",
            "order",
        ]
