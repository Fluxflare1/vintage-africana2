from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Admin site customizations
admin.site.site_header = "Vintage Africana Admin"
admin.site.site_title = "Vintage Africana Admin"
admin.site.index_title = "Dashboard"

urlpatterns = [
    path("admin/", admin.site.urls),
    
    # API endpoints
    path("api/", include("apps.core.urls")),
    path("api/", include("apps.cms.api.urls")),
    path("api/", include("apps.collections.api.urls")),
    path("api/", include("apps.stories.api.urls")),
    path("api/", include("apps.experiences.api.urls")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
