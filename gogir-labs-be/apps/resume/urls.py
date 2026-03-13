from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    CertificationViewSet,
    EducationViewSet,
    ExperienceViewSet,
    SkillViewSet,
    download_resume_pdf,
)

router = DefaultRouter()
router.register(r"experience", ExperienceViewSet, basename="experience")
router.register(r"education", EducationViewSet, basename="education")
router.register(r"certifications", CertificationViewSet, basename="certification")
router.register(r"skills", SkillViewSet, basename="skill")

urlpatterns = [
    path("", include(router.urls)),
    path("download/", download_resume_pdf, name="resume-download"),
]
