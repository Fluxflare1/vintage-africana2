from django.db import models
from django.utils.text import slugify

from apps.core.models import TimeStampedModel, SEOFields
from apps.media_library.models import MediaAsset


class WorkflowMixin(models.Model):
    STATUS_DRAFT = "draft"
    STATUS_REVIEW = "review"
    STATUS_PUBLISHED = "published"

    STATUS_CHOICES = [
        (STATUS_DRAFT, "Draft"),
        (STATUS_REVIEW, "Review"),
        (STATUS_PUBLISHED, "Published"),
    ]

    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default=STATUS_DRAFT
    )
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True


class PublishableModel(WorkflowMixin):
    """
    PublishableModel now inherits from WorkflowMixin,
    keeping backward compatibility while adding the workflow fields.
    """
    class Meta:
        abstract = True


class SiteSettings(TimeStampedModel):
    """
    Intended as singleton (enforce by convention: one row).
    """
    site_name = models.CharField(max_length=80, default="Vintage Africana")
    tagline = models.CharField(max_length=140, blank=True)

    logo = models.ForeignKey(MediaAsset, on_delete=models.SET_NULL, null=True, blank=True, related_name="+")
    favicon = models.ForeignKey(MediaAsset, on_delete=models.SET_NULL, null=True, blank=True, related_name="+")
    default_og_image = models.ForeignKey(MediaAsset, on_delete=models.SET_NULL, null=True, blank=True, related_name="+")

    instagram = models.URLField(blank=True)
    x_twitter = models.URLField(blank=True)
    facebook = models.URLField(blank=True)
    youtube = models.URLField(blank=True)
    tiktok = models.URLField(blank=True)

    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=50, blank=True)
    address = models.CharField(max_length=255, blank=True)
    map_embed_url = models.URLField(blank=True)

    default_seo_title = models.CharField(max_length=70, blank=True)
    default_seo_description = models.CharField(max_length=160, blank=True)

    def __str__(self):
        return self.site_name


class NavigationMenu(TimeStampedModel):
    code = models.CharField(max_length=30, unique=True)  # header, footer
    title = models.CharField(max_length=80)

    def __str__(self):
        return f"{self.title} ({self.code})"


class NavigationItem(TimeStampedModel):
    menu = models.ForeignKey(NavigationMenu, on_delete=models.CASCADE, related_name="items")
    label = models.CharField(max_length=80)
    url = models.CharField(max_length=255)  # internal path or absolute URL
    order = models.PositiveIntegerField(default=0, db_index=True)
    is_visible = models.BooleanField(default=True, db_index=True)

    parent = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True, related_name="children")

    class Meta:
        ordering = ["order", "id"]
        indexes = [
            models.Index(fields=["menu", "order"]),
            models.Index(fields=["parent", "order"]),
        ]

    def __str__(self):
        return self.label


class Page(TimeStampedModel, PublishableModel, SEOFields):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=160, unique=True)

    excerpt = models.CharField(max_length=255, blank=True)
    content = models.JSONField(default=list, blank=True)

    hero_image = models.ForeignKey(MediaAsset, on_delete=models.SET_NULL, null=True, blank=True, related_name="+")
    cover_image = models.ForeignKey(MediaAsset, on_delete=models.SET_NULL, null=True, blank=True, related_name="+")
    # Hero configuration (video or image background + overlay)
    hero_enabled = models.BooleanField(default=False, db_index=True)
    hero_asset = models.ForeignKey(
        MediaAsset, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    hero_cta_label = models.CharField(max_length=60, blank=True)
    hero_cta_url = models.CharField(max_length=255, blank=True)

    is_homepage = models.BooleanField(default=False, db_index=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)[:160]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        permissions = [
            ("can_publish_page", "Can publish page"),
        ]
