from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from apps.cms.models import SiteSettings, Page, NavigationMenu, NavigationItem
from apps.core.permissions import IsAdmin
from .serializers import PageSerializer, SiteSettingsSerializer, AdminSiteSettingsWriteSerializer


# -------------------------
# PUBLIC ENDPOINTS
# -------------------------

@api_view(["GET"])
def site_settings(request):
    obj = SiteSettings.objects.order_by("id").first()
    if not obj:
        return Response({"detail": "SiteSettings not configured."}, status=status.HTTP_404_NOT_FOUND)
    return Response(SiteSettingsSerializer(obj, context={"request": request}).data)


@api_view(["GET"])
def navigation_menu(request, code: str):
    obj = NavigationMenu.objects.filter(code=code).first()
    if not obj:
        return Response({"detail": "Navigation menu not found."}, status=status.HTTP_404_NOT_FOUND)

    # Use serializer that returns nested items (your existing serializer supports this)
    from .serializers import NavigationMenuSerializer  # local import to avoid circular imports
    return Response(NavigationMenuSerializer(obj).data)


@api_view(["GET"])
def page_by_slug(request, slug: str):
    obj = Page.objects.filter(slug=slug, status=Page.STATUS_PUBLISHED).first()
    if not obj:
        return Response({"detail": "Page not found."}, status=status.HTTP_404_NOT_FOUND)
    return Response(PageSerializer(obj, context={"request": request}).data)


@api_view(["GET"])
def homepage(request):
    obj = Page.objects.filter(is_homepage=True, status=Page.STATUS_PUBLISHED).first()
    if not obj:
        return Response({"detail": "Homepage not found."}, status=status.HTTP_404_NOT_FOUND)
    return Response(PageSerializer(obj, context={"request": request}).data)


# -------------------------
# ADMIN ENDPOINTS (Next.js custom admin)
# -------------------------

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
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(SiteSettingsSerializer(obj, context={"request": request}).data)


@api_view(["POST"])
@permission_classes([IsAdmin])
def admin_setup_seed(request):
    created = {}

    settings = SiteSettings.objects.order_by("id").first()
    if not settings:
        settings = SiteSettings.objects.create(
            site_name="Vintage Africana",
            tagline="Vintage culture, curated stories.",
        )
        created["site_settings"] = True
    else:
        created["site_settings"] = False

    header, header_created = NavigationMenu.objects.get_or_create(
        code="header", defaults={"title": "Header Menu"}
    )
    footer, footer_created = NavigationMenu.objects.get_or_create(
        code="footer", defaults={"title": "Footer Menu"}
    )
    created["nav_header_menu"] = header_created
    created["nav_footer_menu"] = footer_created

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

    homepage_obj = Page.objects.filter(is_homepage=True).first()
    if not homepage_obj:
        homepage_obj = Page.objects.create(
            title="Home",
            slug="home",
            is_homepage=True,
            status=Page.STATUS_PUBLISHED,
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
        if homepage_obj.status != Page.STATUS_PUBLISHED:
            homepage_obj.status = Page.STATUS_PUBLISHED
            homepage_obj.published_at = timezone.now()
            homepage_obj.save(update_fields=["status", "published_at"])
            created["homepage_published_now"] = True
        else:
            created["homepage_published_now"] = False

    return Response({"detail": "Setup completed.", "created": created}, status=status.HTTP_200_OK)
