from django.urls import path
from .views import categories, items_by_category, item_detail

urlpatterns = [
    path("collections/", categories),
    path("collections/<str:category_slug>/", items_by_category),
    path("collections/<str:category_slug>/<str:item_slug>/", item_detail),
]
