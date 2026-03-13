from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, ProjectViewSet, TechnologyViewSet

router = DefaultRouter()
router.register(r"projects", ProjectViewSet, basename="project")
router.register(r"technologies", TechnologyViewSet, basename="technology")
router.register(r"categories", CategoryViewSet, basename="category")

urlpatterns = [
    path("", include(router.urls)),
]
