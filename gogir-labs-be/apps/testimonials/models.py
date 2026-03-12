from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator


def validate_image_file_size(value):
    max_size_mb = 5
    if value.size > max_size_mb * 1024 * 1024:
        raise ValidationError(f"Image file size must be <= {max_size_mb}MB.")


class Testimonial(models.Model):
    """Client testimonial model."""
    RATING_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]

    client_name = models.CharField(max_length=100)
    client_role = models.CharField(max_length=100, help_text="Job title or role")
    company = models.CharField(max_length=100, blank=True)
    content = models.TextField()
    rating = models.IntegerField(choices=RATING_CHOICES, default=5)
    client_image = models.ImageField(
        upload_to='testimonials/',
        blank=True,
        null=True,
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp']),
            validate_image_file_size,
        ],
    )
    company_logo = models.ImageField(
        upload_to='testimonials/logos/',
        blank=True,
        null=True,
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp']),
            validate_image_file_size,
        ],
    )
    featured = models.BooleanField(default=False, help_text="Show on homepage")
    published = models.BooleanField(default=True)
    order = models.IntegerField(default=0, help_text="Display order")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-order', '-created_at']

    def __str__(self):
        return f"Testimonial from {self.client_name}"

