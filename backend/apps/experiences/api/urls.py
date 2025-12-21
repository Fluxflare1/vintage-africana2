from django.urls import path
from .views import experiences, experience_detail

urlpatterns = [
    path("experiences/", experiences),
    path("experiences/<str:slug>/", experience_detail),
]
