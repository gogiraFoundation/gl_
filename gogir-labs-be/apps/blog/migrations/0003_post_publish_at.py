from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("blog", "0002_alter_post_content_ckeditor5"),
    ]

    operations = [
        migrations.AddField(
            model_name="post",
            name="publish_at",
            field=models.DateTimeField(
                blank=True,
                help_text="When set and published is false, publish_scheduled_posts will publish.",
                null=True,
            ),
        ),
    ]
