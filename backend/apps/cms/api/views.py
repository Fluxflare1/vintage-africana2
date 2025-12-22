from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from apps.cms.models import SiteSettings, NavigationMenu, Page
from .serializers import SiteSettingsSerializer, NavigationMenuSerializer, PageSerializer
from apps.core.permissions import IsAdmin


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
    return Response(NavigationMenuSerializer(obj).data)


@api_view(["GET"])
def page_by_slug(request, slug: str):
    obj = Page.objects.filter(slug=slug, status="published").first()
    if not obj:
        return Response({"detail": "Page not found."}, status=status.HTTP_404_NOT_FOUND)
    return Response(PageSerializer(obj, context={"request": request}).data)


@api_view(["GET"])
def homepage(request):
    obj = Page.objects.filter(is_homepage=True, status="published").first()
    if not obj:
        return Response({"detail": "Homepage not found."}, status=status.HTTP_404_NOT_FOUND)
    return Response(PageSerializer(obj, context={"request": request}).data)


# -------------------------
# ADMIN-ONLY ENDPOINTS
# -------------------------

@api_view(["GET"])
@permission_classes([IsAdmin])
def admin_pages(request):
    """
    Returns all pages (draft/review/published/etc) for admin panel usage.
    """
    qs = Page.objects.all().order_by("-updated_at", "-id") if hasattr(Page, "updated_at") else Page.objects.all().order_by("-id")
    return Response(PageSerializer(qs, many=True, context={"request": request}).data)


@api_view(["GET"])
@permission_classes([IsAdmin])
def admin_page_detail(request, slug: str):
    """
    Returns a page regardless of status (admin).
    """
    obj = Page.objects.filter(slug=slug).first()
    if not obj:
        return Response({"detail": "Page not found."}, status=status.HTTP_404_NOT_FOUND)
    return Response(PageSerializer(obj, context={"request": request}).data)
