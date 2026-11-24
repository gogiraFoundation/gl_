from django.db import IntegrityError
from django.utils import timezone
from rest_framework import generics, status, views
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from config.pagination import StaffListPagination

from .models import NewsletterSubscriber
from .serializers import (
    SUBSCRIBE_SUCCESS_MESSAGE,
    NewsletterSendSerializer,
    NewsletterSubscriberSerializer,
    NewsletterSubscribeSerializer,
    NewsletterUnsubscribeSerializer,
)
from .services import NewsletterService

GENERIC_UNSUBSCRIBE_MESSAGE = (
    "If a matching subscription exists, it has been unsubscribed successfully."
)
GENERIC_UNSUBSCRIBE_LINK_MESSAGE = (
    "If a matching subscription exists, an unsubscribe link has been sent."
)


class NewsletterSubscribeView(generics.CreateAPIView):
    """
    Subscribe to newsletter.
    Public endpoint. Response shape does not reveal existing membership.
    """

    serializer_class = NewsletterSubscribeSerializer
    permission_classes = [AllowAny]
    throttle_scope = "newsletter_subscribe"

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscriber = serializer.save()

        if getattr(subscriber, "_send_verification", True):
            sent = NewsletterService.send_verification_email(subscriber)
            if sent is True:
                metadata = dict(subscriber.metadata or {})
                metadata["verification_sent_at"] = timezone.now().isoformat()
                subscriber.metadata = metadata
                subscriber.save(update_fields=["metadata"])

        return Response(
            {
                "message": SUBSCRIBE_SUCCESS_MESSAGE,
                "subscriber": {
                    # Always the same shape so membership is not revealed.
                    "email": serializer.validated_data["email"],
                    "verification_required": True,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class NewsletterVerifyView(views.APIView):
    """
    Verify newsletter subscription via token.
    POST only. GET must not confirm the address: mail scanners prefetch links.
    """

    permission_classes = [AllowAny]
    throttle_scope = "newsletter_verify"

    def _verify(self, token):
        try:
            subscriber = NewsletterSubscriber.objects.get(verification_token=token)
        except NewsletterSubscriber.DoesNotExist:
            return Response(
                {"error": "Invalid verification token."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # After unsubscribe the token is rotated; reject stale inactive rows
        # that still somehow share a token (legacy data / race).
        if not subscriber.is_active:
            return Response(
                {"error": "Invalid verification token."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if subscriber.is_verified:
            return Response(
                {"message": "Email already verified."}, status=status.HTTP_200_OK
            )

        subscriber.verify()
        NewsletterService.send_welcome_email(subscriber)

        return Response(
            {"message": "Email verified successfully! Welcome to our newsletter."},
            status=status.HTTP_200_OK,
        )

    def post(self, request, token):
        return self._verify(token)

    def get(self, request, token):
        # Scanners prefetch GET. Do not look up or confirm the token.
        return Response(
            {"error": "Verification requires POST."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )


class NewsletterUnsubscribeView(views.APIView):
    """
    Unsubscribe from newsletter.
    Token deactivates immediately. Email alone sends a link and does not deactivate.
    """

    permission_classes = [AllowAny]
    throttle_scope = "newsletter_unsubscribe"

    def post(self, request):
        serializer = NewsletterUnsubscribeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data.get("token")
        email = serializer.validated_data.get("email")

        if token:
            try:
                subscriber = NewsletterSubscriber.objects.get(unsubscribe_token=token)
            except NewsletterSubscriber.DoesNotExist:
                return Response(
                    {"message": GENERIC_UNSUBSCRIBE_MESSAGE}, status=status.HTTP_200_OK
                )

            if not subscriber.is_active:
                return Response(
                    {"message": GENERIC_UNSUBSCRIBE_MESSAGE}, status=status.HTTP_200_OK
                )

            subscriber.unsubscribe()
            NewsletterService.send_unsubscribe_confirmation(subscriber)
            return Response(
                {"message": GENERIC_UNSUBSCRIBE_MESSAGE}, status=status.HTTP_200_OK
            )

        # Email path: send a one-click link; never deactivate from the address alone.
        if not email:
            return Response(
                {"message": GENERIC_UNSUBSCRIBE_LINK_MESSAGE},
                status=status.HTTP_200_OK,
            )
        normalized = email.lower().strip()
        subscriber = NewsletterSubscriber.objects.filter(
            email__iexact=normalized
        ).first()
        if subscriber is None:
            return Response(
                {"message": GENERIC_UNSUBSCRIBE_LINK_MESSAGE},
                status=status.HTTP_200_OK,
            )

        if subscriber.email != normalized:
            try:
                subscriber.email = normalized
                subscriber.save(update_fields=["email"])
            except IntegrityError:
                # Legacy case-variant duplicates: skip normalize, still send link.
                pass

        if subscriber.is_active:
            NewsletterService.send_unsubscribe_link_email(subscriber)

        return Response(
            {"message": GENERIC_UNSUBSCRIBE_LINK_MESSAGE}, status=status.HTTP_200_OK
        )


class NewsletterSubscriberListView(generics.ListAPIView):
    """
    List all newsletter subscribers (admin only).
    """

    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer
    permission_classes = [IsAdminUser]
    pagination_class = StaffListPagination

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filter by active status
        is_active = self.request.query_params.get("is_active", None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == "true")

        # Filter by verified status
        is_verified = self.request.query_params.get("is_verified", None)
        if is_verified is not None:
            queryset = queryset.filter(is_verified=is_verified.lower() == "true")

        # Search by email
        search = self.request.query_params.get("search", None)
        if search:
            queryset = queryset.filter(email__icontains=search)

        return queryset


class NewsletterStatsView(views.APIView):
    """
    Get newsletter subscription statistics (admin only).
    """

    permission_classes = [IsAdminUser]

    def get(self, request):
        total = NewsletterSubscriber.objects.count()
        active = NewsletterSubscriber.objects.filter(is_active=True).count()
        verified = NewsletterSubscriber.objects.filter(is_verified=True).count()
        unverified = NewsletterSubscriber.objects.filter(
            is_verified=False, is_active=True
        ).count()

        return Response(
            {
                "total_subscribers": total,
                "active_subscribers": active,
                "verified_subscribers": verified,
                "unverified_subscribers": unverified,
                "inactive_subscribers": total - active,
            }
        )


class NewsletterSendView(views.APIView):
    """
    Send newsletter to subscribers (admin only).
    """

    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = NewsletterSendSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = NewsletterService.send_newsletter(
            subject=serializer.validated_data["subject"],
            message=serializer.validated_data["message"],
            html_message=serializer.validated_data.get("html_message"),
            send_to_verified_only=serializer.validated_data.get(
                "send_to_verified_only", True
            ),
            test_email=serializer.validated_data.get("test_email"),
        )

        if result["success"]:
            return Response(result, status=status.HTTP_200_OK)
        if result.get("disabled"):
            return Response(result, status=status.HTTP_403_FORBIDDEN)
        return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
