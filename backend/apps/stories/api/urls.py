from django.urls import path
from .views import tags, categories, stories, story_detail

urlpatterns = [
    path("stories/tags/", tags),
    path("stories/categories/", categories),
    path("stories/", stories),
    path("stories/<str:slug>/", story_detail),
]
