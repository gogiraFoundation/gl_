from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("resume", "0002_make_skill_proficiency_optional"),
    ]

    operations = [
        migrations.AddField(
            model_name="experience",
            name="highlights",
            field=models.JSONField(
                blank=True,
                default=list,
                help_text="Bullet points for the resume page",
            ),
        ),
        migrations.AddField(
            model_name="education",
            name="highlights",
            field=models.JSONField(
                blank=True,
                default=list,
                help_text="Bullet points for the resume page",
            ),
        ),
    ]
