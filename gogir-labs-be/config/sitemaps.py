from urllib.parse import urlparse

from django.conf import settings
from django.contrib.sitemaps import Sitemap

from apps.blog.blog_seed import public_post_visibility_q
from apps.blog.models import Post
from apps.portfolio.models import Project
from apps.portfolio.portfolio_seed import PORTFOLIO_PUBLIC_HOLD_SLUGS


def _frontend_parts() -> tuple[str, str]:
    """Scheme and host for public site URLs (not the API origin)."""
    raw = (getattr(settings, "FRONTEND_URL", None) or "http://localhost:3000").rstrip(
        "/"
    )
    parsed = urlparse(raw)
    scheme = parsed.scheme or "https"
    netloc = parsed.netloc or "localhost:3000"
    return scheme, netloc


class FrontendOriginMixin:
    """Force sitemap absolute URLs onto FRONTEND_URL instead of the API Site."""

    def get_protocol(self, protocol=None):
        scheme, _ = _frontend_parts()
        return scheme

    def get_domain(self, site=None):
        _, netloc = _frontend_parts()
        return netloc


class BlogSitemap(FrontendOriginMixin, Sitemap):
    """Sitemap for blog posts."""

    changefreq = "weekly"
    priority = 0.8

    def items(self):
        return Post.objects.filter(published=True).filter(public_post_visibility_q())

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        # Match Next.js routes (no trailing slash).
        return f"/blog/{obj.slug}"


class PortfolioSitemap(FrontendOriginMixin, Sitemap):
    """Sitemap for portfolio projects."""

    changefreq = "monthly"
    priority = 0.7

    def items(self):
        return Project.objects.filter(published=True).exclude(
            slug__in=PORTFOLIO_PUBLIC_HOLD_SLUGS
        )

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return f"/portfolio/{obj.slug}"


class StaticSitemap(FrontendOriginMixin, Sitemap):
    """Sitemap for static pages."""

    changefreq = "monthly"
    priority = 1.0

    def items(self):
        return [
            "/",
            "/about",
            "/portfolio",
            "/blog",
            "/contact",
            "/resume",
            "/testimonials",
            "/privacy",
        ]

    def location(self, item):
        return item
