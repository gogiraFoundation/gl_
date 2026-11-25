"""
URL configuration for config project.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from django.http import JsonResponse
from django.urls import include, path, re_path
from django.views.static import serve
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


def service_root(_request):
    """JSON index for GET / so the API host is not a Django HTML 404."""
    return JsonResponse(
        {
            "name": "Gogir Labs API",
            "status": "ok",
            "api": "/api/v1/",
        }
    )


urlpatterns = [
    path("", service_root, name="service-root"),
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

# Media: django.conf.urls.static.static() is a no-op when DEBUG is False, so homelab
# uses serve() directly when SERVE_MEDIA is set (WhiteNoise does not serve uploads).
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
elif getattr(settings, "SERVE_MEDIA", False):
    urlpatterns += [
        re_path(
            r"^media/(?P<path>.*)$",
            serve,
            {"document_root": settings.MEDIA_ROOT},
        ),
    ]
