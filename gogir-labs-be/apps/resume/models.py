from django.db import models
from django.utils import timezone


class Experience(models.Model):
    """Work experience entry."""

    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(
        null=True, blank=True, help_text="Leave blank if current position"
    )
    is_current = models.BooleanField(default=False)
    description = models.TextField(help_text="Job description and achievements")
    technologies = models.CharField(
        max_length=500, blank=True, help_text="Comma-separated list of technologies"
    )
    order = models.IntegerField(default=0, help_text="Display order")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-order", "-start_date"]
        verbose_name_plural = "Experiences"

    def __str__(self):
        return f"{self.title} at {self.company}"


class Education(models.Model):
    """Education entry."""

    degree = models.CharField(max_length=200)
    institution = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True)
    field_of_study = models.CharField(max_length=200, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    gpa = models.CharField(max_length=20, blank=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-order", "-start_date"]

    def __str__(self):
        return f"{self.degree} from {self.institution}"


class Certification(models.Model):
    """Professional certification."""

    name = models.CharField(max_length=200)
    issuer = models.CharField(max_length=200)
    issue_date = models.DateField()
    expiry_date = models.DateField(null=True, blank=True)
    credential_id = models.CharField(max_length=100, blank=True)
    credential_url = models.URLField(blank=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-order", "-issue_date"]

    def __str__(self):
        return f"{self.name} from {self.issuer}"


class Skill(models.Model):
    """Skill entry."""

    CATEGORY_CHOICES = [
        ("programming", "Programming Languages"),
        ("framework", "Frameworks & Libraries"),
        ("database", "Databases"),
        ("cloud", "Cloud & DevOps"),
        ("tool", "Tools & Technologies"),
        ("soft", "Soft Skills"),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="tool")
    proficiency = models.IntegerField(
        null=True,
        blank=True,
        help_text="1-10 scale (optional)",
    )
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["category", "order", "name"]

    def __str__(self):
        return self.name
