from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from apps.cms.models import SiteSettings, NavigationMenu, Page
from .serializers import SiteSettingsSerializer, NavigationMenuSerializer, PageSerializer


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
