from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from apps.experiences.models import Experience
from .serializers import ExperienceListSerializer, ExperienceDetailSerializer


@api_view(["GET"])
def experiences(request):
    qs = Experience.objects.filter(status="published").order_by("-starts_at", "-published_at", "-created_at")

    type_filter = request.query_params.get("type")
    featured = request.query_params.get("featured")

    if type_filter:
        qs = qs.filter(type=type_filter)

    if featured in ("true", "1", "yes"):
        qs = qs.filter(is_featured=True)

    return Response(ExperienceListSerializer(qs, many=True, context={"request": request}).data)


@api_view(["GET"])
def experience_detail(request, slug: str):
    obj = Experience.objects.filter(slug=slug, status="published").first()
    if not obj:
        return Response({"detail": "Experience not found"}, status=status.HTTP_404_NOT_FOUND)
    return Response(ExperienceDetailSerializer(obj, context={"request": request}).data)
