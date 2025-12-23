from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
import json

from apps.cms.models import NavigationMenu, NavigationItem


def _require_staff(request):
    return request.user.is_authenticated and request.user.is_staff


def _menu_dict(menu: NavigationMenu):
    items = menu.items.all().order_by("order", "id")
    return {
        "id": menu.id,
        "code": getattr(menu, "code", None),
        "title": menu.title,
        "items": [
            {
                "id": it.id,
                "label": it.label,
                "url": it.url,
                "order": it.order,
            }
            for it in items
        ],
    }


@csrf_exempt
def admin_menus(request):
    if not _require_staff(request):
        return JsonResponse({"detail": "Unauthorized"}, status=401)

    if request.method == "GET":
        menus = NavigationMenu.objects.all().order_by("id")
        return JsonResponse([_menu_dict(m) for m in menus], safe=False)

    return JsonResponse({"detail": "Method not allowed"}, status=405)


@csrf_exempt
def admin_menu_detail(request, menu_id: int):
    if not _require_staff(request):
        return JsonResponse({"detail": "Unauthorized"}, status=401)

    try:
        menu = NavigationMenu.objects.get(id=menu_id)
    except NavigationMenu.DoesNotExist:
        return JsonResponse({"detail": "Not found"}, status=404)

    if request.method == "GET":
        return JsonResponse(_menu_dict(menu))

    # PUT replaces items
    if request.method in ("PUT", "PATCH"):
        data = json.loads(request.body.decode("utf-8") or "{}")
        items = data.get("items", [])

        # wipe and recreate is simplest + stable
        menu.items.all().delete()

        for i, it in enumerate(items, start=1):
            NavigationItem.objects.create(
                menu=menu,
                label=(it.get("label") or "").strip(),
                url=(it.get("url") or "").strip(),
                order=int(it.get("order") or i),
            )

        return JsonResponse(_menu_dict(menu))

    return JsonResponse({"detail": "Method not allowed"}, status=405)
