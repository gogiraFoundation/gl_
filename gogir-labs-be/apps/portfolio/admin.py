from django.contrib import admin
from .models import Project, Technology, Category, ProjectImage


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "created_at"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "created_at"]
    prepopulated_fields = {"slug": ("name",)}


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "featured", "published", "order", "created_at"]
    list_filter = ["category", "featured", "published", "created_at"]
    search_fields = ["title", "description"]
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ["technologies"]
    inlines = [ProjectImageInline]
    ordering = ["-order", "-created_at"]
    actions = [
        "publish_projects",
        "unpublish_projects",
        "mark_featured",
        "unmark_featured",
    ]

    def publish_projects(self, request, queryset):
        """Bulk publish selected projects."""
        count = queryset.update(published=True)
        self.message_user(request, f"{count} project(s) published successfully.")

    publish_projects.short_description = "Publish selected projects"

    def unpublish_projects(self, request, queryset):
        """Bulk unpublish selected projects."""
        count = queryset.update(published=False)
        self.message_user(request, f"{count} project(s) unpublished successfully.")

    unpublish_projects.short_description = "Unpublish selected projects"

    def mark_featured(self, request, queryset):
        """Mark selected projects as featured."""
        count = queryset.update(featured=True)
        self.message_user(request, f"{count} project(s) marked as featured.")

    mark_featured.short_description = "Mark selected projects as featured"

    def unmark_featured(self, request, queryset):
        """Unmark selected projects as featured."""
        count = queryset.update(featured=False)
        self.message_user(request, f"{count} project(s) unmarked as featured.")

    unmark_featured.short_description = "Unmark selected projects as featured"

    fieldsets = (
        (
            "Basic Information",
            {
                "fields": (
                    "title",
                    "slug",
                    "description",
                    "long_description",
                    "category",
                    "technologies",
                )
            },
        ),
        ("Media", {"fields": ("featured_image", "video", "video_url")}),
        ("Links", {"fields": ("github_url", "live_url")}),
        ("Settings", {"fields": ("featured", "published", "order")}),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )
    readonly_fields = ["created_at", "updated_at"]
