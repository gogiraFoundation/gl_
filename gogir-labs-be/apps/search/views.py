from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from apps.blog.models import Post
from apps.portfolio.models import Project
from apps.blog.serializers import PostListSerializer
from apps.portfolio.serializers import ProjectListSerializer
from apps.analytics.models import Event


class SearchViewSet(viewsets.ViewSet):
    """
    Unified search across blog posts and portfolio projects.
    """
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'], url_path='')
    def search(self, request):
        """
        Search across blog posts and portfolio projects.
        
        Query parameters:
        - q: Search query (required)
        - type: Filter by type ('blog', 'portfolio', or 'all')
        - category: Filter by category ID
        - limit: Limit results per type (default: 10)
        """
        query = request.query_params.get('q', '').strip()
        content_type = request.query_params.get('type', 'all')
        category_id = request.query_params.get('category')
        limit = int(request.query_params.get('limit', 10))

        if not query:
            return Response({
                'query': '',
                'blog_posts': [],
                'projects': [],
                'total': 0
            })

        results = {
            'query': query,
            'blog_posts': [],
            'projects': [],
            'total': 0
        }

        # Search blog posts
        if content_type in ['all', 'blog']:
            blog_query = Post.objects.filter(published=True)
            
            # Apply search
            blog_query = blog_query.filter(
                Q(title__icontains=query) |
                Q(excerpt__icontains=query) |
                Q(content__icontains=query) |
                Q(tags__name__icontains=query) |
                Q(category__name__icontains=query)
            ).distinct()
            
            # Filter by category if provided
            if category_id:
                blog_query = blog_query.filter(category_id=category_id)
            
            blog_posts = blog_query[:limit]
            results['blog_posts'] = PostListSerializer(blog_posts, many=True, context={'request': request}).data

        # Search portfolio projects
        if content_type in ['all', 'portfolio']:
            project_query = Project.objects.filter(published=True)
            
            # Apply search
            project_query = project_query.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(long_description__icontains=query) |
                Q(technologies__name__icontains=query) |
                Q(category__name__icontains=query)
            ).distinct()
            
            # Filter by category if provided
            if category_id:
                project_query = project_query.filter(category_id=category_id)
            
            projects = project_query[:limit]
            results['projects'] = ProjectListSerializer(projects, many=True, context={'request': request}).data

        results['total'] = len(results['blog_posts']) + len(results['projects'])

        # Track search event
        try:
            from apps.analytics.models import Event
            from django.utils import timezone
            
            # Extract IP and user agent
            ip_address = request.META.get('HTTP_X_FORWARDED_FOR')
            if ip_address:
                ip_address = ip_address.split(',')[0].strip()
            else:
                ip_address = request.META.get('REMOTE_ADDR', '')
            
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            session_id = request.session.session_key or ''
            
            Event.objects.create(
                event_type='search',
                event_name='search_query',
                path=request.path,
                metadata={
                    'query': query,
                    'type': content_type,
                    'results_count': results['total']
                },
                user_agent=user_agent,
                ip_address=ip_address,
                session_id=session_id,
                created_at=timezone.now()
            )
        except Exception:
            pass  # Silently fail if tracking doesn't work

        return Response(results)

