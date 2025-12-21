from django.contrib import admin
from .models import CollectionCategory, VintageItem, VintageItemMedia


@admin.register(CollectionCategory)
class CollectionCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "status", "order", "updated_at")
    list_filter = ("status",)
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("order", "name")


class VintageItemMediaInline(admin.TabularInline):
    model = VintageItemMedia
    extra = 0
    fields = ("asset", "order", "is_primary")
    ordering = ("order",)


@admin.register(VintageItem)
class VintageItemAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "status", "condition", "is_featured")
    list_filter = ("status", "condition", "is_featured", "category")
    search_fields = ("name", "brand", "model", "origin_country")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [VintageItemMediaInline]

    def get_readonly_fields(self, request, obj=None):
        ro = []
        if not request.user.has_perm("collections.can_publish_vintageitem"):
            ro += ["status", "published_at"]
        return ro
