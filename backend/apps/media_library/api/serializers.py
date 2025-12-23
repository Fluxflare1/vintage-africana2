from rest_framework import serializers
from apps.media_library.models import MediaAsset


class MediaAssetSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = MediaAsset
        fields = [
            "id",
            "type",
            "title",
            "alt_text",
            "caption",
            "credit",
            "source",
            "is_featured",
            "width",
            "height",
            "external_url",
            "file",
            "url",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "url", "created_at", "updated_at"]

    def get_url(self, obj: MediaAsset) -> str:
        request = self.context.get("request")
        if obj.file:
            # /media/... -> absolute URL if request exists
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return obj.external_url or ""
