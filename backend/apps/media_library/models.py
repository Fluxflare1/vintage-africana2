from django.db import models
from apps.core.models import TimeStampedModel


class MediaAsset(TimeStampedModel):
    TYPE_IMAGE = "image"
    TYPE_VIDEO = "video"
    TYPE_AUDIO = "audio"
    TYPE_DOC = "doc"

    TYPE_CHOICES = (
        (TYPE_IMAGE, "Image"),
        (TYPE_VIDEO, "Video"),
        (TYPE_AUDIO, "Audio"),
        (TYPE_DOC, "Document"),
    )

    type = models.CharField(max_length=12, choices=TYPE_CHOICES, db_index=True)

    title = models.CharField(max_length=120, blank=True)
    alt_text = models.CharField(max_length=200, blank=True)
    caption = models.CharField(max_length=300, blank=True)

    file = models.FileField(upload_to="media_assets/%Y/%m/", blank=True, null=True)
    external_url = models.URLField(blank=True)

    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)

    credit = models.CharField(max_length=200, blank=True)
    source = models.CharField(max_length=200, blank=True)

    is_featured = models.BooleanField(default=False, db_index=True)

    def __str__(self):
        return self.title or f"{self.type}:{self.id}"
