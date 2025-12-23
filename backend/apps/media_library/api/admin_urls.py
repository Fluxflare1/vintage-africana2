from django.urls import path
from .admin_views import admin_media_list, admin_media_upload

urlpatterns = [
    path("admin/media/", admin_media_list),
    path("admin/media/upload/", admin_media_upload),
]
