from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render


def _safe_count(model):
    """
    Returns object count without crashing the admin if a table doesn't exist yet.
    This keeps the dashboard page stable while migrations are being fixed.
    """
    try:
        return model.objects.count()
    except Exception:
        return None


@staff_member_required
def dashboard(request):
    # Import models lazily (and safely) so missing migrations don't crash the page.
    User = None
    Page = None
    CollectionCategory = None
    VintageItem = None
    Story = None
    Experience = None
    MediaAsset = None

    try:
        from apps.users.models import User as _User
        User = _User
    except Exception:
        pass

    try:
        from apps.cms.models import Page as _Page
        Page = _Page
    except Exception:
        pass

    try:
        from apps.collections.models import CollectionCategory as _CC, VintageItem as _VI
        CollectionCategory = _CC
        VintageItem = _VI
    except Exception:
        pass

    try:
        from apps.stories.models import Story as _Story
        Story = _Story
    except Exception:
        pass

    try:
        from apps.experiences.models import Experience as _Experience
        Experience = _Experience
    except Exception:
        pass

    try:
        from apps.media_library.models import MediaAsset as _MediaAsset
        MediaAsset = _MediaAsset
    except Exception:
        pass

    stats = [
        {"label": "Users", "count": _safe_count(User) if User else None},
        {"label": "Pages", "count": _safe_count(Page) if Page else None},
        {"label": "Collection Categories", "count": _safe_count(CollectionCategory) if CollectionCategory else None},
        {"label": "Vintage Items", "count": _safe_count(VintageItem) if VintageItem else None},
        {"label": "Stories", "count": _safe_count(Story) if Story else None},
        {"label": "Experiences", "count": _safe_count(Experience) if Experience else None},
        {"label": "Media Assets", "count": _safe_count(MediaAsset) if MediaAsset else None},
    ]

    context = {
        "title": "Admin Dashboard",
        "stats": stats,
    }
    return render(request, "admin_dashboard/dashboard.html", context)
