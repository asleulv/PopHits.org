# songs/tags_urls.py
from django.urls import path
from .views import TagDetailView

urlpatterns = [
    # This matches /api/tags/<slug>/ because of the 'api/tags/' prefix in core/urls.py
    path('<slug:slug>/', TagDetailView.as_view(), name='tag-detail'),
]