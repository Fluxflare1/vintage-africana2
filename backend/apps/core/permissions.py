from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """
    Allows access only to authenticated admin/staff users.

    Works with:
    - Django's built-in `is_staff`
    - Custom user models that implement `is_admin` (bool) OR `is_admin()` (callable)
    """

    message = "Admin access required."

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if not user or not getattr(user, "is_authenticated", False):
            return False

        # Prefer standard Django admin flag
        if getattr(user, "is_staff", False) or getattr(user, "is_superuser", False):
            return True

        # Support custom user models that may use `is_admin` or `is_admin()`
        is_admin_attr = getattr(user, "is_admin", None)
        if callable(is_admin_attr):
            try:
                return bool(is_admin_attr())
            except TypeError:
                return False
        return bool(is_admin_attr)
