# Generated manually

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="NewsletterSubscriber",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "email",
                    models.EmailField(db_index=True, max_length=254, unique=True),
                ),
                ("name", models.CharField(blank=True, max_length=255, null=True)),
                ("subscribed_at", models.DateTimeField(auto_now_add=True)),
                ("unsubscribed_at", models.DateTimeField(blank=True, null=True)),
                ("is_active", models.BooleanField(default=True)),
                ("is_verified", models.BooleanField(default=False)),
                (
                    "verification_token",
                    models.CharField(blank=True, max_length=64, null=True, unique=True),
                ),
                (
                    "unsubscribe_token",
                    models.CharField(blank=True, max_length=64, null=True, unique=True),
                ),
                ("source", models.CharField(blank=True, max_length=100)),
                ("metadata", models.JSONField(blank=True, default=dict)),
            ],
            options={
                "verbose_name": "Newsletter Subscriber",
                "verbose_name_plural": "Newsletter Subscribers",
                "ordering": ["-subscribed_at"],
            },
        ),
    ]
