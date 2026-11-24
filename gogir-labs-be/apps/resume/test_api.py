from datetime import date

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.site.models import SiteProfile

from .models import Education, Experience, Skill

User = get_user_model()


class ResumeAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_aggregate_empty(self):
        response = self.client.get("/api/v1/resume/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["experience"], [])
        self.assertEqual(response.data["education"], [])
        self.assertEqual(response.data["certifications"], [])
        self.assertEqual(response.data["skills"], [])

    def test_aggregate_shape_and_ordering(self):
        Experience.objects.create(
            title="Older",
            company="A",
            start_date=date(2020, 1, 1),
            description="d",
            order=1,
        )
        Experience.objects.create(
            title="Newer",
            company="B",
            start_date=date(2024, 1, 1),
            description="d",
            order=10,
            highlights=["One"],
        )
        Education.objects.create(
            degree="MSc",
            institution="Uni",
            start_date=date(2023, 1, 1),
            highlights=["Dissertation"],
        )
        Skill.objects.create(name="Python", category="programming", order=0)

        response = self.client.get("/api/v1/resume/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["experience"][0]["title"], "Newer")
        self.assertEqual(response.data["experience"][0]["highlights"], ["One"])
        self.assertEqual(len(response.data["education"]), 1)
        self.assertEqual(len(response.data["skills"]), 1)

    def test_pdf_download_uses_site_profile(self):
        SiteProfile.load()
        SiteProfile.objects.filter(pk=1).update(full_name="Test Person")
        Experience.objects.create(
            title="Engineer",
            company="Co",
            start_date=date(2024, 1, 1),
            description="Did things",
            is_current=True,
        )
        response = self.client.get("/api/v1/resume/download/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response["Content-Type"], "application/pdf")
        self.assertIn("Test_Person_Resume.pdf", response["Content-Disposition"])
