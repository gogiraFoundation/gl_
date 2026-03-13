from django.contrib import admin

from .models import Category, Comment, Post, Tag


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "created_at"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "created_at"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "author",
        "category",
        "published",
        "featured",
        "views",
        "created_at",
    ]
    list_filter = ["published", "featured", "category", "created_at"]
    search_fields = ["title", "content", "excerpt"]
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ["tags"]
    readonly_fields = ["views", "created_at", "updated_at"]
    ordering = ["-published_at", "-created_at"]
    actions = ["publish_posts", "unpublish_posts", "mark_featured", "unmark_featured"]

    def publish_posts(self, request, queryset):
        """Bulk publish selected posts."""
        count = queryset.update(published=True)
        self.message_user(request, f"{count} post(s) published successfully.")

    publish_posts.short_description = "Publish selected posts"

    def unpublish_posts(self, request, queryset):
        """Bulk unpublish selected posts."""
        count = queryset.update(published=False)
        self.message_user(request, f"{count} post(s) unpublished successfully.")

    unpublish_posts.short_description = "Unpublish selected posts"

    def mark_featured(self, request, queryset):
        """Mark selected posts as featured."""
        count = queryset.update(featured=True)
        self.message_user(request, f"{count} post(s) marked as featured.")

    mark_featured.short_description = "Mark selected posts as featured"

    def unmark_featured(self, request, queryset):
        """Unmark selected posts as featured."""
        count = queryset.update(featured=False)
        self.message_user(request, f"{count} post(s) unmarked as featured.")

    unmark_featured.short_description = "Unmark selected posts as featured"

    fieldsets = (
        ("Content", {"fields": ("title", "slug", "author", "excerpt", "content")}),
        ("Media", {"fields": ("featured_image", "video", "video_url")}),
        (
            "Metadata",
            {"fields": ("category", "tags", "published", "featured", "published_at")},
        ),
        ("SEO", {"fields": ("meta_title", "meta_description")}),
        ("Statistics", {"fields": ("views", "created_at", "updated_at")}),
    )


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "post", "approved", "created_at"]
    list_filter = ["approved", "created_at"]
    search_fields = ["name", "email", "content"]
    readonly_fields = ["created_at"]
