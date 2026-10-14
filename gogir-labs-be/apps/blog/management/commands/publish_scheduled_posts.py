from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.blog.models import Post


class Command(BaseCommand):
    help = "Publish posts whose publish_at has passed."

    def handle(self, *args, **options):
        now = timezone.now()
        due = Post.objects.filter(published=False, publish_at__lte=now)
        count = 0
        for post in due:
            post.published = True
            post.save()
            count += 1
        self.stdout.write(self.style.SUCCESS(f"Published {count} scheduled post(s)."))
