from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.urls import re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')), 
    path('api/songs/', include('songs.urls')),
    path('', TemplateView.as_view(template_name='index.html')),
]

if settings.DEBUG:
  urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)