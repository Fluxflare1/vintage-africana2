from rest_framework import serializers
from apps.cms.models import SiteSettings, NavigationMenu, NavigationItem


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = "__all__"


class NavigationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = NavigationItem
        fields = "__all__"


class NavigationMenuSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = NavigationMenu
        fields = "__all__"

    def get_items(self, obj):
        qs = NavigationItem.objects.filter(menu=obj).order_by("order", "id")
        return NavigationItemSerializer(qs, many=True).data
