from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("analytics", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="event",
            name="event_type",
            field=models.CharField(
                choices=[
                    ("click", "Click"),
                    ("download", "Download"),
                    ("form_submit", "Form Submit"),
                    ("video_play", "Video Play"),
                    ("search", "Search"),
                    ("custom", "Custom"),
                ],
                default="custom",
                max_length=50,
            ),
        ),
    ]
