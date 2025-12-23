from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from apps.cms.models import SiteSettings, Page
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
