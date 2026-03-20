# Generated migration: switch blog Post content from CKEditor 4 to CKEditor 5

from django.db import migrations
import django_ckeditor_5.fields


class Migration(migrations.Migration):

    dependencies = [
        ("blog", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="post",
            name="content",
            field=django_ckeditor_5.fields.CKEditor5Field(config_name="extends"),
        ),
    ]
