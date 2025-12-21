from django.db import models
from django.utils.text import slugify

from apps.core.models import TimeStampedModel, PublishableModel, SEOFields
from apps.media_library.models import MediaAsset


class CollectionCategory(TimeStampedModel, PublishableModel, SEOFields):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True)

    description = models.TextField(blank=True)
    cover_image = models.ForeignKey(
        MediaAsset, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )

    order = models.PositiveIntegerField(default=0, db_index=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)[:140]
        super().save(*args, **kwargs)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


class VintageItem(TimeStampedModel, PublishableModel, SEOFields):
    category = models.ForeignKey(
        CollectionCategory, on_delete=models.PROTECT, related_name="items"
    )

    name = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True)

    short_description = models.CharField(max_length=255, blank=True)
    story = models.JSONField(default=list, blank=True)

    item_type = models.CharField(max_length=80, blank=True)
    brand = models.CharField(max_length=80, blank=True)
    model = models.CharField(max_length=80, blank=True)

    year = models.PositiveIntegerField(null=True, blank=True)
    era_label = models.CharField(max_length=80, blank=True)
    origin_country = models.CharField(max_length=80, blank=True)

    CONDITION_CHOICES = (
        ("unknown", "Unknown"),
        ("poor", "Poor"),
        ("fair", "Fair"),
        ("good", "Good"),
        ("excellent", "Excellent"),
        ("restored", "Restored"),
    )
    condition = models.CharField(
        max_length=12, choices=CONDITION_CHOICES, default="unknown", db_index=True
    )

    cover_image = models.ForeignKey(
        MediaAsset, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )

    is_featured = models.BooleanField(default=False, db_index=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)[:180]
        super().save(*args, **kwargs)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def __str__(self):
        return self.name


class VintageItemMedia(TimeStampedModel):
    item = models.ForeignKey(
        VintageItem, on_delete=models.CASCADE, related_name="media"
    )
    asset = models.ForeignKey(
        MediaAsset, on_delete=models.CASCADE, related_name="vintage_usages"
    )
    order = models.PositiveIntegerField(default=0)
    is_primary = models.BooleanField(default=False)

    class Meta:
        ordering = ["order", "id"]
        unique_together = ("item", "asset")

    def __str__(self):
        return f"{self.item} → {self.asset}"
