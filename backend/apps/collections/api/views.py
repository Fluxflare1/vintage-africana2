from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from apps.collections.models import CollectionCategory, VintageItem
from .serializers import (
    CollectionCategorySerializer,
    VintageItemListSerializer,
    VintageItemDetailSerializer,
)


@api_view(["GET"])
def categories(request):
    qs = CollectionCategory.objects.filter(status="published").order_by("order", "name")
    return Response(CollectionCategorySerializer(qs, many=True, context={"request": request}).data)


@api_view(["GET"])
def items_by_category(request, category_slug):
    category = CollectionCategory.objects.filter(
        slug=category_slug, status="published"
    ).first()
    if not category:
        return Response({"detail": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

    items = category.items.filter(status="published")
    return Response(
        VintageItemListSerializer(items, many=True, context={"request": request}).data
    )


@api_view(["GET"])
def item_detail(request, category_slug, item_slug):
    item = VintageItem.objects.filter(
        slug=item_slug, status="published", category__slug=category_slug
    ).first()
    if not item:
        return Response({"detail": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

    return Response(
        VintageItemDetailSerializer(item, context={"request": request}).data
    )
