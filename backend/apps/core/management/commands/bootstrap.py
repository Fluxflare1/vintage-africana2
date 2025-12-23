from django.core.management.base import BaseCommand
from django.core.management import call_command


class Command(BaseCommand):
    help = "Runs migrations + seeds initial CMS content safely."

    def handle(self, *args, **options):
        call_command("migrate", "--noinput")
        call_command("seed_initial_content")
        self.stdout.write(self.style.SUCCESS("✅ Bootstrap done (migrate + seed)."))
