from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("resume", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="skill",
            name="proficiency",
            field=models.IntegerField(
                blank=True,
                help_text="1-10 scale (optional)",
                null=True,
            ),
        ),
    ]

