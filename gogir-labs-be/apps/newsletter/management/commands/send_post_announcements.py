import html

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from apps.newsletter.models import NewsletterSubscriber, PostAnnouncement
from apps.newsletter.services import NewsletterService
from apps.notifications.services import EmailService
from apps.site.models import SiteProfile


class Command(BaseCommand):
    help = "Send pending new-post announcements to verified active subscribers."

    def handle(self, *args, **options):
        if not settings.NEWSLETTER_BROADCASTS_ENABLED:
            self.stdout.write(
                "NEWSLETTER_BROADCASTS_ENABLED is false; leaving announcements pending."
            )
            return

        sign_off = SiteProfile.load().display_name
        frontend = (settings.FRONTEND_URL or "http://localhost:3000").rstrip("/")
        from_email = NewsletterService.lifecycle_from_email()
        pending_ids = list(
            PostAnnouncement.objects.filter(
                status=PostAnnouncement.STATUS_PENDING
            ).values_list("pk", flat=True)
        )

        for announcement_id in pending_ids:
            self._process_announcement(announcement_id, sign_off, frontend, from_email)

    def _process_announcement(self, announcement_id, sign_off, frontend, from_email):
        with transaction.atomic():
            try:
                announcement = (
                    PostAnnouncement.objects.select_for_update()
                    .select_related("post")
                    .get(pk=announcement_id)
                )
            except PostAnnouncement.DoesNotExist:
                return
            if announcement.status != PostAnnouncement.STATUS_PENDING:
                return
            post = announcement.post
            if not post.published:
                return
            delivered_snapshot = list(announcement.delivered_to or [])
            post_pk = post.pk
            post_title = post.title or ""
            post_excerpt = post.excerpt or ""
            post_slug = post.slug

        # SMTP runs outside the lock so successful sends are not rolled back with
        # an open transaction; each delivery is committed in a short update below.
        recipients = list(
            NewsletterSubscriber.objects.filter(
                is_active=True, is_verified=True
            ).values_list("email", "unsubscribe_token")
        )
        target_emails = {email for email, _ in recipients}
        delivered_set = set(delivered_snapshot)
        safe_title = html.escape(post_title)
        safe_excerpt = html.escape(post_excerpt)
        safe_sign_off = html.escape(sign_off or "")
        post_url = f"{frontend}/blog/{post_slug}/"
        sent_now = 0

        for email, token in recipients:
            if email in delivered_set:
                continue
            unsubscribe_url = f"{frontend}/newsletter/unsubscribe?token={token}"
            subject = f"New post: {post_title}"
            body = (
                f"Hello,\n\n"
                f"{sign_off} just published a new post:\n\n"
                f"{post_title}\n\n"
                f"{post_excerpt}\n\n"
                f"Read it here: {post_url}\n\n"
                f"Unsubscribe: {unsubscribe_url}\n\n"
                f"Best regards,\n{sign_off}\n"
            )
            html_body = (
                f"<p>Hello,</p>"
                f"<p><strong>{safe_sign_off}</strong> just published a new post:</p>"
                f"<h2>{safe_title}</h2>"
                f"<p>{safe_excerpt}</p>"
                f'<p><a href="{html.escape(post_url)}">Read the post</a></p>'
                f'<p><a href="{html.escape(unsubscribe_url)}">Unsubscribe</a></p>'
                f"<p>Best regards,<br>{safe_sign_off}</p>"
            )
            if not EmailService.send_email(
                recipient=email,
                subject=subject,
                body=body,
                html_body=html_body,
                from_email=from_email,
            ):
                continue

            with transaction.atomic():
                announcement = PostAnnouncement.objects.select_for_update().get(
                    pk=announcement_id
                )
                if announcement.status != PostAnnouncement.STATUS_PENDING:
                    return
                delivered = list(announcement.delivered_to or [])
                if email not in delivered:
                    delivered.append(email)
                    announcement.delivered_to = delivered
                    announcement.sent_count = len(delivered)
                    announcement.save(update_fields=["delivered_to", "sent_count"])
                    sent_now += 1
                delivered_set = set(delivered)

        with transaction.atomic():
            announcement = PostAnnouncement.objects.select_for_update().get(
                pk=announcement_id
            )
            if announcement.status != PostAnnouncement.STATUS_PENDING:
                return
            delivered = list(announcement.delivered_to or [])
            delivered_set = set(delivered)
            announcement.sent_count = len(delivered)
            if target_emails.issubset(delivered_set):
                announcement.status = PostAnnouncement.STATUS_SENT
                announcement.sent_at = timezone.now()
                announcement.save(
                    update_fields=[
                        "status",
                        "sent_at",
                        "sent_count",
                        "delivered_to",
                    ]
                )
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Announcement for post {post_pk}: sent {sent_now} new messages "
                        f"({len(delivered)} total)."
                    )
                )
            else:
                announcement.save(update_fields=["sent_count", "delivered_to"])
                failed = len(target_emails - delivered_set)
                self.stdout.write(
                    self.style.WARNING(
                        f"Announcement for post {post_pk}: {sent_now} sent this run, "
                        f"{failed} still pending retry."
                    )
                )
