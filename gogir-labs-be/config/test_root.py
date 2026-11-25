from django.test import TestCase


class ServiceRootTests(TestCase):
    def test_root_returns_service_json(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "application/json")
        self.assertEqual(
            response.json(),
            {
                "name": "Gogir Labs API",
                "status": "ok",
                "api": "/api/v1/",
            },
        )

    def test_api_v1_root_stays_healthy(self):
        response = self.client.get("/api/v1/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")
