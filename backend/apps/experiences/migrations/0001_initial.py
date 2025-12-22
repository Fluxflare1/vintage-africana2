from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("core", "0001_initial"),
        ("media_library", "0001_initial"),
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Experience",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("status", models.CharField(choices=[("draft", "Draft"), ("review", "Review"), ("published", "Published"), ("archived", "Archived")], default="draft", max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("published_at", models.DateTimeField(blank=True, null=True)),
                ("title", models.CharField(max_length=250)),
                ("slug", models.SlugField(unique=True)),
                ("type", models.CharField(choices=[("event", "Event"), ("tour", "Tour"), ("exhibition", "Exhibition"), ("workshop", "Workshop"), ("other", "Other")], default="event", max_length=20)),
                ("summary", models.TextField(blank=True, null=True)),
                ("details", models.JSONField(default=list)),
                ("starts_at", models.DateTimeField(blank=True, null=True)),
                ("ends_at", models.DateTimeField(blank=True, null=True)),
                ("location", models.CharField(blank=True, max_length=200, null=True)),
                ("booking_url", models.URLField(blank=True, null=True)),
                ("is_featured", models.BooleanField(default=False)),
                ("owner", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="experiences", to=settings.AUTH_USER_MODEL)),
                ("cover_image", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="+", to="media_library.mediaasset")),
                ("tags", models.ManyToManyField(blank=True, related_name="experiences", to="core.tag")),
            ],
            options={"ordering": ["-starts_at", "-created_at"]},
        ),
    ]
