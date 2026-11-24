from django.core import mail
from django.test import TestCase, override_settings

from apps.notifications.services import EmailService, format_from_address

LOC_MEM = "django.core.mail.backends.locmem.EmailBackend"


class FormatFromAddressTest(TestCase):
    def test_adds_display_name(self):
        self.assertEqual(
            format_from_address("hi@gogirlabs.uk", "Gogir Labs"),
            "Gogir Labs <hi@gogirlabs.uk>",
        )

    def test_leaves_an_address_that_already_has_a_name(self):
        raw = "Gogir Labs <hi@gogirlabs.uk>"
        self.assertEqual(format_from_address(raw, "Other"), raw)

    def test_omits_an_empty_display_name(self):
        self.assertEqual(format_from_address("hi@gogirlabs.uk", ""), "hi@gogirlabs.uk")


@override_settings(
    EMAIL_BACKEND=LOC_MEM,
    DEFAULT_FROM_EMAIL="hi@gogirlabs.uk",
    DEFAULT_FROM_NAME="Gogir Labs",
    EMAIL_REPLY_TO="hi@gogirlabs.uk",
)
class EmailServiceHeaderTest(TestCase):
    def test_default_sender_includes_name_and_reply_to(self):
        sent = EmailService.send_email(
            recipient="reader@example.com",
            subject="Hello",
            body="Plain",
            html_body="<p>Plain</p>",
        )

        self.assertTrue(sent)
        self.assertEqual(len(mail.outbox), 1)
        message = mail.outbox[0]
        self.assertEqual(message.from_email, "Gogir Labs <hi@gogirlabs.uk>")
        self.assertEqual(message.reply_to, ["hi@gogirlabs.uk"])
        self.assertEqual(message.to, ["reader@example.com"])
        self.assertEqual(message.alternatives[0][1], "text/html")

    def test_explicit_from_and_reply_to_override_defaults(self):
        EmailService.send_email(
            recipient="reader@example.com",
            subject="Hello",
            body="Plain",
            from_email="newsletter@gogirlabs.uk",
            reply_to=["ops@gogirlabs.uk"],
        )

        message = mail.outbox[0]
        self.assertEqual(message.from_email, "newsletter@gogirlabs.uk")
        self.assertEqual(message.reply_to, ["ops@gogirlabs.uk"])

    def test_empty_reply_to_omits_the_header(self):
        EmailService.send_email(
            recipient="reader@example.com",
            subject="Hello",
            body="Plain",
            reply_to=[],
        )

        self.assertEqual(mail.outbox[0].reply_to, [])


@override_settings(
    EMAIL_BACKEND=LOC_MEM,
    DEFAULT_FROM_EMAIL="hi@gogirlabs.uk",
    DEFAULT_FROM_NAME="Gogir Labs",
    FRONTEND_URL="https://www.gogirlabs.uk",
)
class NewsletterHtmlEscapeTest(TestCase):
    def test_subscriber_name_is_escaped_in_html_body(self):
        from apps.newsletter.models import NewsletterSubscriber
        from apps.newsletter.services import NewsletterService

        subscriber = NewsletterSubscriber.objects.create(
            email="reader@example.com",
            name='<script>alert("x")</script>',
        )
        NewsletterService.send_verification_email(subscriber)
        html_body = mail.outbox[0].alternatives[0][0]
        self.assertNotIn("<script>", html_body)
        self.assertIn("&lt;script&gt;", html_body)
