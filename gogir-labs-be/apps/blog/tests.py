import pytest
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.utils import timezone
from unittest.mock import patch, MagicMock
from .models import Post, Category, Tag, Comment

User = get_user_model()


class CategoryModelTest(TestCase):
    """Test Category model functionality and edge cases."""
    
    def test_category_creation(self):
        """Test basic category creation."""
        category = Category.objects.create(name='Technology')
        self.assertEqual(str(category), 'Technology')
        self.assertTrue(category.slug)
        self.assertEqual(category.slug, 'technology')
    
    def test_slug_auto_generation(self):
        """Test slug is auto-generated from name."""
        category = Category.objects.create(name='Web Development')
        self.assertEqual(category.slug, 'web-development')
    
    def test_unique_name_constraint(self):
        """Test that category names must be unique."""
        Category.objects.create(name='Django')
        with self.assertRaises(IntegrityError):
            Category.objects.create(name='Django')
    
    def test_slug_uniqueness_validation(self):
        """Test slug uniqueness."""
        Category.objects.create(name='Python')
        # Creating another with same slug should fail
        with self.assertRaises(IntegrityError):
            Category.objects.create(name='python', slug='python')
    
    def test_special_characters_in_name(self):
        """Test handling of special characters and unicode."""
        category = Category.objects.create(name='C++ & C#')
        self.assertTrue(category.slug)
        # Slug should handle special chars
        self.assertIn('c', category.slug.lower())
    
    def test_emoji_in_name(self):
        """Test handling of emojis in category name."""
        category = Category.objects.create(name='Python 🐍')
        self.assertTrue(category.slug)
        # Emoji should be removed or handled gracefully
        self.assertNotIn('🐍', category.slug)
    
    def test_very_long_name(self):
        """Test category with very long name."""
        long_name = 'A' * 100  # Exactly 100 chars
        category = Category.objects.create(name=long_name)
        self.assertEqual(len(category.name), 100)
        self.assertTrue(category.slug)
    
    def test_duplicate_slug_generation(self):
        """Test handling when two categories would generate same slug."""
        category1 = Category.objects.create(name='Test Category')
        # Second one with similar name should generate unique slug
        # Django's slugify will create same slug, but unique constraint prevents it
        with self.assertRaises(IntegrityError):
            Category.objects.create(name='test-category', slug=category1.slug)


class TagModelTest(TestCase):
    """Test Tag model functionality and edge cases."""
    
    def test_tag_creation(self):
        """Test basic tag creation."""
        tag = Tag.objects.create(name='Python')
        self.assertEqual(str(tag), 'Python')
        self.assertTrue(tag.slug)
        self.assertEqual(tag.slug, 'python')
    
    def test_slug_auto_generation(self):
        """Test slug is auto-generated from name."""
        tag = Tag.objects.create(name='Machine Learning')
        self.assertEqual(tag.slug, 'machine-learning')
    
    def test_unique_name_constraint(self):
        """Test that tag names must be unique."""
        Tag.objects.create(name='Django')
        with self.assertRaises(IntegrityError):
            Tag.objects.create(name='Django')
    
    def test_case_insensitive_duplicate_detection(self):
        """Test case-insensitive duplicate handling."""
        Tag.objects.create(name='Python')
        # Django's unique constraint is case-sensitive for name field
        # But slugify makes both 'python', so slug uniqueness will be violated
        # This test verifies that slug uniqueness is enforced
        with self.assertRaises(IntegrityError):
            Tag.objects.create(name='python')  # Will generate same slug 'python'


