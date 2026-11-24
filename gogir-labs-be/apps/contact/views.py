from django.conf import settings
from django.db import transaction
from django.utils import timezone
from rest_framework import generics, status, views
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from apps.notifications.models import NotificationType
from apps.notifications.services import EmailService, NotificationService
from config.pagination import StaffListPagination

from .models import ContactMessage
from .serializers import (
    ContactMessageDetailSerializer,
    ContactMessageListSerializer,
    ContactMessageReplySerializer,
    ContactMessageSerializer,
)


class ContactMessageCreateView(generics.CreateAPIView):
    """
    Create a new contact message.
    Public endpoint with rate limiting.
    """

    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]
    throttle_scope = "contact"

    def perform_create(self, serializer):
        message = serializer.save()
        frontend = (settings.FRONTEND_URL or "http://localhost:3000").rstrip("/")
        # Send notification to all admins
        NotificationService.notify_admins(
            notification_type=NotificationType.CONTACT_MESSAGE,
            title=f"New Contact Message: {message.subject}",
            message=f"New message from {message.name} ({message.email})\n\nSubject: {message.subject}\n\nMessage:\n{message.message}",
            data={
                "name": message.name,
                "email": message.email,
                "subject": message.subject,
                "message": message.message,
                "admin_url": f"{frontend}/admin/contact",
            },
            related_object=message,
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"message": "Thank you for your message. We will get back to you soon!"},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


class ContactMessageListView(generics.ListAPIView):
    """
    List all contact messages (admin only).
    """

    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageListSerializer
    permission_classes = [IsAdminUser]
    pagination_class = StaffListPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        read_status = self.request.query_params.get("read", None)
        if read_status is not None:
            queryset = queryset.filter(read=read_status.lower() == "true")
        replied_status = self.request.query_params.get("replied", None)
        if replied_status is not None:
            queryset = queryset.filter(replied=replied_status.lower() == "true")
        return queryset


class ContactMessageDetailView(generics.RetrieveUpdateAPIView):
    """Retrieve or update a contact message (admin only). PATCH: read, replied."""

    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageDetailSerializer
    permission_classes = [IsAdminUser]
    http_method_names = ["get", "patch", "head", "options"]


class ContactMessageReplyView(views.APIView):
    """Email a reply to the sender and mark the message as replied."""

    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        serializer = ContactMessageReplySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reply_text = serializer.validated_data["message"]

        # Claim under lock before SMTP so concurrent admins get 409, not duplicate mail.
        with transaction.atomic():
            try:
                contact = ContactMessage.objects.select_for_update().get(pk=pk)
            except ContactMessage.DoesNotExist:
                return Response(
                    {"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND
                )

            if contact.replied:
                return Response(
                    {"detail": "This message has already been replied to."},
                    status=status.HTTP_409_CONFLICT,
                )

            # Soft-claim so a second concurrent POST cannot pass the check.
            contact.replied = True
            contact.read = True
            contact.reply_body = reply_text
            contact.replied_at = timezone.now()
            contact.save(update_fields=["reply_body", "replied", "read", "replied_at"])
            recipient = contact.email
            subject = f"Re: {contact.subject}"
            body = (
                f"Hello {contact.name},\n\n"
                f"{reply_text}\n\n"
                f"---\n"
                f"In reply to your message:\n{contact.message}"
            )
            contact_id = contact.pk

        sent = EmailService.send_email(
            recipient=recipient,
            subject=subject,
            body=body,
        )
        if not sent:
            # Roll back the soft-claim (including read) so staff can retry.
            with transaction.atomic():
                contact = ContactMessage.objects.select_for_update().get(pk=contact_id)
                contact.replied = False
                contact.read = False
                contact.reply_body = None
                contact.replied_at = None
                contact.save(
                    update_fields=["reply_body", "replied", "read", "replied_at"]
                )
            return Response(
                {"detail": "Failed to send reply email."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        contact = ContactMessage.objects.get(pk=contact_id)
        return Response(
            ContactMessageDetailSerializer(contact).data,
            status=status.HTTP_200_OK,
        )
