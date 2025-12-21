from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from apps.core.models import Tag
from apps.stories.models import StoryCategory, Story
from .serializers import (
    TagSerializer,
    StoryCategorySerializer,
    StoryListSerializer,
    StoryDetailSerializer,
)


@api_view(["GET"])
def tags(request):
    qs = Tag.objects.order_by("name")
    return Response(TagSerializer(qs, many=True).data)


@api_view(["GET"])
def categories(request):
    qs = StoryCategory.objects.order_by("name")
    return Response(StoryCategorySerializer(qs, many=True).data)


@api_view(["GET"])
def stories(request):
    qs = Story.objects.filter(status="published").order_by("-published_at", "-created_at")

    category = request.query_params.get("category")
    tag = request.query_params.get("tag")
    featured = request.query_params.get("featured")

    if category:
        qs = qs.filter(category__slug=category)
    if tag:
        qs = qs.filter(tags__slug=tag)
    if featured in ("true", "1", "yes"):
        qs = qs.filter(is_featured=True)

    return Response(StoryListSerializer(qs, many=True, context={"request": request}).data)


@api_view(["GET"])
def story_detail(request, slug: str):
    obj = Story.objects.filter(slug=slug, status="published").first()
    if not obj:
        return Response({"detail": "Story not found"}, status=status.HTTP_404_NOT_FOUND)
    return Response(StoryDetailSerializer(obj, context={"request": request}).data)
