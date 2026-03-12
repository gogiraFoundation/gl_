from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count
from django.utils import timezone
from .models import Notification, NotificationPreference, NotificationType
from .serializers import (
    NotificationSerializer,
    NotificationListSerializer,
    NotificationPreferenceSerializer,
)


class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user notifications.
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return notifications for the current user."""
        queryset = Notification.objects.filter(user=self.request.user)
        
        # Filter by read status
        read_status = self.request.query_params.get('read', None)
        if read_status is not None:
            queryset = queryset.filter(read=read_status.lower() == 'true')
        
        # Filter by type
        notification_type = self.request.query_params.get('type', None)
        if notification_type:
            queryset = queryset.filter(type=notification_type)
        
        return queryset.select_related('user', 'content_type')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return NotificationListSerializer
        return NotificationSerializer
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark a notification as read."""
        notification = self.get_object()
        notification.mark_as_read()
        return Response({'status': 'marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read."""
        count = Notification.objects.filter(
            user=request.user,
            read=False
        ).update(read=True, read_at=timezone.now())
        return Response({'status': 'marked as read', 'count': count})
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get notification statistics."""
        queryset = self.get_queryset()
        total = queryset.count()
        unread = queryset.filter(read=False).count()
        read = queryset.filter(read=True).count()
        
        # Count by type
        by_type = queryset.values('type').annotate(
            count=Count('id')
        ).order_by('-count')
        
        return Response({
            'total': total,
            'unread': unread,
            'read': read,
            'by_type': list(by_type),
        })


class NotificationPreferenceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing notification preferences.
    """
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return preferences for the current user."""
        return NotificationPreference.objects.filter(user=self.request.user)
    
    def get_serializer(self, *args, **kwargs):
        """Ensure user is set automatically."""
        if 'data' in kwargs:
            kwargs['data'] = {**kwargs['data'], 'user': self.request.user.id}
        return super().get_serializer(*args, **kwargs)

