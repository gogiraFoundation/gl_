from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="SiteProfile",
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
                    "full_name",
                    models.CharField(default="Emmanuel Ugbaje", max_length=200),
                ),
                (
                    "headline",
                    models.CharField(
                        default="Software Engineer | Building Solutions with Data Insights",
                        max_length=300,
                    ),
                ),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("github_url", models.URLField(blank=True)),
                ("linkedin_url", models.URLField(blank=True)),
                ("location", models.CharField(blank=True, max_length=200)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "Site Profile",
                "verbose_name_plural": "Site Profile",
            },
        ),
    ]
