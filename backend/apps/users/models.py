from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model (swapped in via AUTH_USER_MODEL).

    IMPORTANT:
    - Do NOT redefine `groups` or `user_permissions` here.
      AbstractUser already defines them properly.
    """

    # optional fields (safe to keep/remove as you like)
    phone = models.CharField(max_length=32, blank=True, default="")

    def is_admin(self) -> bool:
        # used by your IsAdmin permission
        return bool(self.is_staff or self.is_superuser)

    def __str__(self):
        return self.get_username()
