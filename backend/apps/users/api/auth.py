from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


@csrf_exempt
def admin_login(request):
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON"}, status=400)

    username = data.get("username", "")
    password = data.get("password", "")

    user = authenticate(request, username=username, password=password)
    if not user:
        return JsonResponse({"detail": "Invalid credentials"}, status=400)

    if not user.is_staff:
        return JsonResponse({"detail": "Not authorized"}, status=403)

    login(request, user)
    return JsonResponse({"ok": True})


def admin_logout(request):
    logout(request)
    return JsonResponse({"ok": True})


def admin_me(request):
    if not request.user.is_authenticated:
        return JsonResponse({"authenticated": False}, status=200)

    return JsonResponse(
        {
            "authenticated": True,
            "username": request.user.get_username(),
            "is_staff": request.user.is_staff,
        }
    )
