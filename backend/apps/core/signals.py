from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Version

@receiver(pre_save)
def snapshot(sender, instance, **kwargs):
    if not hasattr(instance, "id") or not instance.id:
        return
    Version.objects.create(
        entity=sender.__name__,
        entity_id=instance.id,
        payload=instance.__dict__,
    )
