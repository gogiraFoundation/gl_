from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly

from .models import Testimonial
from .serializers import TestimonialListSerializer, TestimonialSerializer


class TestimonialViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing Testimonial instances.
    """

    queryset = Testimonial.objects.filter(published=True)
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["featured", "published", "rating"]
    ordering_fields = ["order", "created_at"]
    ordering = ["-order", "-created_at"]

    def get_serializer_class(self):
        if self.action == "list":
            return TestimonialListSerializer
        return TestimonialSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        # Allow admins to see unpublished testimonials
        if self.request.user.is_authenticated and self.request.user.is_staff:
            queryset = Testimonial.objects.all()
        return queryset
