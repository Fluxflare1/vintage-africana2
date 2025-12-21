from rest_framework import serializers
from apps.media_library.models import MediaAsset
from apps.cms.models import SiteSettings, NavigationMenu, NavigationItem, Page


class MediaAssetSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = MediaAsset
        fields = ("id", "type", "title", "alt_text", "caption", "external_url", "url", "width", "height")

    def get_url(self, obj):
        request = self.context.get("request")
        if obj.file and hasattr(obj.file, "url"):
            return request.build_absolute_uri(obj.file.url) if request else obj.file.url
        return ""


class SiteSettingsSerializer(serializers.ModelSerializer):
    logo = MediaAssetSerializer(read_only=True)
    favicon = MediaAssetSerializer(read_only=True)
    default_og_image = MediaAssetSerializer(read_only=True)

    class Meta:
        model = SiteSettings
        fields = (
            "site_name", "tagline",
            "logo", "favicon", "default_og_image",
            "instagram", "x_twitter", "facebook", "youtube", "tiktok",
            "contact_email", "contact_phone", "address", "map_embed_url",
            "default_seo_title", "default_seo_description",
        )


class NavigationItemTreeSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = NavigationItem
        fields = ("label", "url", "order", "children")

    def get_children(self, obj):
        qs = obj.children.filter(is_visible=True).order_by("order", "id")
        return NavigationItemTreeSerializer(qs, many=True).data


class NavigationMenuSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = NavigationMenu
        fields = ("code", "title", "items")

    def get_items(self, obj):
        top = obj.items.filter(is_visible=True, parent__isnull=True).order_by("order", "id")
        return NavigationItemTreeSerializer(top, many=True).data


class PageSerializer(serializers.ModelSerializer):
    hero_image = MediaAssetSerializer(read_only=True)
    cover_image = MediaAssetSerializer(read_only=True)

    class Meta:
        model = Page
        fields = (
            "title", "slug", "excerpt", "content",
            "status", "published_at",
            "hero_image", "cover_image",
            "seo_title", "seo_description", "canonical_url",
            "og_title", "og_description",
            "is_homepage",
        )
