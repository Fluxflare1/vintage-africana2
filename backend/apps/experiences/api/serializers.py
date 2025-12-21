from rest_framework import serializers
from apps.media_library.models import MediaAsset
from apps.experiences.models import Experience


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


class ExperienceListSerializer(serializers.ModelSerializer):
    cover_image = MediaAssetSerializer(read_only=True)

    class Meta:
        model = Experience
        fields = (
            "title",
            "slug",
            "type",
            "summary",
            "starts_at",
            "ends_at",
            "location",
            "is_featured",
            "cover_image",
        )


class ExperienceDetailSerializer(serializers.ModelSerializer):
    cover_image = MediaAssetSerializer(read_only=True)

    class Meta:
        model = Experience
        fields = (
            "title",
            "slug",
            "type",
            "summary",
            "details",
            "starts_at",
            "ends_at",
            "location",
            "booking_url",
            "is_featured",
            "cover_image",
            "seo_title",
            "seo_description",
            "canonical_url",
            "og_title",
            "og_description",
        )
