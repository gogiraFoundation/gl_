from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import NotificationPreferenceViewSet, NotificationViewSet

router = DefaultRouter()
# Register preferences before the empty prefix so /preferences/ is not swallowed.
router.register(
    r"preferences", NotificationPreferenceViewSet, basename="notification-preference"
)
router.register(r"", NotificationViewSet, basename="notification")

urlpatterns = [
    path("", include(router.urls)),
]
