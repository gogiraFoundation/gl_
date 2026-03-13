from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import NewsletterSubscriber


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = [
        "email",
        "name",
        "is_active",
        "is_verified",
        "source",
        "subscribed_at",
        "actions_column",
    ]
    list_filter = ["is_active", "is_verified", "source", "subscribed_at"]
    search_fields = ["email", "name"]
    readonly_fields = [
        "subscribed_at",
        "unsubscribed_at",
        "verification_token",
        "unsubscribe_token",
    ]
    fieldsets = (
        ("Subscriber Information", {"fields": ("email", "name", "source")}),
        (
            "Status",
            {
                "fields": (
                    "is_active",
                    "is_verified",
                    "subscribed_at",
                    "unsubscribed_at",
                )
            },
        ),
        (
            "Tokens",
            {
                "fields": ("verification_token", "unsubscribe_token"),
                "classes": ("collapse",),
            },
        ),
        ("Metadata", {"fields": ("metadata",), "classes": ("collapse",)}),
    )
    actions = [
        "mark_as_verified",
        "mark_as_unverified",
        "activate_subscribers",
        "deactivate_subscribers",
    ]

    def actions_column(self, obj):
        """Display status badge."""
        if obj.is_active:
            return format_html(
                '<span class="badge" style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px;">Active</span>'
            )
        else:
            return format_html(
                '<span class="badge" style="background: #6b7280; color: white; padding: 4px 8px; border-radius: 4px;">Inactive</span>'
            )

    actions_column.short_description = "Status"

    def mark_as_verified(self, request, queryset):
        """Mark selected subscribers as verified."""
        queryset.update(is_verified=True)
        self.message_user(
            request, f"{queryset.count()} subscribers marked as verified."
        )

    mark_as_verified.short_description = "Mark as verified"

    def mark_as_unverified(self, request, queryset):
        """Mark selected subscribers as unverified."""
        queryset.update(is_verified=False)
        self.message_user(
            request, f"{queryset.count()} subscribers marked as unverified."
        )

    mark_as_unverified.short_description = "Mark as unverified"

    def activate_subscribers(self, request, queryset):
        """Activate selected subscribers."""
        count = 0
        for subscriber in queryset:
            subscriber.resubscribe()
            count += 1
        self.message_user(request, f"{count} subscribers activated.")

    activate_subscribers.short_description = "Activate subscribers"

    def deactivate_subscribers(self, request, queryset):
        """Deactivate selected subscribers."""
        count = 0
        for subscriber in queryset:
            subscriber.unsubscribe()
            count += 1
        self.message_user(request, f"{count} subscribers deactivated.")

    deactivate_subscribers.short_description = "Deactivate subscribers"
