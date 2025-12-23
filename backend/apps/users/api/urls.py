from django.urls import path
from .auth import admin_login, admin_logout, admin_me

urlpatterns = [
    path("admin/login/", admin_login),
    path("admin/logout/", admin_logout),
    path("admin/me/", admin_me),
]
