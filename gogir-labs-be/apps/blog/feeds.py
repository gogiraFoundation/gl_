from urllib.parse import urljoin

from django.conf import settings
from django.contrib.syndication.views import Feed
from django.utils.feedgenerator import Atom1Feed, Rss201rev2Feed

from apps.site.models import SiteProfile

from .blog_seed import public_post_visibility_q
from .models import Post


def _frontend_origin() -> str:
    return (getattr(settings, "FRONTEND_URL", None) or "http://localhost:3000").rstrip(
        "/"
    )


class BlogFeed(Feed):
    """Atom feed for blog posts (item links point at the public frontend)."""

    feed_type = Atom1Feed

    def title(self):
        name = SiteProfile.load().display_name
        return f"{name} - Blog"

    def link(self):
        return urljoin(_frontend_origin() + "/", "blog")

    def description(self):
        name = SiteProfile.load().display_name
        return f"Latest blog posts from {name}"

    def items(self):
        return (
            Post.objects.filter(published=True)
            .filter(public_post_visibility_q())
            .order_by("-published_at", "-created_at")[:20]
        )

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.excerpt

    def item_link(self, item):
        return f"{_frontend_origin()}/blog/{item.slug}"

    def item_pubdate(self, item):
        return item.published_at or item.created_at

    def item_author_name(self, item):
        return item.author.get_full_name() or item.author.username

    def item_categories(self, item):
        categories = []
        if item.category:
            categories.append(item.category.name)
        categories.extend([tag.name for tag in item.tags.all()])
        return categories


class BlogRSSFeed(BlogFeed):
    """RSS 2.0 feed for blog posts."""

    feed_type = Rss201rev2Feed
