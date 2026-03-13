from rest_framework import serializers
from .models import Project, Technology, Category, ProjectImage


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


class ProjectSerializer(serializers.ModelSerializer):
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
            "featured",
            "created_at",
            "order",
        ]
