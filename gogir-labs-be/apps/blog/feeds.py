from django.contrib.syndication.views import Feed
from django.utils.feedgenerator import Atom1Feed

from .models import Post


class BlogFeed(Feed):
    """RSS feed for blog posts."""

    title = "Emmanuel Ugbaije - Blog"
    link = "/blog/"
    description = "Latest blog posts from Emmanuel Ugbaije"
    feed_type = Atom1Feed

    def items(self):
        return Post.objects.filter(published=True).order_by(
            "-published_at", "-created_at"
        )[:20]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.excerpt

    def item_link(self, item):
        return f"/blog/{item.slug}/"

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

    feed_type = None  # Default RSS 2.0
