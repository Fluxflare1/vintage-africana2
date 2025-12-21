from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import Group, Permission
from django.apps import apps


@receiver(post_migrate)
def ensure_default_groups(sender, **kwargs):
    # Only run once for this project
    if sender.name != "apps.users":
        return

    editors, _ = Group.objects.get_or_create(name="Editors")
    publishers, _ = Group.objects.get_or_create(name="Publishers")

    targets = [
        ("cms", "page", ["add", "change", "delete", "view"], ["can_publish_page"]),
        ("stories", "story", ["add", "change", "delete", "view"], ["can_publish_story"]),
        ("collections", "vintageitem", ["add", "change", "delete", "view"], ["can_publish_vintageitem"]),
        ("experiences", "experience", ["add", "change", "delete", "view"], ["can_publish_experience"]),
        ("media_library", "mediaasset", ["add", "change", "delete", "view"], []),
    ]

    def perm(codename):
        return Permission.objects.filter(codename=codename).first()

    # Editors: CRUD without publish perms
    editor_perms = []
    publisher_extra = []

    for app_label, model, crud, extra in targets:
        for action in crud:
            p = perm(f"{action}_{model}")
            if p:
                editor_perms.append(p)
        for ex in extra:
            p = perm(ex)
            if p:
                publisher_extra.append(p)

    editors.permissions.set(editor_perms)

    # Publishers: everything editors can do + publish perms
    publishers.permissions.set(editor_perms + publisher_extra)
