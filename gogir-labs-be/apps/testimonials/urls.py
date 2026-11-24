from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    TestimonialInviteCreateView,
    TestimonialSubmitView,
    TestimonialViewSet,
)

router = DefaultRouter()
router.register(r"", TestimonialViewSet, basename="testimonial")

urlpatterns = [
    path("invites/", TestimonialInviteCreateView.as_view(), name="testimonial-invite"),
    path(
        "submit/<str:token>/",
        TestimonialSubmitView.as_view(),
        name="testimonial-submit",
    ),
    path("", include(router.urls)),
]
