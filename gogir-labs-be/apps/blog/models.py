from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from ckeditor.fields import RichTextField

User = get_user_model()


def validate_image_file_size(value):
    max_size_mb = 5
    if value.size > max_size_mb * 1024 * 1024:
        raise ValidationError(f"Image file size must be <= {max_size_mb}MB.")


def validate_video_file_size(value):
    max_size_mb = 200
    if value.size > max_size_mb * 1024 * 1024:
        raise ValidationError(f"Video file size must be <= {max_size_mb}MB.")


class Category(models.Model):
    """Blog post category."""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Tag(models.Model):
    """Blog post tag."""
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Post(models.Model):
    """Blog post model."""
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    excerpt = models.TextField(max_length=300, help_text="Short summary for listing pages")
    content = RichTextField()
    featured_image = models.ImageField(
        upload_to='blog/',
        blank=True,
        null=True,
        help_text="Blog post featured image",
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp']),
            validate_image_file_size,
        ],
    )
    video = models.FileField(
        upload_to='blog/videos/',
        blank=True,
        null=True,
        help_text="Blog post video (MP4, WebM, etc.)",
        validators=[
            FileExtensionValidator(allowed_extensions=['mp4', 'webm', 'mov']),
            validate_video_file_size,
        ],
    )
    video_url = models.URLField(blank=True, help_text="External video URL (YouTube, Vimeo, etc.)")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    tags = models.ManyToManyField(Tag, related_name='posts', blank=True)
    published = models.BooleanField(default=False)
    featured = models.BooleanField(default=False, help_text="Show on homepage")
    views = models.IntegerField(default=0)
    # SEO fields
    meta_title = models.CharField(max_length=200, blank=True, help_text="SEO title")
    meta_description = models.TextField(max_length=300, blank=True, help_text="SEO description")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-published_at', '-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        was_published = False
        if self.pk:
            try:
                old_instance = Post.objects.get(pk=self.pk)
                was_published = old_instance.published
            except Post.DoesNotExist:
                pass
        
        if not self.slug:
            self.slug = slugify(self.title)
        if self.published and not self.published_at:
            from django.utils import timezone
            self.published_at = timezone.now()
        
        super().save(*args, **kwargs)
        
        # Send notification when post is published
        if self.published and not was_published:
            from apps.notifications.services import NotificationService
            from apps.notifications.models import NotificationType
            NotificationService.notify_admins(
                notification_type=NotificationType.CONTENT_PUBLISHED,
                title=f"New Blog Post Published: {self.title}",
                message=f"A new blog post has been published:\n\n{self.title}\n\n{self.excerpt}",
                data={
                    'content_type': 'Blog Post',
                    'content_title': self.title,
                    'content_slug': self.slug,
                    'description': self.excerpt,
                    'content_url': f"/blog/{self.slug}/",
                },
                related_object=self
            )


class Comment(models.Model):
    """Blog post comment."""
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    content = models.TextField()
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Comment by {self.name} on {self.post.title}"

