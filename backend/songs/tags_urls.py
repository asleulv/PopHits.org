# songs/tags_urls.py
from django.urls import path
from .views import TagDetailView, TagListView

urlpatterns = [
    # This matches /api/tags/
    path('', TagListView.as_view(), name='tag-list'), 
    
    # This matches /api/tags/<slug>/
    path('<slug:slug>/', TagDetailView.as_view(), name='tag-detail'),
]