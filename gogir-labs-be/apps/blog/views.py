from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import F, Prefetch
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from apps.notifications.models import NotificationType
from apps.notifications.services import NotificationService
from config.permissions import IsStaffOrReadOnly

from .models import Category, Comment, Post, Tag

User = get_user_model()
from .serializers import (
    CategorySerializer,
    CommentAdminSerializer,
    CommentCreateSerializer,
    CommentSerializer,
    PostListSerializer,
    PostSerializer,
    TagSerializer,
)

APPROVED_COMMENTS_PREFETCH = Prefetch(
    "comments",
    queryset=Comment.objects.filter(approved=True),
)


class PostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing Post instances.
    Public reads; staff-only create/update/delete.
    """

    queryset = (
        Post.objects.filter(published=True)
        .select_related("author", "category")
        .prefetch_related("tags")
    )
    permission_classes = [IsStaffOrReadOnly]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["category", "tags", "featured", "published"]
    search_fields = ["title", "excerpt", "content"]
    ordering_fields = ["created_at", "published_at", "views"]
    ordering = ["-published_at", "-created_at"]

    def get_permissions(self):
        if self.action in ("list", "retrieve", "by_slug", "related"):
            return [AllowAny()]
        if self.action in ("comments", "increment_views"):
            return [AllowAny()]
        return [IsAdminUser()]

    def get_throttles(self):
        if self.action == "comments" and self.request.method == "POST":
            self.throttle_scope = "comments"
            return [ScopedRateThrottle()]
        if self.action == "increment_views":
            self.throttle_scope = "views"
            return [ScopedRateThrottle()]
        return super().get_throttles()

    def get_serializer_class(self):
        if self.action == "list":
            return PostListSerializer
        return PostSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.is_staff:
            base = Post.objects.all()
        else:
            base = Post.objects.filter(published=True)

        queryset = base.select_related("author", "category").prefetch_related("tags")
        if self.action in ("retrieve", "by_slug"):
            queryset = queryset.prefetch_related(APPROVED_COMMENTS_PREFETCH)
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
        Post.objects.filter(pk=post.pk).update(views=F("views") + 1)
        post.refresh_from_db(fields=["views"])
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
                        "admin_url": (
                            f"{(settings.FRONTEND_URL or 'http://localhost:3000').rstrip('/')}"
                            f"/admin/comments"
                        ),
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
        try:
            limit = int(request.query_params.get("limit", 3))
        except (TypeError, ValueError):
            return Response(
                {"detail": "limit must be an integer."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if limit < 1 or limit > 10:
            return Response(
                {"detail": "limit must be between 1 and 10."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        base = (
            Post.objects.filter(published=True)
            .exclude(pk=post.pk)
            .select_related("author", "category")
            .prefetch_related("tags")
        )
        results = []
        seen = set()

        def take(qs):
            for item in qs:
                if item.pk in seen:
                    continue
                seen.add(item.pk)
                results.append(item)
                if len(results) >= limit:
                    return True
            return False

        if post.tags.exists():
            tag_ids = post.tags.values_list("id", flat=True)
            if take(base.filter(tags__id__in=tag_ids).distinct()[:limit]):
                serializer = PostListSerializer(
                    results, many=True, context={"request": request}
                )
                return Response(serializer.data)

        if post.category and take(
            base.filter(category=post.category).exclude(pk__in=seen)[
                : limit - len(results)
            ]
        ):
            serializer = PostListSerializer(
                results, many=True, context={"request": request}
            )
            return Response(serializer.data)

        take(base.exclude(pk__in=seen)[: limit - len(results)])
        serializer = PostListSerializer(
            results, many=True, context={"request": request}
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
    serializer_class = CommentAdminSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["post", "approved"]
    ordering_fields = ["created_at"]
    ordering = ["-created_at"]

    def perform_update(self, serializer):
        """Handle comment approval notifications."""
        from django.conf import settings

        old_comment = self.get_object()
        was_approved = old_comment.approved
        comment = serializer.save()

        # If comment was just approved, notify the commenter
        if comment.approved and not was_approved:
            post_url = f"{settings.FRONTEND_URL.rstrip('/')}/blog/{comment.post.slug}/"
            context = {
                "post_title": comment.post.title,
                "post_slug": comment.post.slug,
                "post_url": post_url,
                "message": (
                    f'Your comment on "{comment.post.title}" has been approved '
                    "and is now visible."
                ),
            }
            NotificationService.send_template_to_address(
                recipient=comment.email,
                notification_type=NotificationType.BLOG_COMMENT_APPROVED,
                context=context,
                custom_subject="Your comment has been approved",
                custom_body=context["message"],
            )
            try:
                user = User.objects.get(email=comment.email)
                NotificationService.send_notification(
                    user=user,
                    notification_type=NotificationType.BLOG_COMMENT_APPROVED,
                    title="Your comment has been approved",
                    message=context["message"],
                    data={
                        "post_title": comment.post.title,
                        "post_slug": comment.post.slug,
                        "post_url": post_url,
                    },
                    related_object=comment,
                    send_email=False,
                )
            except User.DoesNotExist:
                pass
