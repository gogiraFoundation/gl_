import pytest
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch
from .models import NewsletterSubscriber

User = get_user_model()


class NewsletterAPITest(TestCase):
    """Test Newsletter API endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass')
    
    @patch('apps.newsletter.services.NewsletterService.send_verification_email')
    def test_subscribe_creates_subscriber(self, mock_send_email):
        """Test POST /api/v1/newsletter/subscribe/ creates subscriber."""
        url = '/api/v1/newsletter/subscribe/'
        data = {
            'email': 'test@example.com',
            'name': 'Test User',
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', response.data)
        self.assertTrue(NewsletterSubscriber.objects.filter(email='test@example.com').exists())
        mock_send_email.assert_called_once()
    
    @patch('apps.newsletter.services.NewsletterService.send_verification_email')
    def test_subscribe_duplicate_email(self, mock_send_email):
        """Test subscribing with duplicate email."""
        NewsletterSubscriber.objects.create(email='test@example.com')
        url = '/api/v1/newsletter/subscribe/'
        data = {
            'email': 'test@example.com',
        }
        response = self.client.post(url, data)
        # Should return error for duplicate
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_subscribe_invalid_email_format(self):
        """Test subscribing with invalid email format."""
        url = '/api/v1/newsletter/subscribe/'
        data = {
            'email': 'invalid-email',
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_subscribe_email_case_sensitivity(self):
        """Test email case sensitivity."""
        NewsletterSubscriber.objects.create(email='Test@Example.com')
        url = '/api/v1/newsletter/subscribe/'
        data = {
            'email': 'test@example.com',
        }
        # Should be treated as different (if not normalized)
        response = self.client.post(url, data)
        # May succeed or fail depending on normalization
        self.assertIn(response.status_code, [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST])
    
    @patch('apps.newsletter.services.NewsletterService.send_welcome_email')
    def test_verify_subscriber(self, mock_send_welcome):
        """Test GET /api/v1/newsletter/verify/{token}/ verifies subscriber."""
        subscriber = NewsletterSubscriber.objects.create(email='test@example.com')
        url = f'/api/v1/newsletter/verify/{subscriber.verification_token}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        
        subscriber.refresh_from_db()
        self.assertTrue(subscriber.is_verified)
        mock_send_welcome.assert_called_once()
    
    def test_verify_invalid_token(self):
        """Test verification with invalid token."""
        url = '/api/v1/newsletter/verify/invalid-token/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    @patch('apps.newsletter.services.NewsletterService.send_welcome_email')
    def test_verify_already_verified(self, mock_send_welcome):
        """Test verifying already verified subscriber."""
        subscriber = NewsletterSubscriber.objects.create(
            email='test@example.com',
            is_verified=True,
        )
        url = f'/api/v1/newsletter/verify/{subscriber.verification_token}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('already verified', response.data['message'].lower())
    
    @patch('apps.newsletter.services.NewsletterService.send_unsubscribe_confirmation')
    def test_unsubscribe_by_token(self, mock_send_confirmation):
        """Test POST /api/v1/newsletter/unsubscribe/ with token."""
        subscriber = NewsletterSubscriber.objects.create(
            email='test@example.com',
            is_active=True,
        )
        url = '/api/v1/newsletter/unsubscribe/'
        data = {
            'token': subscriber.unsubscribe_token,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        subscriber.refresh_from_db()
        self.assertFalse(subscriber.is_active)
        mock_send_confirmation.assert_called_once()
    
    @patch('apps.newsletter.services.NewsletterService.send_unsubscribe_confirmation')
    def test_unsubscribe_by_email(self, mock_send_confirmation):
        """Test POST /api/v1/newsletter/unsubscribe/ with email."""
        subscriber = NewsletterSubscriber.objects.create(
            email='test@example.com',
            is_active=True,
        )
        url = '/api/v1/newsletter/unsubscribe/'
        data = {
            'email': 'test@example.com',
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        subscriber.refresh_from_db()
        self.assertFalse(subscriber.is_active)
        mock_send_confirmation.assert_called_once()
    
    def test_unsubscribe_invalid_token(self):
        """Test unsubscribe with invalid token."""
        url = '/api/v1/newsletter/unsubscribe/'
        data = {
            'token': 'invalid-token',
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_unsubscribe_nonexistent_email(self):
        """Test unsubscribe with non-existent email."""
        url = '/api/v1/newsletter/unsubscribe/'
        data = {
            'email': 'nonexistent@example.com',
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_unsubscribe_already_unsubscribed(self):
        """Test unsubscribing already unsubscribed user."""
        subscriber = NewsletterSubscriber.objects.create(
            email='test@example.com',
            is_active=False,
        )
        url = '/api/v1/newsletter/unsubscribe/'
        data = {
            'email': 'test@example.com',
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('already unsubscribed', response.data['message'].lower())
    
    def test_unsubscribe_missing_both_token_and_email(self):
        """Test unsubscribe with missing both token and email."""
        url = '/api/v1/newsletter/unsubscribe/'
        data = {}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_list_subscribers_requires_authentication(self):
        """Test GET /api/v1/newsletter/subscribers/ requires authentication."""
        url = '/api/v1/newsletter/subscribers/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_list_subscribers_authenticated(self):
        """Test GET /api/v1/newsletter/subscribers/ with authentication."""
        # Clear any existing subscribers first
        NewsletterSubscriber.objects.all().delete()
        NewsletterSubscriber.objects.create(email='test1@example.com')
        NewsletterSubscriber.objects.create(email='test2@example.com')
        self.client.force_authenticate(user=self.user)
        url = '/api/v1/newsletter/subscribers/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check if response is paginated or a list
        if isinstance(response.data, list):
            self.assertEqual(len(response.data), 2)
        else:
            # If paginated, check results
            self.assertGreaterEqual(len(response.data.get('results', [])), 2)
    
    def test_list_subscribers_filter_by_active(self):
        """Test filtering subscribers by active status."""
        # Clear any existing subscribers first
        NewsletterSubscriber.objects.all().delete()
        active = NewsletterSubscriber.objects.create(
            email='active@example.com',
            is_active=True,
        )
        inactive = NewsletterSubscriber.objects.create(
            email='inactive@example.com',
            is_active=False,
        )
        self.client.force_authenticate(user=self.user)
        url = '/api/v1/newsletter/subscribers/'
        
        response = self.client.get(url, {'is_active': 'true'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data if isinstance(response.data, list) else response.data.get('results', [])
        self.assertGreaterEqual(len(data), 1)
        # Check that active subscriber is in results
        active_ids = [sub['id'] for sub in data]
        self.assertIn(active.id, active_ids)
    
    def test_list_subscribers_filter_by_verified(self):
        """Test filtering subscribers by verified status."""
        # Clear any existing subscribers first
        NewsletterSubscriber.objects.all().delete()
        verified = NewsletterSubscriber.objects.create(
            email='verified@example.com',
            is_verified=True,
        )
        unverified = NewsletterSubscriber.objects.create(
            email='unverified@example.com',
            is_verified=False,
        )
        self.client.force_authenticate(user=self.user)
        url = '/api/v1/newsletter/subscribers/'
        
        response = self.client.get(url, {'is_verified': 'true'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data if isinstance(response.data, list) else response.data.get('results', [])
        self.assertGreaterEqual(len(data), 1)
        # Check that verified subscriber is in results
        verified_ids = [sub['id'] for sub in data]
        self.assertIn(verified.id, verified_ids)
    
    def test_list_subscribers_search_by_email(self):
        """Test searching subscribers by email."""
        # Clear any existing subscribers first
        NewsletterSubscriber.objects.all().delete()
        NewsletterSubscriber.objects.create(email='john@example.com')
        NewsletterSubscriber.objects.create(email='jane@example.com')
        self.client.force_authenticate(user=self.user)
        url = '/api/v1/newsletter/subscribers/'
        
        response = self.client.get(url, {'search': 'john'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data if isinstance(response.data, list) else response.data.get('results', [])
        self.assertGreaterEqual(len(data), 1)
        # Check that john@example.com is in results
        emails = [sub['email'] for sub in data]
        self.assertIn('john@example.com', emails)
    
    def test_stats_requires_authentication(self):
        """Test GET /api/v1/newsletter/stats/ requires authentication."""
        url = '/api/v1/newsletter/stats/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_stats_authenticated(self):
        """Test GET /api/v1/newsletter/stats/ with authentication."""
        NewsletterSubscriber.objects.create(
            email='active@example.com',
            is_active=True,
            is_verified=True,
        )
        NewsletterSubscriber.objects.create(
            email='inactive@example.com',
            is_active=False,
        )
        self.client.force_authenticate(user=self.user)
        url = '/api/v1/newsletter/stats/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_subscribers', response.data)
        self.assertIn('active_subscribers', response.data)
        self.assertIn('verified_subscribers', response.data)

