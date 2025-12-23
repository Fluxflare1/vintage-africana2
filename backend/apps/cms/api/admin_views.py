from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from django.utils.text import slugify
import json

from apps.cms.models import Page, SiteSettings, NavigationMenu, NavigationItem


def _require_staff(request):
    return request.user.is_authenticated and request.user.is_staff


def _page_dict(p: Page):
    d = model_to_dict(
        p,
        fields=[
            "id",
            "title",
            "slug",
            "excerpt",
            "status",
            "published_at",
            "is_homepage",
            "hero_enabled",
            "hero_cta_label",
            "hero_cta_url",
            "seo_title",
            "seo_description",
            "canonical_url",
            "og_title",
            "og_description",
        ],
    )
    d["content"] = p.content
    return d


@csrf_exempt
def admin_pages(request):
    if not _require_staff(request):
        return JsonResponse({"detail": "Unauthorized"}, status=401)

    if request.method == "GET":
        pages = Page.objects.all().order_by("-id")
        return JsonResponse([_page_dict(p) for p in pages], safe=False)

    if request.method == "POST":
        data = json.loads(request.body.decode("utf-8") or "{}")
        title = data.get("title", "").strip()
        if not title:
            return JsonResponse({"detail": "title is required"}, status=400)

        slug = (data.get("slug") or slugify(title)).strip() or slugify(title)
        if Page.objects.filter(slug=slug).exists():
            return JsonResponse({"detail": "slug already exists"}, status=400)

        p = Page.objects.create(
            title=title,
            slug=slug,
            excerpt=data.get("excerpt", ""),
            status=data.get("status", "draft"),
            is_homepage=bool(data.get("is_homepage", False)),
            hero_enabled=bool(data.get("hero_enabled", False)),
            hero_cta_label=data.get("hero_cta_label") or "",
            hero_cta_url=data.get("hero_cta_url") or "",
            content=data.get("content") or [],
        )
        return JsonResponse(_page_dict(p), status=201)

    return JsonResponse({"detail": "Method not allowed"}, status=405)


@csrf_exempt
def admin_page_detail(request, page_id: int):
    if not _require_staff(request):
        return JsonResponse({"detail": "Unauthorized"}, status=401)

    try:
        p = Page.objects.get(id=page_id)
    except Page.DoesNotExist:
        return JsonResponse({"detail": "Not found"}, status=404)

    if request.method == "GET":
        return JsonResponse(_page_dict(p))

    if request.method in ("PUT", "PATCH"):
        data = json.loads(request.body.decode("utf-8") or "{}")

        for field in [
            "title",
            "slug",
            "excerpt",
            "status",
            "is_homepage",
            "hero_enabled",
            "hero_cta_label",
            "hero_cta_url",
            "seo_title",
            "seo_description",
            "canonical_url",
            "og_title",
            "og_description",
        ]:
            if field in data:
                setattr(p, field, data[field])

        if "content" in data:
            p.content = data["content"] or []

        # ensure only one homepage
        if p.is_homepage:
            Page.objects.exclude(id=p.id).filter(is_homepage=True).update(is_homepage=False)

        p.save()
        return JsonResponse(_page_dict(p))

    if request.method == "DELETE":
        p.delete()
        return JsonResponse({"ok": True})

    return JsonResponse({"detail": "Method not allowed"}, status=405)


@csrf_exempt
def admin_site_settings(request):
    if not _require_staff(request):
        return JsonResponse({"detail": "Unauthorized"}, status=401)

    obj, _ = SiteSettings.objects.get_or_create(defaults={"site_name": "Vintage Africana", "tagline": ""})

    if request.method == "GET":
        return JsonResponse(model_to_dict(obj))

    if request.method in ("PUT", "PATCH"):
        data = json.loads(request.body.decode("utf-8") or "{}")
        for k, v in data.items():
            if hasattr(obj, k):
                setattr(obj, k, v)
        obj.save()
        return JsonResponse(model_to_dict(obj))

    return JsonResponse({"detail": "Method not allowed"}, status=405)
