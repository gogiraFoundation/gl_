import pytest
from django.test import TestCase

from .models import Event, PageView


class PageViewModelTest(TestCase):
    """Test PageView model functionality."""

    def test_page_view_creation(self):
        """Test basic page view creation."""
        page_view = PageView.objects.create(
            path="/test-page/",
            ip_address="127.0.0.1",
        )
        self.assertEqual(page_view.path, "/test-page/")
        self.assertEqual(str(page_view), f"/test-page/ - {page_view.created_at}")

    def test_page_view_with_referer(self):
        """Test page view with referer."""
        page_view = PageView.objects.create(
            path="/test-page/",
            referer="https://google.com",
            ip_address="127.0.0.1",
        )
        self.assertEqual(page_view.referer, "https://google.com")

    def test_concurrent_requests(self):
        """Test handling of concurrent page view requests."""
        # Create multiple page views (simulating concurrent requests)
        for _ in range(10):
            PageView.objects.create(
                path="/test-page/",
                ip_address="127.0.0.1",
            )
        count = PageView.objects.filter(path="/test-page/").count()
        self.assertEqual(count, 10)


class EventModelTest(TestCase):
    """Test Event model functionality."""

    def test_event_creation(self):
        """Test basic event creation."""
        event = Event.objects.create(
            event_type="click",
            event_name="button_click",
            path="/test-page/",
            ip_address="127.0.0.1",
        )
        self.assertEqual(event.event_type, "click")
        self.assertEqual(event.event_name, "button_click")

    def test_event_metadata_json_field(self):
        """Test event metadata JSON field."""
        metadata = {"button_id": "submit", "timestamp": "2024-01-01"}
        event = Event.objects.create(
            event_type="click",
            event_name="button_click",
            path="/test-page/",
            ip_address="127.0.0.1",
            metadata=metadata,
        )
        self.assertEqual(event.metadata, metadata)
