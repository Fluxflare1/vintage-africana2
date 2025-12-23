from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.utils.timezone import now

from apps.media_library.models import MediaAsset


def _require_staff(request):
    return request.user.is_authenticated and request.user.is_staff


def _asset_dict(a: MediaAsset):
    # Adjust these fields if your model differs
    return {
        "id": a.id,
        "url": getattr(a, "file").url if getattr(a, "file", None) else "",
        "name": getattr(a, "title", "") or getattr(getattr(a, "file", None), "name", ""),
        "created_at": getattr(a, "created_at", None).isoformat() if getattr(a, "created_at", None) else None,
    }


@csrf_exempt
def admin_media_list(request):
    if not _require_staff(request):
        return JsonResponse({"detail": "Unauthorized"}, status=401)

    if request.method == "GET":
        qs = MediaAsset.objects.all().order_by("-id")[:200]
        return JsonResponse([_asset_dict(a) for a in qs], safe=False)

    return JsonResponse({"detail": "Method not allowed"}, status=405)


@csrf_exempt
def admin_media_upload(request):
    if not _require_staff(request):
        return JsonResponse({"detail": "Unauthorized"}, status=401)

    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    f = request.FILES.get("file")
    if not f:
        return JsonResponse({"detail": "file is required"}, status=400)

    # Create asset (adjust if your model differs)
    asset = MediaAsset.objects.create(
        file=f,
        **({"title": request.POST.get("name", "")} if hasattr(MediaAsset, "title") else {}),
    )

    return JsonResponse(_asset_dict(asset), status=201)
