from rest_framework import generics, status, views
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.conf import settings

from .models import NewsletterSubscriber
from .serializers import (
    NewsletterSubscribeSerializer,
    NewsletterUnsubscribeSerializer,
    NewsletterSubscriberSerializer,
    NewsletterSendSerializer
)
from .services import NewsletterService


class NewsletterSubscribeView(generics.CreateAPIView):
    """
    Subscribe to newsletter.
    Public endpoint.
    """
    serializer_class = NewsletterSubscribeSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscriber = serializer.save()
        
        # Send verification email
        NewsletterService.send_verification_email(subscriber)
        
        return Response(
            {
                'message': 'Successfully subscribed! Please check your email to verify your subscription.',
                'subscriber': {
                    'email': subscriber.email,
                    'verification_required': not subscriber.is_verified
                }
            },
            status=status.HTTP_201_CREATED
        )


class NewsletterVerifyView(views.APIView):
    """
    Verify newsletter subscription via token.
    Public endpoint.
    """
    permission_classes = [AllowAny]

    def get(self, request, token):
        try:
            subscriber = NewsletterSubscriber.objects.get(verification_token=token)
            if subscriber.is_verified:
                return Response(
                    {'message': 'Email already verified.'},
                    status=status.HTTP_200_OK
                )
            
            subscriber.verify()
            # Send welcome email
            NewsletterService.send_welcome_email(subscriber)
            
            return Response(
                {'message': 'Email verified successfully! Welcome to our newsletter.'},
                status=status.HTTP_200_OK
            )
        except NewsletterSubscriber.DoesNotExist:
            return Response(
                {'error': 'Invalid verification token.'},
                status=status.HTTP_404_NOT_FOUND
            )


class NewsletterUnsubscribeView(views.APIView):
    """
    Unsubscribe from newsletter.
    Public endpoint.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = NewsletterUnsubscribeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        token = serializer.validated_data.get('token')
        email = serializer.validated_data.get('email')
        
        if token:
            try:
                subscriber = NewsletterSubscriber.objects.get(unsubscribe_token=token)
            except NewsletterSubscriber.DoesNotExist:
                return Response(
                    {'error': 'Invalid unsubscribe token.'},
                    status=status.HTTP_404_NOT_FOUND
                )
        elif email:
            try:
                subscriber = NewsletterSubscriber.objects.get(email=email.lower().strip())
            except NewsletterSubscriber.DoesNotExist:
                return Response(
                    {'error': 'Email not found in our newsletter list.'},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            return Response(
                {'error': 'Either token or email must be provided.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not subscriber.is_active:
            return Response(
                {'message': 'You are already unsubscribed.'},
                status=status.HTTP_200_OK
            )
        
        subscriber.unsubscribe()
        NewsletterService.send_unsubscribe_confirmation(subscriber)
        
        return Response(
            {'message': 'Successfully unsubscribed from newsletter.'},
            status=status.HTTP_200_OK
        )


class NewsletterSubscriberListView(generics.ListAPIView):
    """
    List all newsletter subscribers (admin only).
    """
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        # Filter by verified status
        is_verified = self.request.query_params.get('is_verified', None)
        if is_verified is not None:
            queryset = queryset.filter(is_verified=is_verified.lower() == 'true')
        
        # Search by email
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(email__icontains=search)
        
        return queryset


class NewsletterStatsView(views.APIView):
    """
    Get newsletter subscription statistics (admin only).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total = NewsletterSubscriber.objects.count()
        active = NewsletterSubscriber.objects.filter(is_active=True).count()
        verified = NewsletterSubscriber.objects.filter(is_verified=True).count()
        unverified = NewsletterSubscriber.objects.filter(is_verified=False, is_active=True).count()
        
        return Response({
            'total_subscribers': total,
            'active_subscribers': active,
            'verified_subscribers': verified,
            'unverified_subscribers': unverified,
            'inactive_subscribers': total - active
        })


class NewsletterSendView(views.APIView):
    """
    Send newsletter to subscribers (admin only).
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = NewsletterSendSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        result = NewsletterService.send_newsletter(
            subject=serializer.validated_data['subject'],
            message=serializer.validated_data['message'],
            html_message=serializer.validated_data.get('html_message'),
            send_to_verified_only=serializer.validated_data.get('send_to_verified_only', True),
            test_email=serializer.validated_data.get('test_email')
        )
        
        if result['success']:
            return Response(result, status=status.HTTP_200_OK)
        else:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

