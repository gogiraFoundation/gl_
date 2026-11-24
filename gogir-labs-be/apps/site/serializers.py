from rest_framework import serializers

from .models import SiteProfile


class SiteProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteProfile
        fields = [
            "full_name",
            "headline",
            "email",
            "github_url",
            "linkedin_url",
            "location",
            "updated_at",
        ]
        read_only_fields = ["updated_at"]
