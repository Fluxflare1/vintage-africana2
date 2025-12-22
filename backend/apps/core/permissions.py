from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """
    Allows access only to authenticated admin users.
    """

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return bool(user and user.is_authenticated and getattr(user, "is_admin", False))
