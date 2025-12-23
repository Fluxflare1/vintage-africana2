from django.urls import path
from .admin_nav_views import admin_menus, admin_menu_detail

urlpatterns = [
    path("admin/menus/", admin_menus),
    path("admin/menus/<int:menu_id>/", admin_menu_detail),
]
