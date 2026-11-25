import logging

from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.blog.blog_seed import public_post_visibility_q
from apps.blog.models import Post
from apps.blog.serializers import PostListSerializer
from apps.portfolio.models import Project
from apps.portfolio.portfolio_seed import PORTFOLIO_PUBLIC_HOLD_SLUGS
from apps.portfolio.serializers import ProjectListSerializer
from apps.resume.models import Experience, Skill
from apps.resume.serializers import ExperienceSerializer, SkillSerializer
from apps.testimonials.models import Testimonial
from apps.testimonials.serializers import TestimonialListSerializer

logger = logging.getLogger(__name__)

MAX_QUERY_LENGTH = 200
DEFAULT_LIMIT = 10
MAX_LIMIT = 20
ALLOWED_CONTENT_TYPES = frozenset(
    {"all", "blog", "portfolio", "testimonials", "resume"}
)


class SearchViewSet(viewsets.ViewSet):
    """
    Unified search across blog posts, portfolio projects, testimonials, and resume.
    """

    permission_classes = [AllowAny]
    throttle_scope = "search"

    @action(detail=False, methods=["get"], url_path="")
    def search(self, request):
        query = request.query_params.get("q", "").strip()
        content_type = request.query_params.get("type", "all")

        empty = {
            "query": "",
            "blog_posts": [],
            "projects": [],
            "testimonials": [],
            "resume": {"experience": [], "skills": []},
            "total": 0,
        }

        if not query:
            return Response(empty)

        if content_type not in ALLOWED_CONTENT_TYPES:
            return Response(
                {
                    "detail": (
                        "type must be one of: all, blog, portfolio, "
                        "testimonials, resume."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(query) > MAX_QUERY_LENGTH:
            return Response(
                {"detail": f"Query must be at most {MAX_QUERY_LENGTH} characters."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        limit_raw = request.query_params.get("limit", str(DEFAULT_LIMIT))
        try:
            limit = int(limit_raw)
        except (TypeError, ValueError):
            return Response(
                {"detail": "limit must be an integer."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if limit < 1:
            return Response(
                {"detail": "limit must be at least 1."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        limit = min(limit, MAX_LIMIT)

        category_id = request.query_params.get("category")
        if category_id is not None and category_id != "":
            try:
                category_id = int(category_id)
            except (TypeError, ValueError):
                return Response(
                    {"detail": "category must be an integer."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            category_id = None

        results = {
            "query": query,
            "blog_posts": [],
            "projects": [],
            "testimonials": [],
            "resume": {"experience": [], "skills": []},
            "total": 0,
        }

        if content_type in ["all", "blog"]:
            blog_query = (
                Post.objects.filter(published=True)
                .filter(public_post_visibility_q())
                .select_related("author", "category")
                .prefetch_related("tags")
            )
            blog_query = blog_query.filter(
                Q(title__icontains=query)
                | Q(excerpt__icontains=query)
                | Q(content__icontains=query)
                | Q(tags__name__icontains=query)
                | Q(category__name__icontains=query)
            ).distinct()
            if category_id is not None:
                blog_query = blog_query.filter(category_id=category_id)
            results["blog_posts"] = PostListSerializer(
                blog_query[:limit], many=True, context={"request": request}
            ).data

        if content_type in ["all", "portfolio"]:
            project_query = (
                Project.objects.filter(published=True)
                .exclude(slug__in=PORTFOLIO_PUBLIC_HOLD_SLUGS)
                .select_related("category")
                .prefetch_related("technologies")
            )
            project_query = project_query.filter(
                Q(title__icontains=query)
                | Q(description__icontains=query)
                | Q(long_description__icontains=query)
                | Q(technologies__name__icontains=query)
                | Q(category__name__icontains=query)
            ).distinct()
            if category_id is not None:
                project_query = project_query.filter(category_id=category_id)
            results["projects"] = ProjectListSerializer(
                project_query[:limit], many=True, context={"request": request}
            ).data

        if content_type in ["all", "testimonials"]:
            testimonials = Testimonial.objects.filter(published=True).filter(
                Q(client_name__icontains=query)
                | Q(company__icontains=query)
                | Q(client_role__icontains=query)
                | Q(content__icontains=query)
            )[:limit]
            results["testimonials"] = TestimonialListSerializer(
                testimonials, many=True, context={"request": request}
            ).data

        if content_type in ["all", "resume"]:
            experience = Experience.objects.filter(
                Q(title__icontains=query) | Q(company__icontains=query)
            )[:limit]
            skills = Skill.objects.filter(name__icontains=query)[:limit]
            results["resume"] = {
                "experience": ExperienceSerializer(
                    experience, many=True, context={"request": request}
                ).data,
                "skills": SkillSerializer(
                    skills, many=True, context={"request": request}
                ).data,
            }

        results["total"] = (
            len(results["blog_posts"])
            + len(results["projects"])
            + len(results["testimonials"])
            + len(results["resume"]["experience"])
            + len(results["resume"]["skills"])
        )

        try:
            from apps.analytics.models import Event

            user_agent = (request.META.get("HTTP_USER_AGENT", "") or "")[:200]
            session_id = request.session.session_key or ""

            Event.objects.create(
                event_type="search",
                event_name="search_query",
                path=request.path,
                metadata={
                    "query": query,
                    "type": content_type,
                    "results_count": results["total"],
                },
                user_agent=user_agent,
                ip_address=None,
                session_id=session_id,
            )
        except Exception:
            logger.exception("Failed to track search analytics event")

        return Response(results)
