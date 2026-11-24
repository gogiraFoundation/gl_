from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("portfolio", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="role",
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name="project",
            name="year",
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="project",
            name="client",
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name="project",
            name="outcomes",
            field=models.JSONField(blank=True, default=list),
        ),
    ]
