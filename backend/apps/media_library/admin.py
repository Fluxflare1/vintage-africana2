from django.contrib import admin
from .models import MediaAsset


@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = ("id", "type", "title", "is_featured", "created_at")
    list_filter = ("type", "is_featured")
    search_fields = ("title", "alt_text", "caption", "credit", "source")
