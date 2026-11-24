from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SiteProfile
from .serializers import SiteProfileSerializer


class SiteProfileView(APIView):
    """Public GET and staff PATCH for the singleton site profile."""

    def get_permissions(self):
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request):
        profile = SiteProfile.load()
        return Response(SiteProfileSerializer(profile).data)

    def patch(self, request):
        profile = SiteProfile.load()
        serializer = SiteProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
