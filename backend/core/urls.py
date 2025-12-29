from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.urls import re_path
from django.views.generic import TemplateView

urlpatterns = [
    path(settings.ADMIN_URL, admin.site.urls),
    path('api/', include('users.urls')),
    path('api/songs/', include('songs.urls')),
    path('api/artists/', include('songs.artists_urls')),
    path('api/tags/', include('songs.tags_urls')),
    path('api/blog/', include('blog.urls')),
    path('tinymce/', include('tinymce.urls')),  # Add TinyMCE URLs
    path('', TemplateView.as_view(template_name='index.html')),  # Root URL
    re_path(r'^.*/$', TemplateView.as_view(template_name='index.html')),  # Catch-all pattern
]

if settings.DEBUG:
  urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
  urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
