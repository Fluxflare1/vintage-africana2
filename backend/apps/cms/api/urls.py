from django.urls import path
from .views import site_settings, navigation_menu, page_by_slug, homepage

urlpatterns = [
    path("settings/", site_settings, name="site-settings"),
    path("navigation/<str:code>/", navigation_menu, name="navigation-menu"),
    path("pages/home/", homepage, name="homepage"),
    path("pages/<str:slug>/", page_by_slug, name="page-by-slug"),
]
