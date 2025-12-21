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
    list_display = ("id", "title", "slug", "status", "is_homepage", "updated_at")
    list_filter = ("status", "is_homepage")
    search_fields = ("title", "slug", "excerpt")
