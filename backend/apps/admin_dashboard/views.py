from __future__ import annotations

from django.apps import apps
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth import get_user_model
from django.db import connections
from django.shortcuts import render


def _model_count(app_label: str, model_name: str) -> int | None:
    """
    Returns count of rows for a model, or None if model/table isn't available yet.
    This prevents admin/dashboard from crashing during early setup/migration phases.
    """
    try:
        model = apps.get_model(app_label, model_name)
        if model is None:
            return None

        db = model._state.db or "default"
        conn = connections[db]
        table = model._meta.db_table

        # If the table doesn't exist yet, avoid crashing
        if table not in conn.introspection.table_names():
            return None

        return model._default_manager.count()
    except Exception:
        return None


@staff_member_required
def dashboard(request):
    User = get_user_model()

    context = {
        "title": "Dashboard",
        "stats": [
            {"label": "Users", "value": _model_count(User._meta.app_label, User._meta.model_name)},
            {"label": "Pages", "value": _model_count("cms", "Page")},
            {"label": "Navigation Menus", "value": _model_count("cms", "NavigationMenu")},
            {"label": "Site Settings", "value": _model_count("cms", "SiteSettings")},
            {"label": "Collections", "value": _model_count("collections", "CollectionCategory")},
            {"label": "Vintage Items", "value": _model_count("collections", "VintageItem")},
            {"label": "Stories", "value": _model_count("stories", "Story")},
            {"label": "Story Categories", "value": _model_count("stories", "StoryCategory")},
            {"label": "Experiences", "value": _model_count("experiences", "Experience")},
            {"label": "Media Assets", "value": _model_count("media_library", "MediaAsset")},
        ],
    }

    return render(request, "admin_dashboard/dashboard.html", context)
