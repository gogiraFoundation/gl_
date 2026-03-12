"""
API URL routing configuration.
"""
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.permissions import AllowAny

# Create custom views that explicitly allow unauthenticated access
class PublicTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]

class PublicTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]

urlpatterns = [
    # Authentication - Allow unauthenticated access for login
    path('auth/token/', PublicTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', PublicTokenRefreshView.as_view(), name='token_refresh'),
    
    # App endpoints
    path('portfolio/', include('apps.portfolio.urls')),
    path('blog/', include('apps.blog.urls')),
    path('testimonials/', include('apps.testimonials.urls')),
    path('contact/', include('apps.contact.urls')),
    path('analytics/', include('apps.analytics.urls')),
    path('notifications/', include('apps.notifications.urls')),
    path('newsletter/', include('apps.newsletter.urls')),
    path('search/', include('apps.search.urls')),
    path('resume/', include('apps.resume.urls')),
]
