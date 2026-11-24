from django.contrib.auth import get_user_model
from django.utils import timezone
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
    """Public comment shape (no email)."""

    class Meta:
        model = Comment
        fields = ["id", "name", "content", "created_at"]
        read_only_fields = ["created_at"]


class CommentAdminSerializer(serializers.ModelSerializer):
    """Staff moderation shape."""

    class Meta:
        model = Comment
        fields = [
            "id",
            "post",
            "name",
            "email",
            "content",
            "approved",
            "created_at",
        ]
        read_only_fields = ["created_at", "post", "name", "email", "content"]


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
    comments = serializers.SerializerMethodField()
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
            "publish_at",
        ]
        read_only_fields = [
            "slug",
            "author",
            "views",
            "created_at",
            "updated_at",
            "published_at",
        ]

    def get_comments(self, obj):
        # View prefetches approved-only on retrieve/by_slug; otherwise filter.
        cache = getattr(obj, "_prefetched_objects_cache", {})
        if "comments" in cache:
            return CommentSerializer(cache["comments"], many=True).data
        return CommentSerializer(obj.comments.filter(approved=True), many=True).data

    def validate(self, attrs):
        attrs = super().validate(attrs)
        published = attrs.get(
            "published",
            self.instance.published if self.instance is not None else False,
        )
        publish_at = attrs.get(
            "publish_at",
            self.instance.publish_at if self.instance is not None else None,
        )
        # Future publish_at is a schedule; publishing immediately would bypass the command.
        if published and publish_at is not None and publish_at > timezone.now():
            raise serializers.ValidationError(
                {
                    "published": (
                        "Leave published false when publish_at is in the future; "
                        "the scheduler will publish when due."
                    )
                }
            )
        return attrs

    def create(self, validated_data):
        validated_data["author"] = self.context["request"].user
        return super().create(validated_data)


class CommentCreateSerializer(serializers.ModelSerializer):
    content = serializers.CharField(max_length=2000)
    # Honeypot: bots fill this; rejected when present (same pattern as contact).
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = Comment
        fields = ["post", "name", "email", "content", "website"]
        extra_kwargs = {
            "post": {
                "required": False
            }  # Post is set in the view, not from request data
        }

    def validate_website(self, value):
        if value:
            raise serializers.ValidationError("Spam detected")
        return value

    def create(self, validated_data):
        validated_data.pop("website", None)
        return super().create(validated_data)
