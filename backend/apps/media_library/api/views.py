import mimetypes

from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from apps.media_library.models import MediaAsset
from .serializers import MediaAssetSerializer


def _guess_type_from_upload(filename: str, content_type: str | None) -> str:
    ct = content_type or mimetypes.guess_type(filename)[0] or ""
    ct = ct.lower()

    if ct.startswith("image/"):
        return MediaAsset.TYPE_IMAGE
    if ct.startswith("video/"):
        return MediaAsset.TYPE_VIDEO
    if ct.startswith("audio/"):
        return MediaAsset.TYPE_AUDIO
    return MediaAsset.TYPE_DOC


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_media_list(request):
    qs = MediaAsset.objects.all().order_by("-created_at")
    serializer = MediaAssetSerializer(qs, many=True, context={"request": request})
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def admin_media_upload(request):
    """
    Accepts multipart/form-data:
      - file (required OR external_url required)
      - external_url (optional)
      - title, alt_text, caption, credit, source (optional)
      - type (optional; auto-guessed if file provided)
    """
    upload = request.FILES.get("file")
    external_url = request.data.get("external_url", "").strip()

    if not upload and not external_url:
        return Response(
            {"detail": "Provide either a file upload or an external_url."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    asset = MediaAsset()

    if upload:
        asset.file = upload
        asset.type = request.data.get("type") or _guess_type_from_upload(upload.name, getattr(upload, "content_type", None))
    else:
        asset.external_url = external_url
        asset.type = request.data.get("type") or MediaAsset.TYPE_IMAGE  # default for external links

    asset.title = request.data.get("title", "")[:120]
    asset.alt_text = request.data.get("alt_text", "")[:200]
    asset.caption = request.data.get("caption", "")[:300]
    asset.credit = request.data.get("credit", "")[:200]
    asset.source = request.data.get("source", "")[:200]
    asset.is_featured = str(request.data.get("is_featured", "false")).lower() in ("1", "true", "yes")

    asset.save()

    serializer = MediaAssetSerializer(asset, context={"request": request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)
