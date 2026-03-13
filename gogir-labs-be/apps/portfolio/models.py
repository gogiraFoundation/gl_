from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    """Category for organizing projects."""

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Technology(models.Model):
    """Technology stack used in projects."""

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    icon = models.CharField(max_length=100, blank=True, help_text="Icon class or name")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Technologies"
        ordering = ["name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


def validate_image_file_size(value):
    max_size_mb = 5
    if value.size > max_size_mb * 1024 * 1024:
        raise ValidationError(f"Image file size must be <= {max_size_mb}MB.")


def validate_video_file_size(value):
    max_size_mb = 200
    if value.size > max_size_mb * 1024 * 1024:
        raise ValidationError(f"Video file size must be <= {max_size_mb}MB.")


class Project(models.Model):
    """Portfolio project model."""

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField()
    long_description = models.TextField(
        blank=True, help_text="Detailed project description"
    )
    featured_image = models.ImageField(
        upload_to="projects/",
        blank=True,
        null=True,
        help_text="Main project image",
        validators=[
            FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png", "webp"]),
            validate_image_file_size,
        ],
    )
    video = models.FileField(
        upload_to="projects/videos/",
        blank=True,
        null=True,
        help_text="Project video (MP4, WebM, etc.)",
        validators=[
            FileExtensionValidator(allowed_extensions=["mp4", "webm", "mov"]),
            validate_video_file_size,
        ],
    )
    video_url = models.URLField(
        blank=True, help_text="External video URL (YouTube, Vimeo, etc.)"
    )
    github_url = models.URLField(blank=True, help_text="GitHub repository URL")
    live_url = models.URLField(blank=True, help_text="Live demo URL")
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True
    )
    technologies = models.ManyToManyField(Technology, related_name="projects")
    featured = models.BooleanField(default=False, help_text="Show on homepage")
    published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    order = models.IntegerField(default=0, help_text="Display order")

    class Meta:
        ordering = ["-order", "-created_at"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        was_published = False
        if self.pk:
            try:
                old_instance = Project.objects.get(pk=self.pk)
                was_published = old_instance.published
            except Project.DoesNotExist:
                pass

        if not self.slug:
            self.slug = slugify(self.title)

        super().save(*args, **kwargs)

        # Send notification when project is published
        if self.published and not was_published:
            from apps.notifications.models import NotificationType
            from apps.notifications.services import NotificationService

            NotificationService.notify_admins(
                notification_type=NotificationType.CONTENT_PUBLISHED,
                title=f"New Project Published: {self.title}",
                message=f"A new project has been published:\n\n{self.title}\n\n{self.description}",
                data={
                    "content_type": "Project",
                    "content_title": self.title,
                    "content_slug": self.slug,
                    "description": self.description,
                    "content_url": f"/portfolio/",
                },
                related_object=self,
            )


class ProjectImage(models.Model):
    """Additional images for projects."""

    project = models.ForeignKey(
        Project, related_name="images", on_delete=models.CASCADE
    )
    image = models.ImageField(
        upload_to="projects/gallery/",
        validators=[
            FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png", "webp"]),
            validate_image_file_size,
        ],
    )
    caption = models.CharField(max_length=200, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.project.title} - Image {self.order}"
