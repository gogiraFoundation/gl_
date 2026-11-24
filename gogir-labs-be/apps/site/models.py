from django.conf import settings
from django.db import models

DEFAULT_FULL_NAME = "Emmanuel Ugbaje"
DEFAULT_HEADLINE = "Software Engineer | Building Solutions with Data Insights"


class SiteProfile(models.Model):
    """Singleton site identity used by resume PDF, feeds, and email sign-offs."""

    full_name = models.CharField(max_length=200, default=DEFAULT_FULL_NAME)
    headline = models.CharField(max_length=300, default=DEFAULT_HEADLINE)
    email = models.EmailField(blank=True)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site Profile"
        verbose_name_plural = "Site Profile"

    def __str__(self):
        return self.full_name or DEFAULT_FULL_NAME

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls) -> "SiteProfile":
        profile, _ = cls.objects.get_or_create(
            pk=1,
            defaults={
                "full_name": (
                    getattr(settings, "DEFAULT_FROM_NAME", "") or DEFAULT_FULL_NAME
                ).strip()
                or DEFAULT_FULL_NAME,
                "headline": DEFAULT_HEADLINE,
            },
        )
        return profile

    @property
    def display_name(self) -> str:
        return (self.full_name or "").strip() or DEFAULT_FULL_NAME
