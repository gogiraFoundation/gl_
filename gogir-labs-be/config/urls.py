"""
URL configuration for config project.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework.permissions import AllowAny

from apps.blog.feeds import BlogFeed, BlogRSSFeed
from config.sitemaps import BlogSitemap, PortfolioSitemap, StaticSitemap

sitemaps = {
    "blog": BlogSitemap,
    "portfolio": PortfolioSitemap,
    "static": StaticSitemap,
}

# Docs stay public; DEFAULT_PERMISSION_CLASSES is IsAdminUser for API handlers.
_schema_kwargs = {"permission_classes": [AllowAny]}

urlpatterns = [
    path("admin/", admin.site.urls),
    path("ckeditor5/", include("django_ckeditor_5.urls")),
    path("api/v1/", include("config.api_urls")),
    # API Documentation
    path(
        "api/schema/",
        SpectacularAPIView.as_view(**_schema_kwargs),
        name="schema",
    ),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema", **_schema_kwargs),
        name="swagger-ui",
    ),
    path(
        "api/redoc/",
        SpectacularRedocView.as_view(url_name="schema", **_schema_kwargs),
        name="redoc",
    ),
    # RSS Feeds - Feed classes are callable views
    path("feed/", BlogRSSFeed(), name="blog_feed"),
    path("feed/atom/", BlogFeed(), name="blog_feed_atom"),
    # Sitemap
    path(
        "sitemap.xml",
        sitemap,
        {"sitemaps": sitemaps},
        name="django.contrib.sitemaps.views.sitemap",
    ),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
