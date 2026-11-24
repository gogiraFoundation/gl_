from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient


class SearchAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_invalid_limit_returns_400(self):
        response = self.client.get("/api/v1/search/", {"q": "django", "limit": "nope"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_blank_query_returns_empty_results(self):
        response = self.client.get("/api/v1/search/", {"q": "   "})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total"], 0)
