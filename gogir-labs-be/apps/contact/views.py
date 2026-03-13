from django.conf import settings
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.notifications.models import NotificationType
from apps.notifications.services import NotificationService

from .models import ContactMessage
from .serializers import ContactMessageListSerializer, ContactMessageSerializer


class ContactMessageCreateView(generics.CreateAPIView):
    """
    Create a new contact message.
    Public endpoint with rate limiting.
    """

    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        message = serializer.save()
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
                "admin_url": f"{settings.ALLOWED_HOSTS[0] if settings.ALLOWED_HOSTS else 'localhost:8000'}/admin/contact/contactmessage/{message.id}/",
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
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter by read/unread status if provided
        read_status = self.request.query_params.get("read", None)
        if read_status is not None:
            queryset = queryset.filter(read=read_status.lower() == "true")
        return queryset
