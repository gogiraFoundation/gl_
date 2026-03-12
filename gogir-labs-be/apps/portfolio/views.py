from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Project, Technology, Category
from .serializers import (
    ProjectSerializer,
    ProjectListSerializer,
    TechnologySerializer,
    CategorySerializer,
)


class ProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing Project instances.
    """
    queryset = Project.objects.filter(published=True).select_related('category').prefetch_related('technologies', 'images')
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'technologies', 'featured', 'published']
    search_fields = ['title', 'description', 'long_description']
    ordering_fields = ['created_at', 'updated_at', 'order']
    ordering = ['-order', '-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        # Allow admins to see unpublished projects
        if self.request.user.is_authenticated and self.request.user.is_staff:
            queryset = Project.objects.all().select_related('category').prefetch_related('technologies', 'images')
        return queryset

    @action(detail=False, methods=['get'], url_path='by-slug', permission_classes=[AllowAny])
    def by_slug(self, request):
        """Get a project by slug with full details. Use ?slug=your-slug query parameter."""
        slug = request.query_params.get('slug')
        if not slug:
            return Response({'detail': 'Slug parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Use get_queryset to respect admin permissions
            queryset = self.get_queryset()
            project = queryset.select_related('category').prefetch_related('technologies', 'images').get(slug=slug)
            serializer = ProjectSerializer(project, context={'request': request})
            return Response(serializer.data)
        except Project.DoesNotExist:
            return Response({'detail': 'Project not found.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def related(self, request, pk=None):
        """Get related projects based on technologies and category."""
        project = self.get_object()
        limit = int(request.query_params.get('limit', 3))
        
        # Get projects with same technologies or category
        related_projects = Project.objects.filter(
            published=True
        ).exclude(pk=project.pk)
        
        # Prioritize projects with same technologies
        if project.technologies.exists():
            tech_ids = project.technologies.values_list('id', flat=True)
            related_projects = related_projects.filter(technologies__id__in=tech_ids).distinct()
        
        # If not enough, add projects with same category
        if related_projects.count() < limit and project.category:
            category_projects = Project.objects.filter(
                published=True,
                category=project.category
            ).exclude(pk=project.pk).exclude(pk__in=related_projects.values_list('id', flat=True))
            related_projects = list(related_projects) + list(category_projects[:limit - related_projects.count()])
        
        # If still not enough, get recent projects
        if len(related_projects) < limit:
            recent_projects = Project.objects.filter(
                published=True
            ).exclude(pk=project.pk).exclude(
                pk__in=[p.pk for p in related_projects if hasattr(p, 'pk')]
            )[:limit - len(related_projects)]
            related_projects = list(related_projects) + list(recent_projects)
        
        serializer = ProjectListSerializer(related_projects[:limit], many=True, context={'request': request})
        return Response(serializer.data)


class TechnologyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing Technology instances.
    """
    queryset = Technology.objects.all()
    serializer_class = TechnologySerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing Category instances.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

