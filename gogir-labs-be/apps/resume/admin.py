from django.contrib import admin
from .models import Experience, Education, Certification, Skill


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ["title", "company", "start_date", "end_date", "is_current", "order"]
    list_filter = ["is_current", "start_date"]
    search_fields = ["title", "company", "description"]
    ordering = ["-order", "-start_date"]


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = [
        "degree",
        "institution",
        "start_date",
        "end_date",
        "is_current",
        "order",
    ]
    list_filter = ["is_current", "start_date"]
    search_fields = ["degree", "institution", "field_of_study"]
    ordering = ["-order", "-start_date"]


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ["name", "issuer", "issue_date", "expiry_date", "order"]
    list_filter = ["issue_date", "issuer"]
    search_fields = ["name", "issuer"]
    ordering = ["-order", "-issue_date"]


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "proficiency", "order"]
    list_filter = ["category", "proficiency"]
    search_fields = ["name"]
    ordering = ["category", "order", "name"]
