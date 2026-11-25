"""
Idempotent catalogue for the public portfolio walking skeleton.

Blurbs match gogir-labs-fe/lib/portfolioCopy.ts. Energy Management Dashboard,
API Gateway Service, and Pipe Pop have no category until those labels are
resolved (the frontend formerly labelled all three Blockchain).

Case-study centre (publish deliberately in admin):
- traq-authenticator (IAM) — seeded unpublished until review
- energy-management-dashboard (ISO 50001)
- blockchain / data work — prefer an essay-backed card; keep weak catalogue unpublished
"""

from django.db import transaction

from .models import Category, Project

# Never appear on public list/detail/sitemap while on hold (even if published).
PORTFOLIO_PUBLIC_HOLD_SLUGS: frozenset[str] = frozenset({"bria"})

# Seed never auto-publishes: public grid is Traq + energy only (ops/admin publish).
# Order values descend so Meta ordering ("-order", "-created_at") matches this list.
PORTFOLIO_PROJECTS = [
    {
        "slug": "traq-authenticator",
        "title": "Traq Authenticator",
        "category_name": "IAM",
        "order": 9,
        "auto_publish": False,
        "role": "Lead backend developer",
        "description": (
            "Constraint: pass a formal security review. Built Django/PostgreSQL "
            "identity services with breach detection, rate limiting, and file "
            "validation—secure enough for auditors without sacrificing developer "
            "ergonomics."
        ),
        "long_description": (
            "<p>Traq Authenticator is an identity and access management product. "
            "As lead backend developer I own the Django and PostgreSQL services that "
            "sit behind verification flows.</p>"
            "<p>Constraints included security review, abuse resistance under load, "
            "and safe handling of uploaded credentials material.</p>"
            '<p>Related writing: <a href="/blog/traqhq">Traq essay</a> when published.</p>'
        ),
        "outcomes": [
            "Breach detection on password flows",
            "Redis-backed rate limiting on verification APIs",
            "File validation for upload paths",
            "CI/CD for test and deploy of the Django services",
        ],
    },
    {
        "slug": "afri-cleans-website",
        "title": "Afri Cleans Website",
        "category_name": "Website",
        "order": 8,
        "auto_publish": False,
        "description": (
            "A full-stack website developed for Afri Ltd, offering an efficient "
            "cleaning service platform for businesses and consumers. The platform "
            "integrates booking, service management, and user engagement features."
        ),
    },
    {
        "slug": "energy-management-dashboard",
        "title": "Energy Management Dashboard",
        "category_name": None,
        "order": 7,
        "auto_publish": False,
        "description": (
            "Constraint: make ISO 50001 reporting auditable. Replaced spreadsheet "
            "exports with live meter ingestion, analytics, and a full ETL pipeline "
            "so every reported figure is traceable to its source reading."
        ),
    },
    {
        "slug": "api-gateway-service",
        "title": "API Gateway Service",
        "category_name": None,
        "order": 6,
        "auto_publish": False,
        "description": (
            "A high-performance API Gateway built with Django, optimised for managing "
            "microservices and API routing. This solution allows seamless integration "
            "across various services, ensuring robust API security and performance."
        ),
    },
    {
        "slug": "e-commerce-analytics-platform",
        "title": "E-commerce Analytics Platform",
        "category_name": "SaaS",
        "order": 5,
        "auto_publish": False,
        "description": (
            "A comprehensive analytics platform tailored for e-commerce businesses, "
            "providing real-time dashboards, sales analytics, and predictive insights "
            "to inform business strategy and drive growth."
        ),
    },
    {
        "slug": "urbana",
        "title": "UrbanSpick",
        "category_name": "SaaS",
        "order": 4,
        "auto_publish": False,
        "description": (
            "Compliance platform for UK housing providers: verified field evidence, "
            "tamper-evident records, and statutory deadline tracking for damp, mould, "
            "and safety certificates. In development; not live."
        ),
    },
    {
        "slug": "pipe-pop",
        "title": "Pipe Pop",
        "category_name": None,
        "order": 3,
        "auto_publish": False,
        "description": (
            "A suite of tools designed for monitoring and managing Point of Presence "
            "(PoP) nodes in pipe networks. The platform provides real-time insights "
            "and health monitoring for network infrastructure."
        ),
    },
    {
        "slug": "bria",
        "title": "Bria",
        "category_name": "Renewable Technology",
        "order": 2,
        "auto_publish": False,
        "description": (
            "Bria is an enterprise-grade renewable power forecasting platform that "
            "combines meteorological data, physical modelling, and machine learning "
            "to deliver accurate generation forecasts for solar and wind farms. This "
            "case study outlines the design, development, and deployment of the "
            "platform, which is integral to renewable energy projects."
        ),
    },
    {
        "slug": "invenire",
        "title": "Invenire",
        "category_name": "FinTech",
        "order": 1,
        "auto_publish": False,
        "description": (
            "Invenire is an advanced machine learning-driven software designed for "
            "web scraping and data mining. It efficiently extracts valuable insights, "
            "trends, and data points from a wide range of online sources using "
            "natural language processing (NLP) algorithms, enabling businesses to "
            "gather key information for strategic decision-making."
        ),
    },
]


def seed_portfolio() -> dict:
    """
    Create missing portfolio categories and projects. Returns counts.

    Rows with auto_publish True are published via QuerySet.update so
    Project.save does not email admins. Default is False: seed never expands
    the public grid; publish Traq + energy in admin/ops only.
    """
    created_categories = 0
    created_projects = 0
    skipped_projects = 0
    category_cache: dict[str, Category] = {}
    publish_ids: list[int] = []

    with transaction.atomic():
        for entry in PORTFOLIO_PROJECTS:
            category = None
            category_name = entry["category_name"]
            if category_name:
                if category_name not in category_cache:
                    category, cat_created = Category.objects.get_or_create(
                        name=category_name
                    )
                    category_cache[category_name] = category
                    if cat_created:
                        created_categories += 1
                category = category_cache[category_name]

            defaults = {
                "title": entry["title"],
                "description": entry["description"],
                "category": category,
                "featured": False,
                "published": False,
                "order": entry["order"],
            }
            if entry.get("long_description"):
                defaults["long_description"] = entry["long_description"]
            if entry.get("role"):
                defaults["role"] = entry["role"]
            if entry.get("outcomes") is not None:
                defaults["outcomes"] = entry["outcomes"]

            project, created = Project.objects.get_or_create(
                slug=entry["slug"],
                defaults=defaults,
            )
            if created:
                created_projects += 1
                if entry.get("auto_publish", False):
                    publish_ids.append(project.pk)
            else:
                skipped_projects += 1

        # QuerySet.update skips save() and notify_admins when published flips.
        if publish_ids:
            Project.objects.filter(pk__in=publish_ids).update(published=True)

    return {
        "created_categories": created_categories,
        "created_projects": created_projects,
        "skipped_projects": skipped_projects,
    }
