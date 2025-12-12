from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from django.db.models import Count, Prefetch


from ..models import Artist, ArtistRelationship
from ..serializers import ArtistDetailSerializer, SongSerializer
from .pagination import ArtistPagination
import random

class ArtistDetailView(generics.RetrieveAPIView):
    """
    API endpoint to get detailed artist information by slug
    Returns artist bio, tags, members, billboard stats, etc.
    """
    serializer_class = ArtistDetailSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        return Artist.objects.prefetch_related(
            'artisttagrelation_set__tag',
            Prefetch(
                'relationships_to',  # Changed from 'to_relationships'
                queryset=ArtistRelationship.objects.select_related('from_artist')
            ),
            Prefetch(
                'relationships_from',  # Changed from 'from_relationships'
                queryset=ArtistRelationship.objects.select_related('to_artist')
            ),
            'songs'  # For billboard_stats
        )


class ArtistListView(APIView):
    """List all artists with their hit count"""

    def get(self, request):
        letter = request.query_params.get('letter', None)

        # Annotate with hit count in the main query instead of counting per artist
        artists = Artist.objects.filter(
            songs__isnull=False
        ).annotate(
            total_hits=Count('songs')
        ).distinct()

        if letter and len(letter) == 1:
            artists = artists.filter(name__istartswith=letter)

        artists = artists.order_by('name', 'id')

        paginator = ArtistPagination()
        paginated_artists = paginator.paginate_queryset(artists, request)

        # Build response using annotated field
        artists_data = []
        for artist in paginated_artists:
            artists_data.append({
                'id': artist.id,
                'name': artist.name,
                'slug': artist.slug,
                'image': f'/media/{artist.image}' if artist.image else None,
                'total_hits': artist.total_hits,  # Use annotated field instead of .count()
                'nationality': artist.nationality,
                'artist_type': artist.artist_type,
            })

        return paginator.get_paginated_response(artists_data)


@api_view(['GET'])
def featured_artists(request):
    """Get random artists with images for homepage"""
    
    # Only fetch needed fields and limit to 25 in database
    artists = Artist.objects.exclude(
        image=''
    ).only(
        'id', 'name', 'slug', 'image'
    ).order_by('?')[:25]
    
    artists_list = []
    for artist in artists:
        image_url = None
        if artist.image:
            image_url = request.build_absolute_uri(artist.image.url)
        
        artists_list.append({
            'id': artist.id,
            'name': artist.name,
            'slug': artist.slug,
            'image': image_url
        })
    
    return Response(artists_list)
