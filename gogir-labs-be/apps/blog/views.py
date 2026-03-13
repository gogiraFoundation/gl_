from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import Post, Category, Tag, Comment
from apps.notifications.services import NotificationService
from apps.notifications.models import NotificationType

User = get_user_model()
from .serializers import (
    PostSerializer,
    PostListSerializer,
    CategorySerializer,
    TagSerializer,
    CommentSerializer,
    CommentCreateSerializer,
)


class PostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing Post instances.
    """

    queryset = (
        Post.objects.filter(published=True)
        .select_related("author", "category")
        .prefetch_related("tags", "comments")
    )
    permission_classes = [AllowAny]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["category", "tags", "featured", "published"]
    search_fields = ["title", "excerpt", "content"]
    ordering_fields = ["created_at", "published_at", "views"]
    ordering = ["-published_at", "-created_at"]

    def get_serializer_class(self):
        if self.action == "list":
            return PostListSerializer
        return PostSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        # Allow admins to see unpublished posts
        if self.request.user.is_authenticated and self.request.user.is_staff:
            queryset = (
                Post.objects.all()
                .select_related("author", "category")
                .prefetch_related("tags", "comments")
            )
        return queryset

    @action(
        detail=False, methods=["get"], url_path="by-slug", permission_classes=[AllowAny]
    )
    def by_slug(self, request):
        """Get a post by slug with full content. Use ?slug=your-slug query parameter."""
        slug = request.query_params.get("slug")
        if not slug:
            return Response(
                {"detail": "Slug parameter is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            queryset = self.get_queryset()
            post = queryset.get(slug=slug)
            serializer = PostSerializer(post, context={"request": request})
            return Response(serializer.data)
        except Post.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=["post"], permission_classes=[AllowAny])
    def increment_views(self, request, pk=None):
        """Increment view count for a post."""
        post = self.get_object()
        post.views += 1
        post.save(update_fields=["views"])
        return Response({"views": post.views})

    @action(detail=True, methods=["get", "post"], permission_classes=[AllowAny])
    def comments(self, request, pk=None):
        """Get or create comments for a post."""
        post = self.get_object()
        if request.method == "GET":
            comments = post.comments.filter(approved=True)
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)
        elif request.method == "POST":
            serializer = CommentCreateSerializer(data=request.data)
            if serializer.is_valid():
                comment = serializer.save(post=post)
                # Notify admins about new comment
                NotificationService.notify_admins(
                    notification_type=NotificationType.BLOG_COMMENT,
                    title=f"New Comment on: {post.title}",
                    message=f'A new comment has been submitted on "{post.title}"\n\nComment by: {comment.name}\nEmail: {comment.email}\n\nComment:\n{comment.content}',
                    data={
                        "post_title": post.title,
                        "post_slug": post.slug,
                        "commenter_name": comment.name,
                        "commenter_email": comment.email,
                        "comment_content": comment.content,
                        "admin_url": f"{request.scheme}://{request.get_host()}/admin/blog/comment/{comment.id}/",
                    },
                    related_object=comment,
                )
                # Return success response with comment data
                return Response(
                    {
                        "id": comment.id,
                        "name": comment.name,
                        "content": comment.content,
                        "created_at": comment.created_at,
                        "message": "Comment submitted successfully. It will appear after moderation.",
                    },
                    status=status.HTTP_201_CREATED,
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"], permission_classes=[AllowAny])
    def related(self, request, pk=None):
        """Get related posts based on tags and category."""
        post = self.get_object()
        limit = int(request.query_params.get("limit", 3))

        # Get posts with same tags or category
        related_posts = Post.objects.filter(published=True).exclude(pk=post.pk)

        # Prioritize posts with same tags
        if post.tags.exists():
            tag_ids = post.tags.values_list("id", flat=True)
            related_posts = related_posts.filter(tags__id__in=tag_ids).distinct()

        # If not enough, add posts with same category
        if related_posts.count() < limit and post.category:
            category_posts = (
                Post.objects.filter(published=True, category=post.category)
                .exclude(pk=post.pk)
                .exclude(pk__in=related_posts.values_list("id", flat=True))
            )
            related_posts = list(related_posts) + list(
                category_posts[: limit - related_posts.count()]
            )

        # If still not enough, get recent posts
        if len(related_posts) < limit:
            recent_posts = (
                Post.objects.filter(published=True)
                .exclude(pk=post.pk)
                .exclude(pk__in=[p.pk for p in related_posts if hasattr(p, "pk")])[
                    : limit - len(related_posts)
                ]
            )
            related_posts = list(related_posts) + list(recent_posts)

        serializer = PostListSerializer(
            related_posts[:limit], many=True, context={"request": request}
        )
        return Response(serializer.data)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing Category instances.
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing Tag instances.
    """

    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]


class CommentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing comments (admin only for moderation).
    """

    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["post", "approved"]
    ordering_fields = ["created_at"]
    ordering = ["-created_at"]

    def perform_update(self, serializer):
        """Handle comment approval notifications."""
        old_comment = self.get_object()
        was_approved = old_comment.approved
        comment = serializer.save()

        # If comment was just approved, notify the commenter
        if comment.approved and not was_approved:
            # Try to find user by email, otherwise create a notification for the email
            try:
                user = User.objects.get(email=comment.email)
                NotificationService.send_notification(
                    user=user,
                    notification_type=NotificationType.BLOG_COMMENT_APPROVED,
                    title="Your comment has been approved",
                    message=f'Your comment on "{comment.post.title}" has been approved and is now visible.',
                    data={
                        "post_title": comment.post.title,
                        "post_slug": comment.post.slug,
                        "post_url": f"{self.request.scheme}://{self.request.get_host()}/blog/{comment.post.slug}/",
                    },
                    related_object=comment,
                )
            except User.DoesNotExist:
                # If user doesn't exist, we could send an email directly
                # For now, just log it
                pass
