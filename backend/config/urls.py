from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Admin site customizations (kept; NOT a custom admin app)
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
    path("api/", include("apps.users.api.urls")),
    path("api/", include("apps.cms.api.admin_urls")),
    path("api/", include("apps.cms.api.admin_nav_urls")),
    path("api/", include("apps.media_library.api.admin_urls")),
    path("api/", include("apps.media_library.api.urls")),
    path("api/", include("apps.cms.api.setup_urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)




