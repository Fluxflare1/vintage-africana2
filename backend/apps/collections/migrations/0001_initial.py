from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("media_library", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="CollectionCategory",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=200)),
                ("slug", models.SlugField(unique=True)),
                ("description", models.TextField(blank=True, null=True)),
                ("cover_image", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="+", to="media_library.mediaasset")),
            ],
            options={"ordering": ["name"]},
        ),
        migrations.CreateModel(
            name="VintageItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=200)),
                ("slug", models.SlugField()),
                ("short_description", models.TextField(blank=True, null=True)),
                ("story", models.JSONField(default=list)),
                ("item_type", models.CharField(blank=True, max_length=120, null=True)),
                ("brand", models.CharField(blank=True, max_length=120, null=True)),
                ("model", models.CharField(blank=True, max_length=120, null=True)),
                ("year", models.PositiveIntegerField(blank=True, null=True)),
                ("era_label", models.CharField(blank=True, max_length=120, null=True)),
                ("origin_country", models.CharField(blank=True, max_length=120, null=True)),
                ("condition", models.CharField(blank=True, max_length=120, null=True)),
                ("category", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="items", to="collections.collectioncategory")),
                ("cover_image", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="+", to="media_library.mediaasset")),
            ],
            options={"ordering": ["name"], "unique_together": {("category", "slug")}},
        ),
        migrations.CreateModel(
            name="VintageItemMedia",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("caption", models.CharField(blank=True, max_length=200, null=True)),
                ("asset", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="+", to="media_library.mediaasset")),
                ("item", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="media", to="collections.vintageitem")),
            ],
            options={"ordering": ["id"]},
        ),
    ]
