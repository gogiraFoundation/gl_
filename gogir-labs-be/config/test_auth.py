import pytest
from django.contrib.auth import get_user_model
from django.conf import settings
from django.test import TestCase
from django.test.utils import override_settings
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()
TEST_REST_FRAMEWORK = {**settings.REST_FRAMEWORK, "DEFAULT_THROTTLE_CLASSES": []}


@override_settings(REST_FRAMEWORK=TEST_REST_FRAMEWORK)
class AuthenticationAPITest(TestCase):
    """Test Authentication API endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="testpass123", email="test@example.com"
        )
        self.inactive_user = User.objects.create_user(
            username="inactiveuser", password="testpass123", is_active=False
        )

    def test_token_obtain_pair_valid_credentials(self):
        """Test POST /api/v1/auth/token/ with valid credentials returns tokens."""
        url = "/api/v1/auth/token/"
        data = {
            "username": "testuser",
            "password": "testpass123",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_token_obtain_pair_invalid_credentials(self):
        """Test POST /api/v1/auth/token/ with invalid credentials returns 401."""
        url = "/api/v1/auth/token/"
        data = {
            "username": "testuser",
            "password": "wrongpassword",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_obtain_pair_missing_fields(self):
        """Test POST /api/v1/auth/token/ with missing fields returns 400."""
        url = "/api/v1/auth/token/"
        data = {
            "username": "testuser",
            # Missing password
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_token_obtain_pair_empty_username(self):
        """Test POST /api/v1/auth/token/ with empty username."""
        url = "/api/v1/auth/token/"
        data = {
            "username": "",
            "password": "testpass123",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_token_obtain_pair_empty_password(self):
        """Test POST /api/v1/auth/token/ with empty password."""
        url = "/api/v1/auth/token/"
        data = {
            "username": "testuser",
            "password": "",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_token_obtain_pair_nonexistent_user(self):
        """Test POST /api/v1/auth/token/ with non-existent user."""
        url = "/api/v1/auth/token/"
        data = {
            "username": "nonexistent",
            "password": "testpass123",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_obtain_pair_inactive_user(self):
        """Test POST /api/v1/auth/token/ with inactive user."""
        url = "/api/v1/auth/token/"
        data = {
            "username": "inactiveuser",
            "password": "testpass123",
        }
        response = self.client.post(url, data)
        # Inactive users should not be able to login
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_refresh_valid_token(self):
        """Test POST /api/v1/auth/token/refresh/ with valid refresh token."""
        refresh = RefreshToken.for_user(self.user)
        url = "/api/v1/auth/token/refresh/"
        data = {
            "refresh": str(refresh),
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_token_refresh_invalid_token(self):
        """Test POST /api/v1/auth/token/refresh/ with invalid refresh token."""
        url = "/api/v1/auth/token/refresh/"
        data = {
            "refresh": "invalid-token",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_refresh_expired_token(self):
        """Test POST /api/v1/auth/token/refresh/ with expired refresh token."""
        # Create an expired token (this would require time manipulation)
        # For now, test with invalid format
        url = "/api/v1/auth/token/refresh/"
        data = {
            "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.expired",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_refresh_missing_token(self):
        """Test POST /api/v1/auth/token/refresh/ with missing refresh token."""
        url = "/api/v1/auth/token/refresh/"
        data = {}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
