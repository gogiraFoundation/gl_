from django.contrib import admin
from django import forms
from django.contrib.auth import get_user_model
from django.utils.html import format_html
from .models import (
    Notification,
    NotificationPreference,
    NotificationTemplate,
    NotificationType,
)

User = get_user_model()


class NotificationPreferenceForm(forms.ModelForm):
    """Custom form for bulk notification preference creation."""

    notification_types = forms.MultipleChoiceField(
        choices=NotificationType.CHOICES,
        widget=forms.CheckboxSelectMultiple(
            attrs={"class": "notification-types-checkboxes"}
        ),
        required=True,
        label="Notification Types",
        help_text="Select multiple notification types to create preferences for. You can select all types at once.",
    )
    email_enabled = forms.BooleanField(
        initial=True,
        required=False,
        label="Email Enabled",
        help_text="Enable email notifications for all selected types",
    )
    in_app_enabled = forms.BooleanField(
        initial=True,
        required=False,
        label="In-App Enabled",
        help_text="Enable in-app notifications for all selected types",
    )

    class Meta:
        model = NotificationPreference
        fields = ["user", "notification_types", "email_enabled", "in_app_enabled"]
        exclude = ["notification_type"]  # Exclude the single notification_type field

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # For new preferences, don't set initial
        if not (self.instance and self.instance.pk):
            self.fields["notification_types"].initial = []

    def save(self, commit=True):
        """Save multiple notification preferences."""
        user = self.cleaned_data["user"]
        notification_types = self.cleaned_data["notification_types"]
        email_enabled = self.cleaned_data["email_enabled"]
        in_app_enabled = self.cleaned_data["in_app_enabled"]

        if not notification_types:
            raise forms.ValidationError("Please select at least one notification type.")

        preferences = []
        for notification_type in notification_types:
            preference, created = NotificationPreference.objects.get_or_create(
                user=user,
                notification_type=notification_type,
                defaults={
                    "email_enabled": email_enabled,
                    "in_app_enabled": in_app_enabled,
                },
            )
            if not created:
                # Update existing preference
                preference.email_enabled = email_enabled
                preference.in_app_enabled = in_app_enabled
                preference.save()
            preferences.append(preference)

        # Return the first preference for compatibility with Django admin
        return preferences[0] if preferences else None


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ["title", "user", "type", "read", "created_at"]
    list_filter = ["type", "read", "created_at"]
    search_fields = ["title", "message", "user__username"]
    readonly_fields = ["created_at", "read_at"]
    ordering = ["-created_at"]

    fieldsets = (
        (
            "Notification Details",
            {"fields": ("user", "type", "title", "message", "data")},
        ),
        ("Status", {"fields": ("read", "read_at", "created_at")}),
        (
            "Related Object",
            {"fields": ("content_type", "object_id"), "classes": ("collapse",)},
        ),
    )


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "notification_type",
        "email_enabled",
        "in_app_enabled",
        "updated_at",
        "bulk_actions",
    ]
    list_filter = ["notification_type", "email_enabled", "in_app_enabled", "updated_at"]
    search_fields = ["user__username", "user__email", "notification_type"]
    readonly_fields = ["created_at", "updated_at"]

    def get_fieldsets(self, request, obj=None):
        """Different fieldsets for add vs change."""
        if obj is None:  # Adding new
            return (
                (
                    "User & Notification Types",
                    {
                        "fields": ("user", "notification_types"),
                        "description": "Select a user and one or more notification types to create preferences for. You can select multiple types at once.",
                    },
                ),
                (
                    "Preferences",
                    {
                        "fields": ("email_enabled", "in_app_enabled"),
                        "description": "These settings will be applied to all selected notification types.",
                    },
                ),
            )
        else:  # Editing existing
            return (
                (
                    "User & Notification Type",
                    {
                        "fields": ("user", "notification_type"),
                    },
                ),
                (
                    "Preferences",
                    {
                        "fields": ("email_enabled", "in_app_enabled"),
                    },
                ),
                (
                    "Timestamps",
                    {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
                ),
            )

    def bulk_actions(self, obj):
        """Display bulk action links."""
        return format_html(
            '<a href="/admin/notifications/notificationpreference/?user__id__exact={}" '
            'style="color: #417690;">View All for User</a>',
            obj.user.id,
        )

    bulk_actions.short_description = "Actions"

    def get_form(self, request, obj=None, **kwargs):
        """Use custom form for creating new preferences."""
        if obj is None:
            # For new preferences, use the custom form with multiple selection
            kwargs["form"] = NotificationPreferenceForm
        else:
            # For editing, use standard form with single notification_type
            class EditForm(forms.ModelForm):
                class Meta:
                    model = NotificationPreference
                    fields = [
                        "user",
                        "notification_type",
                        "email_enabled",
                        "in_app_enabled",
                    ]
                    widgets = {
                        "notification_type": forms.Select(
                            attrs={"readonly": True, "disabled": True}
                        )
                    }

            kwargs["form"] = EditForm
        return super().get_form(request, obj, **kwargs)

    def save_model(self, request, obj, form, change):
        """Handle saving multiple preferences."""
        if not change:  # Creating new
            # The form's save method handles creating multiple preferences
            saved_obj = form.save()
            if saved_obj:
                # Show success message with count
                from django.contrib import messages

                notification_types = form.cleaned_data.get("notification_types", [])
                messages.success(
                    request,
                    f"Successfully created {len(notification_types)} notification preference(s).",
                )
        else:  # Updating existing
            super().save_model(request, obj, form, change)

    class Media:
        css = {"all": ("admin/css/notification_preferences.css",)}
        js = ("admin/js/notification_preferences.js",)


@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(admin.ModelAdmin):
    list_display = ["notification_type", "enabled", "updated_at"]
    list_filter = ["enabled"]
    search_fields = ["notification_type", "subject_template"]
    readonly_fields = ["created_at", "updated_at"]

    fieldsets = (
        ("Template Info", {"fields": ("notification_type", "enabled")}),
        (
            "Email Templates",
            {"fields": ("subject_template", "body_template", "html_template")},
        ),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )
