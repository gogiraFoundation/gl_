from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from .models import Category, Project, Technology
from .serializers import (
    CategorySerializer,
    ProjectListSerializer,
    ProjectSerializer,
    TechnologySerializer,
)


class ProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing Project instances.
    Public reads; staff-only create/update/delete.
    """

    queryset = (
        Project.objects.filter(published=True)
        .select_related("category")
        .prefetch_related("technologies", "images")
    )
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["category", "technologies", "featured", "published"]
    search_fields = ["title", "description", "long_description"]
    ordering_fields = ["created_at", "updated_at", "order"]
    ordering = ["-order", "-created_at"]

    def get_permissions(self):
        if self.action in ("list", "retrieve", "by_slug", "related"):
            return [AllowAny()]
        return [IsAdminUser()]

    def get_serializer_class(self):
        if self.action == "list":
            return ProjectListSerializer
        return ProjectSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        # Allow admins to see unpublished projects
        if self.request.user.is_authenticated and self.request.user.is_staff:
            queryset = (
                Project.objects.all()
                .select_related("category")
                .prefetch_related("technologies", "images")
            )
        return queryset

    @action(
        detail=False, methods=["get"], url_path="by-slug", permission_classes=[AllowAny]
    )
    def by_slug(self, request):
        """Get a project by slug with full details. Use ?slug=your-slug query parameter."""
        slug = request.query_params.get("slug")
        if not slug:
            return Response(
                {"detail": "Slug parameter is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Use get_queryset to respect admin permissions
            queryset = self.get_queryset()
            project = (
                queryset.select_related("category")
                .prefetch_related("technologies", "images")
                .get(slug=slug)
            )
            serializer = ProjectSerializer(project, context={"request": request})
            return Response(serializer.data)
        except Project.DoesNotExist:
            return Response(
                {"detail": "Project not found."}, status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=["get"], permission_classes=[AllowAny])
    def related(self, request, pk=None):
        """Get related projects based on technologies and category."""
        project = self.get_object()
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
            Project.objects.filter(published=True)
            .exclude(pk=project.pk)
            .select_related("category")
            .prefetch_related("technologies")
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

        if project.technologies.exists():
            tech_ids = project.technologies.values_list("id", flat=True)
            if take(base.filter(technologies__id__in=tech_ids).distinct()[:limit]):
                serializer = ProjectListSerializer(
                    results, many=True, context={"request": request}
                )
                return Response(serializer.data)

        if project.category and take(
            base.filter(category=project.category).exclude(pk__in=seen)[
                : limit - len(results)
            ]
        ):
            serializer = ProjectListSerializer(
                results, many=True, context={"request": request}
            )
            return Response(serializer.data)

        take(base.exclude(pk__in=seen)[: limit - len(results)])
        serializer = ProjectListSerializer(
            results, many=True, context={"request": request}
        )
        return Response(serializer.data)


class TechnologyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing Technology instances.
    """

    queryset = Technology.objects.all()
    serializer_class = TechnologySerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing Category instances.
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]
