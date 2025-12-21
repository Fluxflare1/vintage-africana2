from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model

from apps.core.models import TimeStampedModel, PublishableModel, SEOFields, Tag
from apps.media_library.models import MediaAsset
from apps.collections.models import VintageItem

User = get_user_model()


class StoryCategory(TimeStampedModel):
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)[:100]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Story(TimeStampedModel, PublishableModel, SEOFields):
    title = models.CharField(max_length=180)
    slug = models.SlugField(max_length=200, unique=True)

    excerpt = models.CharField(max_length=255, blank=True)
    content = models.JSONField(default=list, blank=True)

    category = models.ForeignKey(
        StoryCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name="stories"
    )

    tags = models.ManyToManyField(Tag, blank=True, related_name="stories")

    author = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="stories"
    )

    featured_image = models.ForeignKey(
        MediaAsset, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )

    related_items = models.ManyToManyField(
        VintageItem, blank=True, related_name="related_stories"
    )

    is_featured = models.BooleanField(default=False, db_index=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)[:200]
        super().save(*args, **kwargs)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def __str__(self):
        return self.title
