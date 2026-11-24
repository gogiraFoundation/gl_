from datetime import timedelta

from django.conf import settings
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.analytics.models import Event, PageView


class Command(BaseCommand):
    help = "Null old IP/UA fields and delete aged analytics rows."

    def add_arguments(self, parser):
        parser.add_argument(
            "--days",
            type=int,
            default=None,
            help="Override ANALYTICS_IP_RETENTION_DAYS for nulling IP/UA.",
        )

    def handle(self, *args, **options):
        ip_days = options["days"] or getattr(
            settings, "ANALYTICS_IP_RETENTION_DAYS", 30
        )
        row_days = getattr(settings, "ANALYTICS_ROW_RETENTION_DAYS", 365)
        now = timezone.now()
        ip_cutoff = now - timedelta(days=ip_days)
        row_cutoff = now - timedelta(days=row_days)

        # Clear linkage fields on the short privacy window (IP/UA/session).
        pv_null = (
            PageView.objects.filter(created_at__lt=ip_cutoff)
            .exclude(ip_address__isnull=True, user_agent="", session_id="")
            .update(ip_address=None, user_agent="", session_id="")
        )
        ev_null = (
            Event.objects.filter(created_at__lt=ip_cutoff)
            .exclude(ip_address__isnull=True, user_agent="", session_id="")
            .update(ip_address=None, user_agent="", session_id="")
        )

        pv_deleted, _ = PageView.objects.filter(created_at__lt=row_cutoff).delete()
        ev_deleted, _ = Event.objects.filter(created_at__lt=row_cutoff).delete()

        self.stdout.write(
            self.style.SUCCESS(
                f"Nulled UA/IP/session on {pv_null} page views and {ev_null} events; "
                f"deleted {pv_deleted} page views and {ev_deleted} events."
            )
        )
