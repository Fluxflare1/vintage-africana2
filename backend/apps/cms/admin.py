from django.contrib import admin
from django.db.utils import ProgrammingError, OperationalError
from .models import SiteSettings, NavigationMenu, NavigationItem, Page


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ("site_name", "tagline", "updated_at")
    
    def has_add_permission(self, request):
        """
        Allow only one SiteSettings instance.
        DB-safe: handles cases where table doesn't exist yet.
        """
        try:
            return not SiteSettings.objects.exists()
        except (ProgrammingError, OperationalError):
            # Table does not exist yet (during migrations)
            return True


class NavigationItemInline(admin.TabularInline):
    model = NavigationItem
    extra = 0
    fields = ("label", "url", "order", "is_visible", "parent")
    ordering = ("order",)


@admin.register(NavigationMenu)
class NavigationMenuAdmin(admin.ModelAdmin):
    list_display = ("code", "title", "created_at")
    inlines = [NavigationItemInline]


@admin.register(NavigationItem)
class NavigationItemAdmin(admin.ModelAdmin):
    list_display = ("label", "menu", "order", "is_visible")
    list_filter = ("menu", "is_visible")
    ordering = ("menu", "order")


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "status", "is_homepage", "hero_enabled", "published_at", "updated_at")
    list_filter = ("status", "is_homepage", "hero_enabled")
    search_fields = ("title", "slug", "excerpt")
    prepopulated_fields = {"slug": ("title",)}

    fieldsets = (
        ("Page", {
            "fields": ("title", "slug", "excerpt", "status", "published_at", "is_homepage")
        }),
        ("Hero", {
            "fields": ("hero_enabled", "hero_asset", "hero_cta_label", "hero_cta_url")
        }),
        ("Media", {
            "fields": ("hero_image", "cover_image")
        }),
        ("Content", {
            "fields": ("content",)
        }),
        ("SEO", {
            "fields": ("seo_title", "seo_description", "canonical_url", "og_title", "og_description")
        }),
    )

    def get_readonly_fields(self, request, obj=None):
        """
        Restrict publishing permissions based on user role.
        """
        readonly_fields = []
        if not request.user.has_perm("cms.can_publish_page"):
            readonly_fields.extend(["status", "published_at"])
        return readonly_fields
