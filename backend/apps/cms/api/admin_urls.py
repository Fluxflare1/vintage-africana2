from django.urls import path
from .admin_views import (
    admin_settings,
    admin_nav_menus,
    admin_nav_menu_detail,
    admin_nav_items,
    admin_nav_item_detail,
)

urlpatterns = [
    # settings
    path("admin/settings/", admin_settings, name="admin_settings"),

    # navigation menus
    path("admin/navigation/menus/", admin_nav_menus, name="admin_nav_menus"),
    path("admin/navigation/menus/<int:menu_id>/", admin_nav_menu_detail, name="admin_nav_menu_detail"),

    # navigation items
    path("admin/navigation/menus/<int:menu_id>/items/", admin_nav_items, name="admin_nav_items"),
    path("admin/navigation/items/<int:item_id>/", admin_nav_item_detail, name="admin_nav_item_detail"),
]
