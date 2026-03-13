from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Category, Comment, Post, Tag

User = get_user_model()


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name", "slug"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description"]


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "name", "content", "created_at"]
        read_only_fields = ["created_at"]


class PostListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views."""

    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    author_name = serializers.CharField(source="author.get_full_name", read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "featured_image",
            "video",
            "video_url",
            "category",
            "tags",
            "author_name",
            "published",
            "featured",
            "views",
            "created_at",
            "published_at",
        ]


class PostSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    author_name = serializers.CharField(source="author.get_full_name", read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        required=False,
    )
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Tag.objects.all(),
        source="tags",
        write_only=True,
        required=False,
    )

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "slug",
            "author",
            "author_name",
            "excerpt",
            "content",
            "featured_image",
            "video",
            "video_url",
            "category",
            "category_id",
            "tags",
            "tag_ids",
            "published",
            "featured",
            "views",
            "meta_title",
            "meta_description",
            "comments",
            "created_at",
            "updated_at",
            "published_at",
        ]
        read_only_fields = [
            "slug",
            "author",
            "views",
            "created_at",
            "updated_at",
            "published_at",
        ]

    def create(self, validated_data):
        validated_data["author"] = self.context["request"].user
        return super().create(validated_data)


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["post", "name", "email", "content"]
        extra_kwargs = {
            "post": {
                "required": False
            }  # Post is set in the view, not from request data
        }
