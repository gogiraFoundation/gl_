from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase, override_settings
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from .models import PageView

User = get_user_model()


class AnalyticsAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.staff = User.objects.create_user(
            username="staff", password="testpass", is_staff=True
        )

    def test_pageview_does_not_store_ip(self):
        response = self.client.post(
            "/api/v1/analytics/pageviews/",
            {
                "path": "/about/",
                "ip_address": "1.2.3.4",
                "session_id": "abc",
                "user_agent": "x" * 300,
            },
            format="json",
            REMOTE_ADDR="9.9.9.9",
            HTTP_X_FORWARDED_FOR="8.8.8.8, 7.7.7.7",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        pageview = PageView.objects.get(path="/about/")
        self.assertIsNone(pageview.ip_address)
        self.assertEqual(len(pageview.user_agent), 200)

    def test_stats_include_top_referrers(self):
        PageView.objects.create(path="/", referer="https://example.com")
        PageView.objects.create(path="/", referer="https://example.com")
        PageView.objects.create(path="/", referer="")
        self.client.force_authenticate(user=self.staff)
        response = self.client.get("/api/v1/analytics/pageviews/stats/", {"days": 30})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("top_referrers", response.data)
        self.assertEqual(
            response.data["top_referrers"][0]["referer"], "https://example.com"
        )
        self.assertEqual(response.data["top_referrers"][0]["count"], 2)

    def test_stats_rejects_non_integer_days(self):
        self.client.force_authenticate(user=self.staff)
        response = self.client.get(
            "/api/v1/analytics/pageviews/stats/", {"days": "abc"}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @override_settings(
        ANALYTICS_IP_RETENTION_DAYS=30,
        ANALYTICS_ROW_RETENTION_DAYS=365,
    )
    def test_purge_clears_session_on_privacy_window(self):
        old = PageView.objects.create(
            path="/old/",
            session_id="keep-me-linked",
            user_agent="Mozilla",
        )
        PageView.objects.filter(pk=old.pk).update(
            created_at=timezone.now() - timedelta(days=45)
        )
        call_command("purge_analytics")
        old.refresh_from_db()
        self.assertEqual(old.session_id, "")
        self.assertEqual(old.user_agent, "")
        self.assertIsNone(old.ip_address)
