from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404

from ..models import Song, Artist
from ..serializers import ArtistDetailSerializer, SongSerializer
from .pagination import ArtistPagination
import random


class ArtistDetailView(generics.RetrieveAPIView):
    """
    API endpoint to get detailed artist information by slug
    Returns artist bio, tags, members, billboard stats, etc.
    """
    queryset = Artist.objects.all()
    serializer_class = ArtistDetailSerializer
    lookup_field = 'slug'


class ArtistListView(APIView):
    """List all artists with their hit count"""

    def get(self, request):
        letter = request.query_params.get('letter', None)

        artists = Artist.objects.filter(
            songs__isnull=False
        ).distinct()

        if letter and len(letter) == 1:
            artists = artists.filter(name__istartswith=letter)

        artists = artists.order_by('name', 'id')

        paginator = ArtistPagination()
        paginated_artists = paginator.paginate_queryset(artists, request)

        artists_data = []
        for artist in paginated_artists:
            artists_data.append({
                'id': artist.id,
                'name': artist.name,
                'slug': artist.slug,
                'image': f'/media/{artist.image}' if artist.image else None,
                'total_hits': artist.songs.count(),
                'nationality': artist.nationality,
                'artist_type': artist.artist_type,
            })

        return paginator.get_paginated_response(artists_data)


@api_view(['GET'])
def featured_artists(request):
    """Get random artists with images for homepage"""
    artists_with_images = Artist.objects.exclude(image='')

    artists_list = []
    for artist in artists_with_images:
        image_url = None
        if artist.image:
            image_url = request.build_absolute_uri(artist.image.url)

        artists_list.append({
            'id': artist.id,
            'name': artist.name,
            'slug': artist.slug,
            'image': image_url
        })

    random.shuffle(artists_list)
    return Response(artists_list[:25])
