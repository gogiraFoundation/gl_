from datetime import date

from django.core.management.base import BaseCommand

from apps.resume.models import Education, Experience, Skill

EXPERIENCE = [
    {
        "title": "Lead Software Engineer",
        "company": "Traq Authenticator",
        "location": "Remote",
        "start_date": date(2024, 1, 1),
        "end_date": None,
        "is_current": True,
        "description": "",
        "highlights": [
            "Spearheaded the architecture, delivery, and operation of a production authentication platform, ensuring high availability and security.",
            "Designed and implemented a modular IAM (Identity and Access Management) system, streamlining authentication workflows across multiple services.",
            "Built scalable Django backend services, optimised for cloud environments using Docker and Kubernetes for containerisation.",
            "Introduced automated CI/CD pipelines, reducing deployment friction and improving continuous delivery pipelines.",
            "Enhanced platform resilience through Redis-based rate limiting, integrated breach detection, and malware scanning APIs, implementing security-first infrastructure practices.",
            "Led technical roadmap decisions and aligned engineering efforts with business stakeholder goals.",
        ],
        "technologies": "Django, Python, Redis, Docker, Kubernetes, CI/CD, GitHub Actions, AWS, Authentication Systems",
        "order": 50,
    },
    {
        "title": "Data Engineer / Energy Analyst",
        "company": "Manufacturing Sector",
        "location": "UK",
        "start_date": date(2021, 1, 1),
        "end_date": date(2022, 12, 31),
        "is_current": False,
        "description": "Enhanced operational decision-making capabilities, enabling more efficient use of energy resources.",
        "highlights": [
            "Developed Python and SQL-based data pipelines to process operational telemetry and performance metrics for improved data analysis.",
            "Designed automated ETL workflows, enabling near real-time monitoring and data visualisation.",
            "Contributed to ISO 50001 energy optimisation through advanced analytics and system modelling.",
            "Reduced manual reporting overhead by automating data workflows, fostering a data-driven decision-making culture.",
        ],
        "technologies": "Python, SQL, ETL Pipelines, Data Modelling, Power BI, Analytics Engineering",
        "order": 40,
    },
    {
        "title": "Technical Operations Lead",
        "company": "Remote Digital Startup",
        "location": "Remote",
        "start_date": date(2021, 1, 1),
        "end_date": date(2023, 12, 31),
        "is_current": False,
        "description": "",
        "highlights": [
            "Owned internal tooling and workflow architecture, driving collaboration between product and engineering teams.",
            "Improved system adoption by 60% through the automation of processes and a redesign focused on usability.",
            "Acted as a liaison between engineering, product management, and business stakeholders, ensuring alignment with business goals.",
            "Standardised technical documentation, improving onboarding speed and delivery velocity.",
        ],
        "technologies": "Python, Automation, Technical Documentation, Workflow Architecture",
        "order": 30,
    },
    {
        "title": "Blockchain Data Research Analyst",
        "company": "Digital Finance Sector",
        "location": "Remote",
        "start_date": date(2021, 1, 1),
        "end_date": date(2023, 12, 31),
        "is_current": False,
        "description": "",
        "highlights": [
            "Automated blockchain data analysis using Python scripts, processing over 1,000 datasets for actionable insights.",
            "Reduced analysis turnaround time by 50% through improved data processing workflows.",
            "Delivered insights on blockchain ecosystem growth, supporting product strategy and investment decisions.",
            "Collaborated within Agile sprint cycles alongside engineering and marketing teams.",
        ],
        "technologies": "Python, Data Analysis, Blockchain Infrastructure, Agile Methodologies",
        "order": 20,
    },
    {
        "title": "Volunteer IT & Data Officer",
        "company": "Breast Cancer Foundation",
        "location": "UK",
        "start_date": date(2020, 1, 1),
        "end_date": date(2020, 12, 31),
        "is_current": False,
        "description": "",
        "highlights": [
            "Developed automated reporting systems and dashboards, providing real-time visibility into programme performance.",
            "Digitised organisational data workflows, reducing administrative overhead and improving reporting accuracy.",
        ],
        "technologies": "Python, Data Automation, Reporting Systems, Dashboards",
        "order": 10,
    },
]

EDUCATION = [
    {
        "degree": "MSc Renewable Energy & Sustainable Technology",
        "institution": "University of South Wales",
        "location": "",
        "field_of_study": "",
        "start_date": date(2023, 9, 1),
        "end_date": date(2024, 9, 1),
        "is_current": False,
        "description": "",
        "highlights": [
            "Dissertation: Developed a Python-based model for predicting policy-driven renewable energy adoption, incorporating systems analysis and data modelling.",
            "Key modules: Data & Decision Analysis, Systems Modelling, Research Methods",
        ],
        "order": 10,
    },
]

SKILL_GROUPS = [
    ("cloud", ["AWS", "Azure", "GCP", "Kubernetes", "Docker", "Terraform", "Helm"]),
    (
        "database",
        [
            "Redis",
            "ETL Pipelines",
            "Data Modelling",
            "SQL Server",
            "Analytics Engineering",
        ],
    ),
    (
        "framework",
        ["Django", "REST APIs", "Async Processing", "Authentication Systems"],
    ),
    ("programming", ["Python", "SQL"]),
    (
        "soft",
        [
            "Communication",
            "Collaboration",
            "Stakeholder engagement",
            "Cross-functional teamwork",
            "Technical writing & documentation",
        ],
    ),
]


class Command(BaseCommand):
    help = "Seed resume tables from the former static frontend copy when empty."

    def handle(self, *args, **options):
        if not Experience.objects.exists():
            for row in EXPERIENCE:
                Experience.objects.create(**row)
            self.stdout.write(
                self.style.SUCCESS(f"Created {len(EXPERIENCE)} experiences")
            )
        else:
            self.stdout.write("Experience already populated; skipped")

        if not Education.objects.exists():
            for row in EDUCATION:
                Education.objects.create(**row)
            self.stdout.write(
                self.style.SUCCESS(f"Created {len(EDUCATION)} education rows")
            )
        else:
            self.stdout.write("Education already populated; skipped")

        if not Skill.objects.exists():
            count = 0
            for category, names in SKILL_GROUPS:
                for order, name in enumerate(names):
                    Skill.objects.create(name=name, category=category, order=order)
                    count += 1
            self.stdout.write(self.style.SUCCESS(f"Created {count} skills"))
        else:
            self.stdout.write("Skills already populated; skipped")
