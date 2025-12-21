from django.contrib import admin
from .models import Experience


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ("title", "type", "status", "is_featured", "starts_at", "updated_at")
    list_filter = ("type", "status", "is_featured")
    search_fields = ("title", "slug", "summary", "location")
    prepopulated_fields = {"slug": ("title",)}
