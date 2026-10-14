"""
Idempotent catalogue for the public portfolio walking skeleton.

Blurbs match gogir-labs-fe/lib/portfolioCopy.ts. Energy Management Dashboard,
API Gateway Service, and Pipe Pop have no category until those labels are
resolved (the frontend formerly labelled all three Blockchain).
"""

from django.db import transaction

from .models import Category, Project

# Order values descend so Meta ordering ("-order", "-created_at") matches this list.
PORTFOLIO_PROJECTS = [
    {
        "slug": "afri-cleans-website",
        "title": "Afri Cleans Website",
        "category_name": "Website",
        "order": 8,
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
        "description": (
            "A dashboard designed to monitor and manage energy consumption within "
            "commercial buildings, including features for ISO 50001 compliance. The "
            "platform enables real-time energy analytics and reporting, aiding "
            "businesses in achieving sustainable energy management."
        ),
    },
    {
        "slug": "api-gateway-service",
        "title": "API Gateway Service",
        "category_name": None,
        "order": 6,
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
        "description": (
            "A comprehensive analytics platform tailored for e-commerce businesses, "
            "providing real-time dashboards, sales analytics, and predictive insights "
            "to inform business strategy and drive growth."
        ),
    },
    {
        "slug": "urbana",
        "title": "Urbana",
        "category_name": "SaaS",
        "order": 4,
        "description": (
            "A business management platform for streamlining operations, providing "
            "tools for project management, collaboration, and reporting. Tailored to "
            "meet the needs of growing organisations."
        ),
    },
    {
        "slug": "pipe-pop",
        "title": "Pipe Pop",
        "category_name": None,
        "order": 3,
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

    Publish with QuerySet.update so Project.save does not email admins
    when published flips to True.
    """
    created_categories = 0
    created_projects = 0
    skipped_projects = 0
    category_cache: dict[str, Category] = {}
    newly_created_ids: list[int] = []

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

            project, created = Project.objects.get_or_create(
                slug=entry["slug"],
                defaults={
                    "title": entry["title"],
                    "description": entry["description"],
                    "category": category,
                    "featured": False,
                    "published": False,
                    "order": entry["order"],
                },
            )
            if created:
                created_projects += 1
                newly_created_ids.append(project.pk)
            else:
                skipped_projects += 1

        # Only newly created rows: QuerySet.update skips save() and
        # notify_admins when published flips to True.
        if newly_created_ids:
            Project.objects.filter(pk__in=newly_created_ids).update(published=True)

    return {
        "created_categories": created_categories,
        "created_projects": created_projects,
        "skipped_projects": skipped_projects,
    }
