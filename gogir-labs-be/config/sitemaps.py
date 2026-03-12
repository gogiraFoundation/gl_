from django.contrib.sitemaps import Sitemap
from apps.blog.models import Post
from apps.portfolio.models import Project


class BlogSitemap(Sitemap):
    """Sitemap for blog posts."""
    changefreq = 'weekly'
    priority = 0.8

    def items(self):
        return Post.objects.filter(published=True)

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return f'/blog/{obj.slug}/'


class PortfolioSitemap(Sitemap):
    """Sitemap for portfolio projects."""
    changefreq = 'monthly'
    priority = 0.7

    def items(self):
        return Project.objects.filter(published=True)

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return f'/portfolio/{obj.slug}/'


class StaticSitemap(Sitemap):
    """Sitemap for static pages."""
    changefreq = 'monthly'
    priority = 1.0

    def items(self):
        return [
            '/',
            '/about/',
            '/portfolio/',
            '/blog/',
            '/contact/',
            '/resume/',
            '/testimonials/',
            '/privacy/',
        ]

    def location(self, item):
        return item

