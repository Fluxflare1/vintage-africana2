from django.urls import path
from .views import (
    site_settings,
    navigation_menu,
    page_by_slug,
    homepage,
    admin_pages_v2,
    admin_page_detail_v2,
    admin_site_settings,
    admin_setup_seed,
)

urlpatterns = [
    # Public
    path("settings/", site_settings, name="site-settings"),
    path("navigation/<str:code>/", navigation_menu, name="navigation-menu"),
    path("pages/home/", homepage, name="homepage"),
    path("pages/<str:slug>/", page_by_slug, name="page-by-slug"),

    # Admin (Next.js custom admin panel)
    path("admin/pages/", admin_pages_v2, name="admin-pages"),
    path("admin/pages/<int:id>/", admin_page_detail_v2, name="admin-page-detail"),
    path("admin/settings/", admin_site_settings, name="admin-site-settings"),
    path("admin/setup/", admin_setup_seed, name="admin-setup-seed"),
]
