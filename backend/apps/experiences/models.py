from django.db import models
from django.utils.text import slugify

from apps.core.models import TimeStampedModel, PublishableModel, SEOFields
from apps.media_library.models import MediaAsset


class Experience(TimeStampedModel, PublishableModel, SEOFields):
    TYPE_KITCHEN = "kitchen"
    TYPE_PODCAST = "podcast"
    TYPE_EVENT = "event"
    TYPE_TOUR = "tour"
    TYPE_OTHER = "other"

    TYPE_CHOICES = (
        (TYPE_KITCHEN, "Kitchen"),
        (TYPE_PODCAST, "Podcast Studio"),
        (TYPE_EVENT, "Event"),
        (TYPE_TOUR, "Tour"),
        (TYPE_OTHER, "Other"),
    )

    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default=TYPE_OTHER, db_index=True)

    title = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True)

    summary = models.CharField(max_length=255, blank=True)
    details = models.JSONField(default=list, blank=True)

    cover_image = models.ForeignKey(MediaAsset, on_delete=models.SET_NULL, null=True, blank=True, related_name="+")

    # Optional event/tour scheduling
    starts_at = models.DateTimeField(null=True, blank=True, db_index=True)
    ends_at = models.DateTimeField(null=True, blank=True)
    location = models.CharField(max_length=180, blank=True)

    booking_url = models.URLField(blank=True)

    is_featured = models.BooleanField(default=False, db_index=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)[:180]
        super().save(*args, **kwargs)

    class Meta:
        ordering = ["-starts_at", "-published_at", "-created_at"]
        indexes = [
            models.Index(fields=["type", "status"]),
            models.Index(fields=["is_featured", "status"]),
            models.Index(fields=["starts_at", "status"]),
        ]

    def __str__(self):
        return self.title
