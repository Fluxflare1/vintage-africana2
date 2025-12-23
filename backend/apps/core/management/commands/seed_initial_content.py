from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from apps.cms.models import Page, SiteSettings, NavigationMenu, NavigationItem


DEFAULT_HOMEPAGE_CONTENT = [
    {
        "type": "heading",
        "level": 1,
        "text": "Welcome to Vintage Africana",
    },
    {
        "type": "paragraph",
        "text": "Edit this homepage from the custom admin panel.",
    },
    {
        "type": "cta",
        "label": "Explore Collections",
        "url": "/collections",
    },
]


class Command(BaseCommand):
    help = "Seeds initial CMS data: SiteSettings, Header/Footer menus, and a published Homepage."

    @transaction.atomic
    def handle(self, *args, **options):
        # 1) Site Settings (single row)
        settings, created = SiteSettings.objects.get_or_create(
            defaults={
                "site_name": "Vintage Africana",
                "tagline": "Timeless African heritage",
            }
        )

        # 2) Navigation Menus
        header_menu, _ = NavigationMenu.objects.get_or_create(
            code="header",
            defaults={"title": "Header Menu"},
        )
        footer_menu, _ = NavigationMenu.objects.get_or_create(
            code="footer",
            defaults={"title": "Footer Menu"},
        )

        # 3) Default Header Items (only if empty)
        if not header_menu.items.exists():
            NavigationItem.objects.create(menu=header_menu, label="Home", url="/", order=1)
            NavigationItem.objects.create(menu=header_menu, label="Collections", url="/collections", order=2)
            NavigationItem.objects.create(menu=header_menu, label="Stories", url="/stories", order=3)
            NavigationItem.objects.create(menu=header_menu, label="Experiences", url="/experiences", order=4)

        # 4) Default Footer Items (only if empty)
        if not footer_menu.items.exists():
            NavigationItem.objects.create(menu=footer_menu, label="About", url="/about", order=1)
            NavigationItem.objects.create(menu=footer_menu, label="Contact", url="/contact", order=2)

        # 5) Homepage Page (published + is_homepage=True)
        homepage = Page.objects.filter(is_homepage=True).first()
        if not homepage:
            homepage = Page.objects.create(
                title="Home",
                slug="home",
                excerpt="A curated home for African vintage stories and collections.",
                status="published",
                is_homepage=True,
                hero_enabled=True,
                hero_cta_label="View Collections",
                hero_cta_url="/collections",
                content=DEFAULT_HOMEPAGE_CONTENT,
            )
        else:
            # If it exists but has empty content, fill it.
            if not homepage.content:
                homepage.content = DEFAULT_HOMEPAGE_CONTENT
                homepage.save(update_fields=["content"])

        self.stdout.write(self.style.SUCCESS("✅ Seed completed: settings, menus, homepage created/verified."))
