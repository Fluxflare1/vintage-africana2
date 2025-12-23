from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.cms.models import SiteSettings, NavigationMenu, NavigationItem, Page


DEFAULT_HOME_BLOCKS = [
    {"type": "heading", "level": 1, "text": "Vintage Africana"},
    {"type": "paragraph", "text": "Welcome! Edit this homepage from the Admin panel."},
    {"type": "cta", "label": "Explore Collections", "url": "/collections"},
]


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_setup_seed(request):
    created = {
        "site_settings": False,
        "main_menu": False,
        "footer_menu": False,
        "homepage": False,
        "nav_items_created": 0,
    }

    # 1) Settings
    settings = SiteSettings.objects.first()
    if not settings:
        settings = SiteSettings.objects.create()
        created["site_settings"] = True

    # 2) Menus
    main_menu = NavigationMenu.objects.filter(title__iexact="Main Menu").first()
    if not main_menu:
        main_menu = NavigationMenu.objects.create(title="Main Menu")
        created["main_menu"] = True

    footer_menu = NavigationMenu.objects.filter(title__iexact="Footer Menu").first()
    if not footer_menu:
        footer_menu = NavigationMenu.objects.create(title="Footer Menu")
        created["footer_menu"] = True

    # 3) Default navigation items (only add if menu is empty)
    def seed_menu_items(menu, items):
        if NavigationItem.objects.filter(menu=menu).exists():
            return 0
        count = 0
        for idx, it in enumerate(items, start=1):
            NavigationItem.objects.create(
                menu=menu,
                label=it["label"],
                url=it["url"],
                order=idx,
            )
            count += 1
        return count

    created["nav_items_created"] += seed_menu_items(
        main_menu,
        [
            {"label": "Home", "url": "/"},
            {"label": "Collections", "url": "/collections"},
            {"label": "Stories", "url": "/stories"},
            {"label": "Experiences", "url": "/experiences"},
        ],
    )

    created["nav_items_created"] += seed_menu_items(
        footer_menu,
        [
            {"label": "About", "url": "/about"},
            {"label": "Contact", "url": "/contact"},
        ],
    )

    # 4) Homepage
    homepage = Page.objects.filter(is_homepage=True).first()
    if not homepage:
        homepage = Page.objects.create(
            title="Home",
            slug="home",
            status="published",
            is_homepage=True,
            content=DEFAULT_HOME_BLOCKS,
        )
        created["homepage"] = True
    else:
        # Ensure it’s actually published + has basic content
        changed = False
        if homepage.status != "published":
            homepage.status = "published"
            changed = True
        if not homepage.content:
            homepage.content = DEFAULT_HOME_BLOCKS
            changed = True
        if changed:
            homepage.save()

    return Response(
        {
            "ok": True,
            "created": created,
            "homepage": {
                "id": homepage.id,
                "title": homepage.title,
                "slug": homepage.slug,
                "status": homepage.status,
                "is_homepage": homepage.is_homepage,
            },
        }
    )
