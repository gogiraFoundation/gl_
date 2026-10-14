"""
Management command to seed the public portfolio catalogue.
"""

from django.core.management.base import BaseCommand

from apps.portfolio.portfolio_seed import seed_portfolio


class Command(BaseCommand):
    help = "Seed portfolio categories and projects (idempotent)"

    def handle(self, *args, **options):
        result = seed_portfolio()
        self.stdout.write(
            self.style.SUCCESS(
                "Portfolio seed complete: "
                f"{result['created_categories']} categor"
                f"{'y' if result['created_categories'] == 1 else 'ies'} created, "
                f"{result['created_projects']} project"
                f"{'' if result['created_projects'] == 1 else 's'} created, "
                f"{result['skipped_projects']} skipped (already present)."
            )
        )
