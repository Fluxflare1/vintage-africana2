from django.urls import path
from . import views

urlpatterns = [
    # Public
    path("settings/", views.site_settings, name="site-settings"),
    path("navigation/<str:code>/", views.navigation_menu, name="navigation-menu"),
    path("pages/home/", views.homepage, name="homepage"),
    path("pages/<str:slug>/", views.page_by_slug, name="page-by-slug"),

    # Admin (Next.js custom admin panel)
    path("admin/pages/", views.admin_pages_v2, name="admin-pages"),
    path("admin/pages/<int:id>/", views.admin_page_detail_v2, name="admin-page-detail"),
    path("admin/settings/", views.admin_site_settings, name="admin-site-settings"),
    path("admin/setup/", views.admin_setup_seed, name="admin-setup-seed"),
]