class PostModelTest(TestCase):
    """Test Post model functionality and edge cases."""
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.category = Category.objects.create(name='Technology')
        self.tag = Tag.objects.create(name='Python')
    
    def test_post_creation(self):
        """Test basic post creation."""
        post = Post.objects.create(
            title='Test Post',
            excerpt='Test Excerpt',
            content='Test Content',
            author=self.user,
            category=self.category,
            published=True,
        )
        post.tags.add(self.tag)
        self.assertEqual(str(post), 'Test Post')
        self.assertTrue(post.slug)
        self.assertEqual(post.author, self.user)
        self.assertIn(self.tag, post.tags.all())
    
    def test_slug_auto_generation(self):
        """Test slug is auto-generated from title."""
        post = Post.objects.create(
            title='My Awesome Blog Post',
            excerpt='Excerpt',
            content='Content',
            author=self.user,
        )
        self.assertEqual(post.slug, 'my-awesome-blog-post')
    
    def test_slug_uniqueness_validation(self):
        """Test slug uniqueness."""
        post1 = Post.objects.create(
            title='Test Post',
            excerpt='Excerpt',
            content='Content',
            author=self.user,
        )
        # Creating another with same title should generate same slug
        # Django's unique constraint should prevent this
        with self.assertRaises(IntegrityError):
            Post.objects.create(
                title='Test Post',
                excerpt='Excerpt 2',
                content='Content 2',
                author=self.user,
            )
    
    def test_published_at_auto_set_on_publish(self):
        """Test published_at is set when post is published."""
        post = Post.objects.create(
            title='Test Post',
            excerpt='Excerpt',
            content='Content',
            author=self.user,
            published=False,
        )
        self.assertIsNone(post.published_at)
        
        post.published = True
        post.save()
        self.assertIsNotNone(post.published_at)
    
    @patch('apps.notifications.services.NotificationService.notify_admins')
    def test_notification_trigger_on_publish(self, mock_notify):
        """Test notification is sent when post is published."""
        post = Post.objects.create(
            title='Test Post',
            excerpt='Excerpt',
            content='Content',
            author=self.user,
            published=False,
        )
        
        post.published = True
        post.save()
        
        # Notification should be called
        mock_notify.assert_called_once()
    
    @patch('apps.notifications.services.NotificationService.notify_admins')
    def test_no_notification_when_already_published(self, mock_notify):
        """Test notification is not sent when already published post is updated."""
        post = Post.objects.create(
            title='Test Post',
            excerpt='Excerpt',
            content='Content',
            author=self.user,
            published=True,
        )
        mock_notify.reset_mock()
        
        # Update published post
        post.title = 'Updated Title'
        post.save()
        
        # Notification should not be called again
        mock_notify.assert_not_called()
    
    def test_view_count_increment(self):
        """Test view count can be incremented."""
        post = Post.objects.create(
            title='Test Post',
            excerpt='Excerpt',
            content='Content',
            author=self.user,
        )
        initial_views = post.views
        post.views += 1
        post.save()
        self.assertEqual(post.views, initial_views + 1)
    
    def test_very_long_title(self):
        """Test post with very long title."""
        long_title = 'A' * 200  # Exactly 200 chars
        post = Post.objects.create(
            title=long_title,
            excerpt='Excerpt',
            content='Content',
            author=self.user,
        )
        self.assertEqual(len(post.title), 200)
    
    def test_very_long_content(self):
        """Test post with very long content."""
        long_content = 'A' * 10000
        post = Post.objects.create(
            title='Test Post',
            excerpt='Excerpt',
            content=long_content,
            author=self.user,
        )
        self.assertEqual(len(post.content), 10000)
    
    def test_html_content_in_richtextfield(self):
        """Test HTML content in RichTextField."""
        html_content = '<p>This is <strong>HTML</strong> content</p>'
        post = Post.objects.create(
            title='Test Post',
            excerpt='Excerpt',
            content=html_content,
            author=self.user,
        )
        self.assertIn('<strong>', post.content)
    
    def test_unpublishing_published_post(self):
        """Test unpublishing a published post."""
        post = Post.objects.create(
            title='Test Post',
            excerpt='Excerpt',
            content='Content',
            author=self.user,
            published=True,
        )
        published_at = post.published_at
        
        post.published = False
        post.save()
        
        # published_at should remain (not cleared)
        self.assertEqual(post.published_at, published_at)
    
    def test_missing_required_fields(self):
        """Test that required fields are enforced."""
        with self.assertRaises(Exception):  # Should raise validation error
            Post.objects.create(
                title='Test Post',
                # Missing required fields: excerpt, content, author
            )


class CommentModelTest(TestCase):
    """Test Comment model functionality and edge cases."""
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.post = Post.objects.create(
            title='Test Post',
            excerpt='Excerpt',
            content='Content',
            author=self.user,
        )
    
    def test_comment_creation(self):
        """Test basic comment creation."""
        comment = Comment.objects.create(
            post=self.post,
            name='John Doe',
            email='john@example.com',
            content='Great post!',
        )
        self.assertEqual(str(comment), f'Comment by John Doe on {self.post.title}')
        self.assertFalse(comment.approved)  # Default is False
    
    def test_comment_on_unpublished_post(self):
        """Test comment can be created on unpublished post."""
        unpublished_post = Post.objects.create(
            title='Unpublished Post',
            excerpt='Excerpt',
            content='Content',
            author=self.user,
            published=False,
        )
        comment = Comment.objects.create(
            post=unpublished_post,
            name='John Doe',
            email='john@example.com',
            content='Comment',
        )
        self.assertEqual(comment.post, unpublished_post)
    
    def test_very_long_comment_content(self):
        """Test comment with very long content."""
        long_content = 'A' * 5000
        comment = Comment.objects.create(
            post=self.post,
            name='John Doe',
            email='john@example.com',
            content=long_content,
        )
        self.assertEqual(len(comment.content), 5000)
    
    def test_comment_approval_workflow(self):
        """Test comment approval workflow."""
        comment = Comment.objects.create(
            post=self.post,
            name='John Doe',
            email='john@example.com',
            content='Comment',
        )
        self.assertFalse(comment.approved)
        
        comment.approved = True
        comment.save()
        self.assertTrue(comment.approved)
    
    def test_comment_foreign_key_cascade(self):
        """Test comment is deleted when post is deleted."""
        comment = Comment.objects.create(
            post=self.post,
            name='John Doe',
            email='john@example.com',
            content='Comment',
        )
        comment_id = comment.id
        
        self.post.delete()
        
        # Comment should be deleted
        self.assertFalse(Comment.objects.filter(id=comment_id).exists())
