import html

from django.conf import settings
from django.db import transaction
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, views, viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from apps.notifications.services import EmailService
from apps.site.models import SiteProfile

from .models import Testimonial, TestimonialInvite
from .serializers import (
    TestimonialInviteCreateSerializer,
    TestimonialListSerializer,
    TestimonialSerializer,
    TestimonialSubmitSerializer,
)

INVALID_INVITE = {"detail": "This link is no longer valid."}


class TestimonialViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing Testimonial instances.
    Public reads; staff-only create/update/delete.
    """

    queryset = Testimonial.objects.filter(published=True)
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["featured", "published", "rating"]
    ordering_fields = ["order", "created_at"]
    ordering = ["-order", "-created_at"]

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        return [IsAdminUser()]

    def get_serializer_class(self):
        if self.action == "list":
            return TestimonialListSerializer
        return TestimonialSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_authenticated and self.request.user.is_staff:
            queryset = Testimonial.objects.all()
        return queryset


class TestimonialInviteCreateView(views.APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = TestimonialInviteCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].lower().strip()
        invite = TestimonialInvite.objects.create(email=email)
        frontend = (settings.FRONTEND_URL or "http://localhost:3000").rstrip("/")
        submit_url = f"{frontend}/testimonials/submit/{invite.token}"
        name = SiteProfile.load().display_name
        safe_name = html.escape(name)
        sent = EmailService.send_email(
            recipient=email,
            subject=f"You're invited to leave a testimonial for {name}",
            body=(
                f"Hello,\n\n"
                f"{name} invited you to share a short testimonial.\n\n"
                f"Submit it here (link expires in 14 days):\n{submit_url}\n\n"
                f"Thank you,\n{name}\n"
            ),
            html_body=(
                f"<p>Hello,</p>"
                f"<p>{safe_name} invited you to share a short testimonial.</p>"
                f'<p><a href="{html.escape(submit_url)}">Submit your testimonial</a></p>'
                f"<p>This link expires in 14 days.</p>"
            ),
        )
        if not sent:
            invite.delete()
            return Response(
                {"detail": "Failed to send invite email."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(
            {"email": invite.email, "expires_at": invite.expires_at},
            status=status.HTTP_201_CREATED,
        )


class TestimonialSubmitView(views.APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "testimonial_submit"

    def post(self, request, token):
        serializer = TestimonialSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Claim the invite under lock so concurrent POSTs cannot double-create.
        with transaction.atomic():
            try:
                invite = TestimonialInvite.objects.select_for_update().get(token=token)
            except TestimonialInvite.DoesNotExist:
                return Response(INVALID_INVITE, status=status.HTTP_404_NOT_FOUND)

            if not invite.is_valid:
                return Response(INVALID_INVITE, status=status.HTTP_404_NOT_FOUND)

            Testimonial.objects.create(
                client_name=data["client_name"],
                client_role=data["client_role"],
                company=data.get("company", ""),
                content=data["content"],
                rating=data.get("rating", 5),
                published=False,
                featured=False,
            )
            invite.used_at = timezone.now()
            invite.save(update_fields=["used_at"])

        return Response(
            {"message": "Thank you. Your testimonial was submitted for review."},
            status=status.HTTP_201_CREATED,
        )
