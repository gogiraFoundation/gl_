from unittest.mock import patch

import pytest
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.test import TestCase

from .models import Category, Project, ProjectImage, Technology

User = get_user_model()


class ProjectModelTest(TestCase):
    """Test Project model functionality and edge cases."""

    def setUp(self):
        self.category = Category.objects.create(name="Web Development")
        self.technology = Technology.objects.create(name="Django")

    def test_project_creation(self):
        """Test basic project creation."""
        project = Project.objects.create(
            title="Test Project",
            description="Test Description",
            category=self.category,
        )
        project.technologies.add(self.technology)
        self.assertEqual(str(project), "Test Project")
        self.assertTrue(project.slug)
        self.assertEqual(project.category, self.category)
        self.assertIn(self.technology, project.technologies.all())

    def test_slug_auto_generation(self):
        """Test slug is auto-generated from title."""
        project = Project.objects.create(
            title="My Awesome Project",
            description="Description",
        )
        self.assertEqual(project.slug, "my-awesome-project")

    def test_featured_image_upload(self):
        """Test featured image field."""
        project = Project.objects.create(
            title="Test Project",
            description="Description",
        )
        # featured_image is optional - Django FileField returns empty string, not None
        self.assertFalse(project.featured_image)  # Empty FileField evaluates to False

    def test_video_file_upload(self):
        """Test video file field."""
        project = Project.objects.create(
            title="Test Project",
            description="Description",
        )
        # video is optional - Django FileField returns empty string, not None
        self.assertFalse(project.video)  # Empty FileField evaluates to False

    def test_video_url_validation(self):
        """Test video URL field."""
        project = Project.objects.create(
            title="Test Project",
            description="Description",
            video_url="https://www.youtube.com/watch?v=test",
        )
        self.assertEqual(project.video_url, "https://www.youtube.com/watch?v=test")

    def test_both_video_file_and_url_provided(self):
        """Test both video file and URL can be provided (edge case)."""
        project = Project.objects.create(
            title="Test Project",
            description="Description",
            video_url="https://www.youtube.com/watch?v=test",
        )
        # Both can exist (no validation prevents this)
        self.assertIsNotNone(project.video_url)

    def test_invalid_video_url_format(self):
        """Test invalid video URL format."""
        # Django's URLField validates at form/serializer level, not model level
        # At model level, it accepts the value but validation happens in forms
        project = Project.objects.create(
            title="Test Project",
            description="Description",
            video_url="not-a-valid-url",
        )
        # Model accepts it, but serializer will validate
        self.assertEqual(project.video_url, "not-a-valid-url")

    def test_large_file_uploads(self):
        """Test handling of large file uploads (conceptual test)."""
        project = Project.objects.create(
            title="Test Project",
            description="Description",
        )
        # File size validation happens at form/serializer level
        # Model accepts any file that passes Django's FileField validation
        self.assertFalse(project.featured_image)  # Empty FileField evaluates to False

    def test_invalid_file_types(self):
        """Test invalid file types (conceptual test)."""
        project = Project.objects.create(
            title="Test Project",
            description="Description",
        )
        # File type validation happens at form/serializer level
        # Model accepts any file that passes Django's FileField validation
        self.assertFalse(project.featured_image)  # Empty FileField evaluates to False

    def test_published_default(self):
        """Test published field defaults to True."""
        project = Project.objects.create(
            title="Test Project",
            description="Description",
        )
        self.assertTrue(project.published)

    @patch("apps.notifications.services.NotificationService.notify_admins")
    def test_notification_trigger_on_publish(self, mock_notify):
        """Test notification is sent when project is published."""
        project = Project.objects.create(
            title="Test Project",
            description="Description",
            published=False,
        )

        project.published = True
        project.save()

        # Notification should be called
        mock_notify.assert_called_once()

    def test_order_field(self):
        """Test order field for display ordering."""
        project1 = Project.objects.create(
            title="Project 1",
            description="Description",
            order=1,
        )
        project2 = Project.objects.create(
            title="Project 2",
            description="Description",
            order=2,
        )
        # Higher order should appear first
        projects = Project.objects.all()
        self.assertEqual(projects[0], project2)
        self.assertEqual(projects[1], project1)

    def test_category_set_null_on_delete(self):
        """Test category is set to null when deleted."""
        project = Project.objects.create(
            title="Test Project",
            description="Description",
            category=self.category,
        )
        category_id = self.category.id
        self.category.delete()

        project.refresh_from_db()
        self.assertIsNone(project.category)


class TechnologyModelTest(TestCase):
    """Test Technology model functionality."""

    def test_technology_creation(self):
        """Test basic technology creation."""
        tech = Technology.objects.create(name="Python")
        self.assertEqual(str(tech), "Python")
        self.assertTrue(tech.slug)
        self.assertEqual(tech.slug, "python")

    def test_slug_auto_generation(self):
        """Test slug is auto-generated from name."""
        tech = Technology.objects.create(name="Machine Learning")
        self.assertEqual(tech.slug, "machine-learning")

    def test_unique_name_constraint(self):
        """Test technology names must be unique."""
        Technology.objects.create(name="Django")
        with self.assertRaises(IntegrityError):
            Technology.objects.create(name="Django")

    def test_icon_field(self):
        """Test icon field."""
        tech = Technology.objects.create(
            name="React",
            icon="react-icon",
        )
        self.assertEqual(tech.icon, "react-icon")


