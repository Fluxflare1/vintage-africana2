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
    # READ (nested objects for UI)
    logo = MediaAssetSerializer(read_only=True)
    favicon = MediaAssetSerializer(read_only=True)
    default_og_image = MediaAssetSerializer(read_only=True)

    # WRITE (IDs from Next.js admin)
    logo_id = serializers.PrimaryKeyRelatedField(
        source="logo",
        queryset=MediaAsset.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )
    favicon_id = serializers.PrimaryKeyRelatedField(
        source="favicon",
        queryset=MediaAsset.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )
    default_og_image_id = serializers.PrimaryKeyRelatedField(
        source="default_og_image",
        queryset=MediaAsset.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = SiteSettings
        fields = (
            "site_name", "tagline",
            "logo", "favicon", "default_og_image",
            "logo_id", "favicon_id", "default_og_image_id",
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
    id = serializers.IntegerField(read_only=True)

    # read (for UI display)
    hero_image = MediaAssetSerializer(read_only=True)
    cover_image = MediaAssetSerializer(read_only=True)
    hero_asset = MediaAssetSerializer(read_only=True)

    # write (IDs from Next.js admin)
    hero_image_id = serializers.PrimaryKeyRelatedField(
        source="hero_image",
        queryset=MediaAsset.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )
    cover_image_id = serializers.PrimaryKeyRelatedField(
        source="cover_image",
        queryset=MediaAsset.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )
    hero_asset_id = serializers.PrimaryKeyRelatedField(
        source="hero_asset",
        queryset=MediaAsset.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Page
        fields = (
            "id",
            "title", "slug", "excerpt", "content",
            "status", "published_at",
            "hero_enabled",
            "hero_cta_label", "hero_cta_url",
            "hero_asset", "hero_image", "cover_image",
            "hero_asset_id", "hero_image_id", "cover_image_id",
            "seo_title", "seo_description", "canonical_url",
            "og_title", "og_description",
            "is_homepage",
        )
