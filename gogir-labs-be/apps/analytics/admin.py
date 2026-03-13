from django.contrib import admin, messages
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.utils import timezone
from django.utils.html import format_html
from django.utils.safestring import mark_safe

from .models import Event, PageView


@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    list_display = ["path", "session_id", "ip_address", "created_at", "referer_short"]
    list_filter = ["created_at", "path"]
    search_fields = ["path", "session_id", "ip_address", "referer"]
    readonly_fields = [
        "created_at",
        "path",
        "referer",
        "user_agent",
        "ip_address",
        "session_id",
    ]
    date_hierarchy = "created_at"
    ordering = ["-created_at"]
    list_per_page = 50

    def referer_short(self, obj):
        if obj.referer:
            return obj.referer[:50] + "..." if len(obj.referer) > 50 else obj.referer
        return "-"

    referer_short.short_description = "Referer"

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        total_views = self.model.objects.count()
        recent_views = self.model.objects.filter(
            created_at__gte=timezone.now() - timezone.timedelta(days=7)
        ).count()
        extra_context["total_views"] = total_views
        extra_context["recent_views"] = recent_views
        extra_context["show_info"] = total_views == 0
        extra_context["test_data_url"] = reverse(
            "admin:analytics_pageview_create_test_data"
        )
        return super().changelist_view(request, extra_context=extra_context)

    def get_urls(self):
        from django.urls import path

        urls = super().get_urls()
        custom_urls = [
            path(
                "create-test-data/",
                self.admin_site.admin_view(self.create_test_data),
                name="analytics_pageview_create_test_data",
            ),
        ]
        return custom_urls + urls

    def create_test_data(self, request):
        """Create sample test data for page views."""
        from datetime import timedelta

        test_paths = [
            "/",
            "/portfolio",
            "/blog",
            "/about",
            "/contact",
            "/portfolio/invenire",
        ]

        base_time = timezone.now()
        for i, path in enumerate(test_paths):
            PageView.objects.create(
                path=path,
                referer="https://example.com" if i > 0 else "",
                user_agent="Test User Agent",
                session_id=f"test_session_{i}",
                created_at=base_time - timedelta(hours=i),
            )

        messages.success(request, f"Created {len(test_paths)} test page views.")
        return HttpResponseRedirect(reverse("admin:analytics_pageview_changelist"))

    def has_add_permission(self, request):
        # Disable manual addition - page views should be tracked automatically
        return False

    def has_change_permission(self, request, obj=None):
        # Allow viewing but not editing
        return False


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = [
        "event_name",
        "event_type",
        "path_short",
        "session_id",
        "created_at",
        "metadata_display",
    ]
    list_filter = ["event_type", "created_at", "event_name"]
    search_fields = ["event_name", "path", "session_id", "event_type"]
    readonly_fields = [
        "created_at",
        "event_type",
        "event_name",
        "path",
        "metadata",
        "user_agent",
        "ip_address",
        "session_id",
    ]
    date_hierarchy = "created_at"
    ordering = ["-created_at"]
    list_per_page = 50

    def path_short(self, obj):
        if obj.path:
            return obj.path[:30] + "..." if len(obj.path) > 30 else obj.path
        return "-"

    path_short.short_description = "Path"

    def metadata_display(self, obj):
        if obj.metadata:
            metadata_str = ", ".join(
                [f"{k}: {v}" for k, v in list(obj.metadata.items())[:3]]
            )
            return metadata_str[:50] + "..." if len(metadata_str) > 50 else metadata_str
        return "-"

    metadata_display.short_description = "Metadata"

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        total_events = self.model.objects.count()
        recent_events = self.model.objects.filter(
            created_at__gte=timezone.now() - timezone.timedelta(days=7)
        ).count()
        extra_context["total_events"] = total_events
        extra_context["recent_events"] = recent_events
        extra_context["show_info"] = total_events == 0
        extra_context["test_data_url"] = reverse(
            "admin:analytics_event_create_test_data"
        )
        return super().changelist_view(request, extra_context=extra_context)

    def get_urls(self):
        from django.urls import path

        urls = super().get_urls()
        custom_urls = [
            path(
                "create-test-data/",
                self.admin_site.admin_view(self.create_test_data),
                name="analytics_event_create_test_data",
            ),
        ]
        return custom_urls + urls

    def create_test_data(self, request):
        """Create sample test data for events."""
        from datetime import timedelta

        test_events = [
            {
                "event_type": "click",
                "event_name": "nav_link",
                "path": "/",
                "metadata": {"link": "Home"},
            },
            {
                "event_type": "click",
                "event_name": "nav_link",
                "path": "/portfolio",
                "metadata": {"link": "Portfolio"},
            },
            {
                "event_type": "click",
                "event_name": "blog_post_view",
                "path": "/blog",
                "metadata": {"postId": 1, "postTitle": "Test Post"},
            },
            {
                "event_type": "form_submit",
                "event_name": "form_submit_contact",
                "path": "/contact",
                "metadata": {"formName": "contact"},
            },
            {
                "event_type": "click",
                "event_name": "social_github",
                "path": "/",
                "metadata": {"platform": "github"},
            },
            {
                "event_type": "click",
                "event_name": "project_view",
                "path": "/portfolio/invenire",
                "metadata": {"projectId": 1, "projectTitle": "Invenire"},
            },
        ]

        base_time = timezone.now()
        for i, event_data in enumerate(test_events):
            Event.objects.create(
                event_type=event_data["event_type"],
                event_name=event_data["event_name"],
                path=event_data["path"],
                metadata=event_data["metadata"],
                user_agent="Test User Agent",
                session_id=f"test_session_{i}",
                created_at=base_time - timedelta(hours=i),
            )

        messages.success(request, f"Created {len(test_events)} test events.")
        return HttpResponseRedirect(reverse("admin:analytics_event_changelist"))

    def has_add_permission(self, request):
        # Disable manual addition - events should be tracked automatically
        return False

    def has_change_permission(self, request, obj=None):
        # Allow viewing but not editing
        return False
