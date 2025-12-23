from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from apps.cms.models import SiteSettings, NavigationMenu, NavigationItem
from .admin_serializers import (
    SiteSettingsSerializer,
    NavigationMenuSerializer,
    NavigationItemSerializer,
)


# ---------- SETTINGS ----------
@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def admin_settings(request):
    obj = SiteSettings.objects.first()
    if not obj:
        obj = SiteSettings.objects.create()

    if request.method == "GET":
        return Response(SiteSettingsSerializer(obj).data)

    serializer = SiteSettingsSerializer(obj, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


# ---------- NAVIGATION MENUS ----------
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def admin_nav_menus(request):
    if request.method == "GET":
        menus = NavigationMenu.objects.all().order_by("id")
        return Response(NavigationMenuSerializer(menus, many=True).data)

    serializer = NavigationMenuSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    menu = serializer.save()
    return Response(NavigationMenuSerializer(menu).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def admin_nav_menu_detail(request, menu_id: int):
    menu = NavigationMenu.objects.get(id=menu_id)

    if request.method == "GET":
        return Response(NavigationMenuSerializer(menu).data)

    if request.method == "DELETE":
        menu.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = NavigationMenuSerializer(menu, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(NavigationMenuSerializer(menu).data)


# ---------- NAV ITEMS ----------
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def admin_nav_items(request, menu_id: int):
    menu = NavigationMenu.objects.get(id=menu_id)

    if request.method == "GET":
        items = NavigationItem.objects.filter(menu=menu).order_by("order", "id")
        return Response(NavigationItemSerializer(items, many=True).data)

    data = request.data.copy()
    data["menu"] = menu.id
    serializer = NavigationItemSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    item = serializer.save()
    return Response(NavigationItemSerializer(item).data, status=status.HTTP_201_CREATED)


@api_view(["PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def admin_nav_item_detail(request, item_id: int):
    item = NavigationItem.objects.get(id=item_id)

    if request.method == "DELETE":
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = NavigationItemSerializer(item, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)
