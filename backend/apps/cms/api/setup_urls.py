from django.urls import path
from .setup_views import admin_setup_seed

urlpatterns = [
    path("admin/setup/seed/", admin_setup_seed, name="admin_setup_seed"),
]
