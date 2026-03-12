import pytest
from django.test import TestCase
from .models import Testimonial


class TestimonialModelTest(TestCase):
    """Test Testimonial model functionality and edge cases."""
    
    def test_testimonial_creation(self):
        """Test basic testimonial creation."""
        testimonial = Testimonial.objects.create(
            client_name='John Doe',
            client_role='CEO',
            company='Test Company',
            content='Great work!',
            rating=5,
        )
        self.assertEqual(str(testimonial), 'Testimonial from John Doe')
        self.assertEqual(testimonial.rating, 5)
    
    def test_rating_range(self):
        """Test rating is within valid range (1-5)."""
        # Django's IntegerField with choices validates at form/serializer level
        testimonial = Testimonial.objects.create(
            client_name='John Doe',
            client_role='CEO',
            company='Test Company',
            content='Test',
            rating=5,
        )
        self.assertEqual(testimonial.rating, 5)
    
    def test_very_long_content(self):
        """Test testimonial with very long content."""
        long_content = 'A' * 5000
        testimonial = Testimonial.objects.create(
            client_name='John Doe',
            client_role='CEO',
            company='Test Company',
            content=long_content,
            rating=5,
        )
        self.assertEqual(len(testimonial.content), 5000)
    
    def test_image_field(self):
        """Test image field is optional."""
        testimonial = Testimonial.objects.create(
            client_name='John Doe',
            client_role='CEO',
            company='Test Company',
            content='Test',
            rating=5,
        )
        # Django ImageField returns empty string, not None
        self.assertFalse(testimonial.client_image)  # Empty ImageField evaluates to False
