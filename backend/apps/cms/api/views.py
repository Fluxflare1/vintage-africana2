from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from apps.cms.models import SiteSettings, Page, NavigationMenu, NavigationItem
from apps.core.permissions import IsAdmin
from .serializers import PageSerializer, SiteSettingsSerializer, AdminSiteSettingsWriteSerializer


@api_view(["GET", "POST"])
@permission_classes([IsAdmin])
def admin_pages_v2(request):
    """
    GET  /api/admin/pages/        -> list all pages
    POST /api/admin/pages/        -> create a page
    """
    if request.method == "GET":
        qs = Page.objects.all().order_by("-updated_at", "-id") if hasattr(Page, "updated_at") else Page.objects.all().order_by("-id")
        return Response(PageSerializer(qs, many=True, context={"request": request}).data)

    # POST
    serializer = PageSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    obj = serializer.save()
    return Response(PageSerializer(obj, context={"request": request}).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAdmin])
def admin_page_detail_v2(request, id: int):
    """
    GET    /api/admin/pages/:id/
    PUT    /api/admin/pages/:id/
    DELETE /api/admin/pages/:id/
    """
    obj = Page.objects.filter(id=id).first()
    if not obj:
        return Response({"detail": "Page not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return Response(PageSerializer(obj, context={"request": request}).data)

    if request.method == "PUT":
        serializer = PageSerializer(obj, data=request.data, partial=True, context={"request": request})
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        return Response(PageSerializer(obj, context={"request": request}).data)

    # DELETE
    obj.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "PUT", "PATCH"])
@permission_classes([IsAdmin])
def admin_site_settings(request):
    """
    GET /api/admin/settings/
    PUT /api/admin/settings/
    PATCH /api/admin/settings/
    """
    obj = SiteSettings.objects.order_by("id").first()
    if not obj:
        obj = SiteSettings.objects.create()

    if request.method == "GET":
        return Response(SiteSettingsSerializer(obj, context={"request": request}).data)

    serializer = AdminSiteSettingsWriteSerializer(obj, data=request.data, partial=True, context={"request": request})
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    serializer.save()
    # Return full read serializer (includes nested media objects)
    return Response(SiteSettingsSerializer(obj, context={"request": request}).data)


@api_view(["POST"])
@permission_classes([IsAdmin])
def admin_setup_seed(request):
    created = {}

    # 1) SiteSettings (singleton)
    settings = SiteSettings.objects.order_by("id").first()
    if not settings:
        settings = SiteSettings.objects.create(
            site_name="Vintage Africana",
            tagline="Vintage culture, curated stories.",
        )
        created["site_settings"] = True
    else:
        created["site_settings"] = False

    # 2) Navigation menus
    header, header_created = NavigationMenu.objects.get_or_create(
        code="header", defaults={"title": "Header Menu"}
    )
    footer, footer_created = NavigationMenu.objects.get_or_create(
        code="footer", defaults={"title": "Footer Menu"}
    )
    created["nav_header_menu"] = header_created
    created["nav_footer_menu"] = footer_created

    # 3) Default navigation items (only if menu has none)
    if not header.items.exists():
        NavigationItem.objects.create(menu=header, label="Home", url="/", order=1, is_visible=True)
        NavigationItem.objects.create(menu=header, label="Collections", url="/collections", order=2, is_visible=True)
        NavigationItem.objects.create(menu=header, label="Stories", url="/stories", order=3, is_visible=True)
        NavigationItem.objects.create(menu=header, label="Experiences", url="/experiences", order=4, is_visible=True)
        created["nav_header_items"] = True
    else:
        created["nav_header_items"] = False

    if not footer.items.exists():
        NavigationItem.objects.create(menu=footer, label="About", url="/about", order=1, is_visible=True)
        NavigationItem.objects.create(menu=footer, label="Contact", url="/contact", order=2, is_visible=True)
        created["nav_footer_items"] = True
    else:
        created["nav_footer_items"] = False

    # 4) Homepage Page
    homepage = Page.objects.filter(is_homepage=True).first()
    if not homepage:
        homepage = Page.objects.create(
            title="Home",
            slug="home",
            is_homepage=True,
            status=Page.STATUS_PUBLISHED,  # publish immediately so public site works
            published_at=timezone.now(),
            content=[
                {"type": "heading", "level": 1, "text": "Welcome to Vintage Africana"},
                {"type": "paragraph", "text": "Edit this homepage from your Admin panel."},
                {"type": "cta", "label": "Explore Collections", "url": "/collections"},
            ],
        )
        created["homepage_created"] = True
    else:
        created["homepage_created"] = False

        # If homepage exists but isn't published, optionally publish it (safe default)
        if homepage.status != Page.STATUS_PUBLISHED:
            homepage.status = Page.STATUS_PUBLISHED
            homepage.published_at = timezone.now()
            homepage.save(update_fields=["status", "published_at"])
            created["homepage_published_now"] = True
        else:
            created["homepage_published_now"] = False

    return Response(
        {
            "detail": "Setup completed.",
            "created": created,
        },
        status=status.HTTP_200_OK,
    )
