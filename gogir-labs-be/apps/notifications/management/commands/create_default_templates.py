"""
Management command to create default notification templates.
"""

from django.core.management.base import BaseCommand

from apps.notifications.models import NotificationTemplate, NotificationType


class Command(BaseCommand):
    help = "Create default notification templates"

    def handle(self, *args, **options):
        templates = [
            {
                "notification_type": NotificationType.CONTACT_MESSAGE,
                "subject_template": "New Contact Message: {{ subject }}",
                "body_template": """New message from {{ name }} ({{ email }})

Subject: {{ subject }}

Message:
{{ message }}

You can view and respond to this message in the admin panel.""",
                "html_template": """<html>
<body>
    <h2>New Contact Message</h2>
    <p><strong>From:</strong> {{ name }} ({{ email }})</p>
    <p><strong>Subject:</strong> {{ subject }}</p>
    <p><strong>Message:</strong></p>
    <p>{{ message }}</p>
    <p><a href="{{ admin_url }}">View in Admin Panel</a></p>
</body>
</html>""",
            },
            {
                "notification_type": NotificationType.BLOG_COMMENT,
                "subject_template": "New Comment on: {{ post_title }}",
                "body_template": """A new comment has been submitted on "{{ post_title }}"

Comment by: {{ commenter_name }}
Email: {{ commenter_email }}

Comment:
{{ comment_content }}

Please review and approve in the admin panel.""",
                "html_template": """<html>
<body>
    <h2>New Blog Comment</h2>
    <p><strong>Post:</strong> {{ post_title }}</p>
    <p><strong>Comment by:</strong> {{ commenter_name }} ({{ commenter_email }})</p>
    <p><strong>Comment:</strong></p>
    <p>{{ comment_content }}</p>
    <p><a href="{{ admin_url }}">Review in Admin Panel</a></p>
</body>
</html>""",
            },
            {
                "notification_type": NotificationType.BLOG_COMMENT_APPROVED,
                "subject_template": "Your comment has been approved",
                "body_template": """Your comment on "{{ post_title }}" has been approved and is now visible.

Thank you for your comment!""",
                "html_template": """<html>
<body>
    <h2>Comment Approved</h2>
    <p>Your comment on "<strong>{{ post_title }}</strong>" has been approved and is now visible.</p>
    <p><a href="{{ post_url }}">View Post</a></p>
</body>
</html>""",
            },
            {
                "notification_type": NotificationType.ANALYTICS_ALERT,
                "subject_template": "Analytics Alert: {{ alert_type }}",
                "body_template": """Analytics Alert: {{ alert_type }}

{{ message }}

Details:
{{ details }}""",
                "html_template": """<html>
<body>
    <h2>Analytics Alert</h2>
    <p><strong>Type:</strong> {{ alert_type }}</p>
    <p><strong>Message:</strong> {{ message }}</p>
    <p><strong>Details:</strong></p>
    <pre>{{ details }}</pre>
    <p><a href="{{ admin_url }}">View Analytics Dashboard</a></p>
</body>
</html>""",
            },
            {
                "notification_type": NotificationType.SYSTEM_ERROR,
                "subject_template": "System Error: {{ error_type }}",
                "body_template": """A system error has occurred:

Type: {{ error_type }}
Message: {{ error_message }}
Time: {{ timestamp }}

Please investigate immediately.""",
                "html_template": """<html>
<body>
    <h2>System Error</h2>
    <p><strong>Type:</strong> {{ error_type }}</p>
    <p><strong>Message:</strong> {{ error_message }}</p>
    <p><strong>Time:</strong> {{ timestamp }}</p>
    <p><a href="{{ admin_url }}">View Error Logs</a></p>
</body>
</html>""",
            },
            {
                "notification_type": NotificationType.CONTENT_PUBLISHED,
                "subject_template": "New Content Published: {{ content_title }}",
                "body_template": """New content has been published:

{{ content_type }}: {{ content_title }}

{{ description }}""",
                "html_template": """<html>
<body>
    <h2>New Content Published</h2>
    <p><strong>Type:</strong> {{ content_type }}</p>
    <p><strong>Title:</strong> {{ content_title }}</p>
    <p>{{ description }}</p>
    <p><a href="{{ content_url }}">View Content</a></p>
</body>
</html>""",
            },
        ]

        created_count = 0
        for template_data in templates:
            template, created = NotificationTemplate.objects.get_or_create(
                notification_type=template_data["notification_type"],
                defaults=template_data,
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Created template for {template_data["notification_type"]}'
                    )
                )
            else:
                self.stdout.write(
                    self.style.WARNING(
                        f'Template for {template_data["notification_type"]} already exists'
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully created {created_count} notification templates"
            )
        )
