from django.contrib import admin
from .models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['client_name', 'company', 'rating', 'featured', 'published', 'order', 'created_at']
    list_filter = ['rating', 'featured', 'published', 'created_at']
    search_fields = ['client_name', 'company', 'content']
    ordering = ['-order', '-created_at']
    actions = ['publish_testimonials', 'unpublish_testimonials', 'mark_featured', 'unmark_featured']

    def publish_testimonials(self, request, queryset):
        """Bulk publish selected testimonials."""
        count = queryset.update(published=True)
        self.message_user(request, f'{count} testimonial(s) published successfully.')
    publish_testimonials.short_description = 'Publish selected testimonials'

    def unpublish_testimonials(self, request, queryset):
        """Bulk unpublish selected testimonials."""
        count = queryset.update(published=False)
        self.message_user(request, f'{count} testimonial(s) unpublished successfully.')
    unpublish_testimonials.short_description = 'Unpublish selected testimonials'

    def mark_featured(self, request, queryset):
        """Mark selected testimonials as featured."""
        count = queryset.update(featured=True)
        self.message_user(request, f'{count} testimonial(s) marked as featured.')
    mark_featured.short_description = 'Mark selected testimonials as featured'

    def unmark_featured(self, request, queryset):
        """Unmark selected testimonials as featured."""
        count = queryset.update(featured=False)
        self.message_user(request, f'{count} testimonial(s) unmarked as featured.')
    unmark_featured.short_description = 'Unmark selected testimonials as featured'

