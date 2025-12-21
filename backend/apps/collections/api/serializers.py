from rest_framework import serializers
from apps.media_library.models import MediaAsset
from apps.collections.models import CollectionCategory, VintageItem, VintageItemMedia


class MediaAssetSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = MediaAsset
        fields = ("id", "type", "title", "alt_text", "caption", "external_url", "url")

    def get_url(self, obj):
        request = self.context.get("request")
        if obj.file and hasattr(obj.file, "url"):
            return request.build_absolute_uri(obj.file.url) if request else obj.file.url
        return ""


class CollectionCategorySerializer(serializers.ModelSerializer):
    cover_image = MediaAssetSerializer(read_only=True)

    class Meta:
        model = CollectionCategory
        fields = ("name", "slug", "description", "cover_image")


class VintageItemMediaSerializer(serializers.ModelSerializer):
    asset = MediaAssetSerializer(read_only=True)

    class Meta:
        model = VintageItemMedia
        fields = ("asset", "order", "is_primary")


class VintageItemListSerializer(serializers.ModelSerializer):
    cover_image = MediaAssetSerializer(read_only=True)

    class Meta:
        model = VintageItem
        fields = (
            "name",
            "slug",
            "short_description",
            "year",
            "era_label",
            "condition",
            "cover_image",
        )


class VintageItemDetailSerializer(serializers.ModelSerializer):
    cover_image = MediaAssetSerializer(read_only=True)
    media = VintageItemMediaSerializer(many=True, read_only=True)

    class Meta:
        model = VintageItem
        fields = (
            "name",
            "slug",
            "story",
            "item_type",
            "brand",
            "model",
            "year",
            "era_label",
            "origin_country",
            "condition",
            "cover_image",
            "media",
            "seo_title",
            "seo_description",
            "canonical_url",
        )
