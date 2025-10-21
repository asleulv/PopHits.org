from django.urls import path
from .views import ArtistDetailView, ArtistListView 

urlpatterns = [
    path('', ArtistListView.as_view(), name='artist-list'),  
    path('<slug:slug>/', ArtistDetailView.as_view(), name='artist-detail'),
]
