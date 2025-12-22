from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("media_library", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="SiteSettings",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("site_name", models.CharField(max_length=200)),
                ("tagline", models.CharField(blank=True, max_length=200)),
                ("instagram", models.URLField(blank=True, null=True)),
                ("x_twitter", models.URLField(blank=True, null=True)),
                ("facebook", models.URLField(blank=True, null=True)),
                ("youtube", models.URLField(blank=True, null=True)),
                ("tiktok", models.URLField(blank=True, null=True)),
                ("contact_email", models.EmailField(blank=True, max_length=254, null=True)),
                ("contact_phone", models.CharField(blank=True, max_length=50, null=True)),
                ("address", models.TextField(blank=True, null=True)),
                ("default_seo_title", models.CharField(blank=True, max_length=255, null=True)),
                ("default_seo_description", models.TextField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("logo", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="+", to="media_library.mediaasset")),
            ],
        ),
        migrations.CreateModel(
            name="NavigationMenu",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("code", models.SlugField(unique=True)),
                ("title", models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name="Page",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("status", models.CharField(choices=[("draft", "Draft"), ("review", "Review"), ("published", "Published"), ("archived", "Archived")], default="draft", max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("published_at", models.DateTimeField(blank=True, null=True)),
                ("title", models.CharField(max_length=200)),
                ("slug", models.SlugField(unique=True)),
                ("excerpt", models.TextField(blank=True, null=True)),
                ("content", models.JSONField(default=list)),
                ("is_homepage", models.BooleanField(default=False)),
                ("hero_enabled", models.BooleanField(default=False)),
                ("hero_cta_label", models.CharField(blank=True, max_length=120, null=True)),
                ("hero_cta_url", models.URLField(blank=True, null=True)),
                ("seo_title", models.CharField(blank=True, max_length=255, null=True)),
                ("seo_description", models.TextField(blank=True, null=True)),
                ("canonical_url", models.URLField(blank=True, null=True)),
                ("og_title", models.CharField(blank=True, max_length=255, null=True)),
                ("og_description", models.TextField(blank=True, null=True)),
                ("cover_image", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="+", to="media_library.mediaasset")),
                ("hero_asset", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="+", to="media_library.mediaasset")),
                ("hero_image", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="+", to="media_library.mediaasset")),
            ],
            options={"ordering": ["title"]},
        ),
        migrations.CreateModel(
            name="NavigationItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("label", models.CharField(max_length=200)),
                ("url", models.CharField(max_length=500)),
                ("order", models.PositiveIntegerField(default=0)),
                ("children", models.ManyToManyField(blank=True, related_name="parent_items", to="cms.navigationitem")),
                ("menu", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="items", to="cms.navigationmenu")),
            ],
            options={"ordering": ["order", "label"]},
        ),
    ]
