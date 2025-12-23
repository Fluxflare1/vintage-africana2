from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status


@api_view(["GET"])
@permission_classes([AllowAny])
def csrf(request):
    """
    Sets/returns CSRF token. Call this BEFORE login from the browser.
    """
    token = get_token(request)
    return Response({"csrfToken": token})


@api_view(["POST"])
@permission_classes([AllowAny])
def session_login(request):
    """
    POST JSON: { "username": "...", "password": "..." }
    Requires CSRF (X-CSRFToken header + csrftoken cookie).
    """
    username = (request.data.get("username") or "").strip()
    password = request.data.get("password") or ""

    if not username or not password:
        return Response({"detail": "username and password required."}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)
    if not user:
        return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

    login(request, user)

    return Response(
        {
            "id": user.id,
            "username": user.get_username(),
            "is_staff": bool(user.is_staff),
            "is_superuser": bool(user.is_superuser),
        }
    )


@api_view(["POST"])
def session_logout(request):
    logout(request)
    return Response({"detail": "Logged out."})


@api_view(["GET"])
def me(request):
    """
    Used by Next.js middleware to check if user is logged in.
    """
    u = request.user
    if not u or not u.is_authenticated:
        return Response({"detail": "Not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)

    return Response(
        {
            "id": u.id,
            "username": u.get_username(),
            "is_staff": bool(u.is_staff),
            "is_superuser": bool(u.is_superuser),
        }
    )
