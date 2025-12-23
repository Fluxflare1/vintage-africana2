from django.urls import path
from .auth_views import csrf, session_login, session_logout, me

urlpatterns = [
    path("csrf/", csrf, name="auth-csrf"),
    path("login/", session_login, name="auth-login"),
    path("logout/", session_logout, name="auth-logout"),
    path("me/", me, name="auth-me"),
]
