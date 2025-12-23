from django.urls import path
from .views import admin_media_list, admin_media_upload

urlpatterns = [
    # Keep existing (backward compatible)
    path("admin/media/", admin_media_list, name="admin_media_list"),
    path("admin/media/upload/", admin_media_upload, name="admin_media_upload"),

    # Add aliases expected by the Next.js admin/ImagePicker
    path("admin/media-assets/", admin_media_list, name="admin_media_assets_list"),
    path("admin/media-assets/upload/", admin_media_upload, name="admin_media_assets_upload"),
]
