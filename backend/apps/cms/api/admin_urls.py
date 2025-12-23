from django.urls import path
from .admin_views import admin_pages, admin_page_detail, admin_site_settings

urlpatterns = [
    path("admin/pages/", admin_pages),
    path("admin/pages/<int:page_id>/", admin_page_detail),
    path("admin/settings/", admin_site_settings),
]
