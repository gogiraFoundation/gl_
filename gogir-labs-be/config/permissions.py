"""Shared DRF permissions."""

from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsStaffOrReadOnly(BasePermission):
    """Allow public reads. Writes require a staff user.

    Portfolio content is edited in Django admin. A normal authenticated
    account must not be able to create, change, or delete it.
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        return bool(user and user.is_authenticated and user.is_staff)
