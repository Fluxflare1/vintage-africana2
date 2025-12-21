from django.contrib import admin
from .models import SiteSettings, NavigationMenu, NavigationItem, Page


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ("id", "site_name", "tagline", "updated_at")


class NavigationItemInline(admin.TabularInline):
    model = NavigationItem
    extra = 0
    fields = ("label", "url", "order", "is_visible", "parent")
    ordering = ("order",)


@admin.register(NavigationMenu)
class NavigationMenuAdmin(admin.ModelAdmin):
    list_display = ("id", "code", "title", "created_at")
    inlines = [NavigationItemInline]


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "slug", "status", "is_homepage", "hero_enabled", "updated_at")
    list_filter = ("status", "is_homepage", "hero_enabled")
    search_fields = ("title", "slug", "excerpt")

    fieldsets = (
        ("Page", {"fields": ("title", "slug", "excerpt", "status", "published_at", "is_homepage")}),
        ("Hero", {"fields": ("hero_enabled", "hero_asset", "hero_cta_label", "hero_cta_url")}),
        ("Media", {"fields": ("hero_image", "cover_image")}),
        ("Content", {"fields": ("content",)}),
        ("SEO", {"fields": ("seo_title", "seo_description", "canonical_url", "og_title", "og_description")}),
    )

    def get_readonly_fields(self, request, obj=None):
        ro = []
        if not request.user.has_perm("cms.can_publish_page"):
            ro += ["status", "published_at"]
        return ro
