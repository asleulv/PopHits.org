from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from random import randint

from ..models import Song, UserSongComment
from ..serializers import SongSerializer, UserSongCommentSerializer
from .pagination import CustomPagination


class SongListCreateView(generics.ListCreateAPIView):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        search_query = self.request.GET.get('search', None)

        # Apply search query
        if search_query:
            queryset = queryset.filter(title__icontains=search_query) | queryset.filter(artist__icontains=search_query)

        # Apply artist and year filters
        artist_slug = self.request.GET.get('artist')
        year = self.request.GET.get('year')

        if artist_slug:
            queryset = queryset.filter(artist_slug=artist_slug)

        if year:
            queryset = queryset.filter(year=year)

        # Apply peak rank filter
        peak_rank_filter = self.request.GET.get('peak_rank')
        if peak_rank_filter:
            try:
                if peak_rank_filter.lower() == 'top_10':
                    queryset = queryset.filter(peak_rank__lte=10)
                elif peak_rank_filter.lower() == 'number_one':
                    queryset = queryset.filter(peak_rank=1)
                else:
                    max_rank = int(peak_rank_filter)
                    queryset = queryset.filter(peak_rank__lte=max_rank)
            except ValueError:
                pass

        # Apply unrated filter - only show songs the user hasn't rated yet
        unrated_only = self.request.GET.get('unrated_only', 'false').lower() == 'true'
        if unrated_only and self.request.user.is_authenticated:
            from ..models import UserSongRating
            rated_song_ids = UserSongRating.objects.filter(
                user=self.request.user
            ).values_list('song_id', flat=True)
            queryset = queryset.exclude(id__in=rated_song_ids)

        # Apply decade filter
        decade = self.request.GET.get('decade')
        if decade:
            try:
                decade_start = int(decade)
                decade_end = decade_start + 9
                queryset = queryset.filter(year__gte=decade_start, year__lte=decade_end)
            except ValueError:
                pass

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        # Apply sorting
        sort_by = request.GET.get('sort_by', 'id')
        order = request.GET.get('order', 'asc')
        if order == 'asc':
            queryset = queryset.order_by(sort_by)
        else:
            queryset = queryset.order_by(f'-{sort_by}')

        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class SongDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SongSerializer

    def get_queryset(self):
        return Song.objects.all()

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        comments = UserSongComment.objects.filter(song=instance)
        comment_serializer = UserSongCommentSerializer(comments, many=True)
        data = serializer.data
        data['comments'] = comment_serializer.data
        return Response(data)


class SongDetailBySlugView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SongSerializer

    def get_queryset(self):
        return Song.objects.all()

    def get_object(self):
        slug = self.kwargs.get('slug', None)
        queryset = self.get_queryset()
        return get_object_or_404(queryset, slug=slug)

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        comments = UserSongComment.objects.filter(song=instance)
        comment_serializer = UserSongCommentSerializer(comments, many=True)

        description = f"{instance.title} entered the Hot 100 in {instance.year} spending {instance.weeks_on_chart} weeks on the charts with #{instance.peak_rank} being its highest position."

        data = serializer.data
        data['description'] = description
        data['comments'] = comment_serializer.data

        return Response(data)


class RandomSongView(APIView):
    serializer_class = SongSerializer

    def get(self, request, *args, **kwargs):
        song_count = Song.objects.count()
        random_index = randint(0, song_count - 1)
        random_song = Song.objects.all()[random_index]
        serializer = self.serializer_class(random_song)
        return Response(serializer.data)


class SongsWithImagesView(generics.ListAPIView):
    serializer_class = SongSerializer

    def get_queryset(self):
        return Song.objects.exclude(image_upload='').exclude(image_upload__isnull=True)


@api_view(['GET'])
def random_song_by_artist(request):
    """Get a random song by artist slug - optimized endpoint"""
    artist_slug = request.query_params.get('artist_slug')

    if not artist_slug:
        return Response({'error': 'artist_slug required'}, status=400)

    song = Song.objects.filter(
        artist_fk__slug=artist_slug
    ).values(
        'id', 'title', 'year', 'peak_rank', 'weeks_on_chart',
        'average_user_score', 'slug', 'artist_slug', 'is_original_recording'
    ).order_by('?').first()

    if not song:
        return Response({'detail': 'Not found'}, status=404)

    return Response(song)
