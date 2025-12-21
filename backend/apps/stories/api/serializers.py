from rest_framework import serializers
from apps.media_library.models import MediaAsset
from apps.core.models import Tag
from apps.collections.models import VintageItem
from apps.stories.models import StoryCategory, Story


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


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("name", "slug")


class StoryCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryCategory
        fields = ("name", "slug", "description")


class VintageItemRefSerializer(serializers.ModelSerializer):
    class Meta:
        model = VintageItem
        fields = ("name", "slug")


class StoryListSerializer(serializers.ModelSerializer):
    category = StoryCategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    featured_image = MediaAssetSerializer(read_only=True)

    class Meta:
        model = Story
        fields = (
            "title",
            "slug",
            "excerpt",
            "published_at",
            "is_featured",
            "category",
            "tags",
            "featured_image",
        )


class StoryDetailSerializer(serializers.ModelSerializer):
    category = StoryCategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    featured_image = MediaAssetSerializer(read_only=True)
    related_items = VintageItemRefSerializer(many=True, read_only=True)

    class Meta:
        model = Story
        fields = (
            "title",
            "slug",
            "excerpt",
            "content",
            "published_at",
            "is_featured",
            "category",
            "tags",
            "featured_image",
            "related_items",
            "seo_title",
            "seo_description",
            "canonical_url",
            "og_title",
            "og_description",
        )