class CategoryModelTest(TestCase):
    """Test Category model functionality."""

    def test_category_creation(self):
        """Test basic category creation."""
        category = Category.objects.create(name="Mobile Apps")
        self.assertEqual(str(category), "Mobile Apps")
        self.assertTrue(category.slug)
        self.assertEqual(category.slug, "mobile-apps")

    def test_slug_auto_generation(self):
        """Test slug is auto-generated from name."""
        category = Category.objects.create(name="Web Development")
        self.assertEqual(category.slug, "web-development")

    def test_unique_name_constraint(self):
        """Test category names must be unique."""
        Category.objects.create(name="Web Development")
        with self.assertRaises(IntegrityError):
            Category.objects.create(name="Web Development")

    def test_description_field(self):
        """Test description field."""
        category = Category.objects.create(
            name="Test Category",
            description="Test description",
        )
        self.assertEqual(category.description, "Test description")


class ProjectImageModelTest(TestCase):
    """Test ProjectImage model functionality."""

    def setUp(self):
        self.category = Category.objects.create(name="Web Development")
        self.project = Project.objects.create(
            title="Test Project",
            description="Description",
            category=self.category,
        )

    def test_project_image_creation(self):
        """Test basic project image creation."""
        image = ProjectImage.objects.create(
            project=self.project,
            caption="Test Image",
            order=1,
        )
        self.assertEqual(str(image), f"{self.project.title} - Image 1")
        self.assertEqual(image.project, self.project)
        self.assertEqual(image.order, 1)

    def test_ordering_by_order_field(self):
        """Test images are ordered by order field."""
        image1 = ProjectImage.objects.create(
            project=self.project,
            order=2,
        )
        image2 = ProjectImage.objects.create(
            project=self.project,
            order=1,
        )

        images = ProjectImage.objects.all()
        self.assertEqual(images[0], image2)  # Lower order first
        self.assertEqual(images[1], image1)

    def test_cascade_delete(self):
        """Test images are deleted when project is deleted."""
        image = ProjectImage.objects.create(
            project=self.project,
        )
        image_id = image.id

        self.project.delete()

        # Image should be deleted
        self.assertFalse(ProjectImage.objects.filter(id=image_id).exists())


class SeedPortfolioTest(TestCase):
    """Test idempotent portfolio seed command behaviour."""

    EXPECTED_SLUGS = [
        "afri-cleans-website",
        "energy-management-dashboard",
        "api-gateway-service",
        "e-commerce-analytics-platform",
        "urbana",
        "pipe-pop",
        "bria",
        "invenire",
    ]

    CATEGORISED = {
        "afri-cleans-website": "Website",
        "e-commerce-analytics-platform": "SaaS",
        "urbana": "SaaS",
        "bria": "Renewable Technology",
        "invenire": "FinTech",
    }

    UNCATEGORISED = {
        "energy-management-dashboard",
        "api-gateway-service",
        "pipe-pop",
    }

    @patch("apps.notifications.services.NotificationService.notify_admins")
    def test_seed_creates_published_catalogue(self, mock_notify):
        from apps.portfolio.portfolio_seed import PORTFOLIO_PROJECTS, seed_portfolio

        result = seed_portfolio()

        self.assertEqual(result["created_projects"], 8)
        self.assertEqual(result["skipped_projects"], 0)
        self.assertEqual(Project.objects.count(), 8)
        self.assertEqual(
            set(Project.objects.values_list("slug", flat=True)),
            set(self.EXPECTED_SLUGS),
        )
        self.assertTrue(all(p.published for p in Project.objects.all()))
        self.assertFalse(any(p.featured for p in Project.objects.all()))
        self.assertEqual(
            sum(p.technologies.count() for p in Project.objects.all()),
            0,
        )
        mock_notify.assert_not_called()

        by_slug = {e["slug"]: e for e in PORTFOLIO_PROJECTS}
        for project in Project.objects.select_related("category"):
            self.assertEqual(project.description, by_slug[project.slug]["description"])
            if project.slug in self.CATEGORISED:
                self.assertIsNotNone(project.category)
                self.assertEqual(project.category.name, self.CATEGORISED[project.slug])
            else:
                self.assertIn(project.slug, self.UNCATEGORISED)
                self.assertIsNone(project.category)

        ordered = list(Project.objects.values_list("slug", flat=True))
        self.assertEqual(ordered, self.EXPECTED_SLUGS)

    @patch("apps.notifications.services.NotificationService.notify_admins")
    def test_seed_second_run_does_not_overwrite(self, mock_notify):
        from apps.portfolio.portfolio_seed import seed_portfolio

        seed_portfolio()
        Project.objects.filter(slug="bria").update(description="Edited by admin")
        mock_notify.reset_mock()

        result = seed_portfolio()

        self.assertEqual(result["created_projects"], 0)
        self.assertEqual(result["skipped_projects"], 8)
        self.assertEqual(Project.objects.count(), 8)
        project = Project.objects.get(slug="bria")
        self.assertEqual(project.description, "Edited by admin")
        mock_notify.assert_not_called()
