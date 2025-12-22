from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="MediaAsset",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("type", models.CharField(choices=[("image", "Image"), ("video", "Video"), ("audio", "Audio"), ("document", "Document")], default="image", max_length=20)),
                ("title", models.CharField(blank=True, max_length=200)),
                ("alt_text", models.CharField(blank=True, max_length=200)),
                ("file", models.FileField(blank=True, null=True, upload_to="media_assets/")),
                ("external_url", models.URLField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"ordering": ["-created_at"]},
        ),
    ]
