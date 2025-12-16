from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication

from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from django.db.models import Max, Min, Q
import random
from random import randint

from ..permissions import IsInternalServer
from ..models import Song, UserSongComment, SongTimeline, UserSongRating
from ..serializers import SongSerializer, UserSongCommentSerializer, SongTimelineSerializer
from .pagination import CustomPagination

class SongListCreateView(generics.ListCreateAPIView):
    serializer_class = SongSerializer
    pagination_class = CustomPagination

    authentication_classes = [TokenAuthentication]  # Change this
    permission_classes = [IsInternalServer]  # Keep this the same

    def get_queryset(self):
        # Optimize with select_related and prefetch_related to avoid N+1 queries
        queryset = Song.objects.select_related(
            'artist_fk'  # For artist data lookups
        ).prefetch_related(
            'tag_relations__tag'  # For the get_tags() method in serializer
        )

        search_query = self.request.GET.get('search', None)
        # Apply search query
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) | Q(artist__icontains=search_query)
            )

        # Apply artist and year filters
        artist_slug = self.request.GET.get('artist')
        year = self.request.GET.get('year')
        if artist_slug:
            queryset = queryset.filter(artist_slug=artist_slug)
        if year:
            queryset = queryset.filter(year=year)

        # Apply tag filter
        tag_slug = self.request.GET.get('tag')
        if tag_slug:
            queryset = queryset.filter(
                tag_relations__tag__slug=tag_slug
            ).distinct()

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

        # Optimized unrated filter - push logic to database instead of loading IDs into memory
        unrated_only = self.request.GET.get('unrated_only', 'false').lower() == 'true'
        if unrated_only and self.request.user.is_authenticated:
            queryset = queryset.exclude(
                usersongrating__user=self.request.user
            ).distinct()

        # Apply decade filter
        decade = self.request.GET.get('decade')
        if decade:
            try:
                decade_start = int(decade)
                decade_end = decade_start + 9
                queryset = queryset.filter(year__gte=decade_start, year__lte=decade_end)
            except ValueError:
                pass

        # Apply sorting in get_queryset for better query optimization
        sort_by = self.request.GET.get('sort_by', 'id')
        order = self.request.GET.get('order', 'asc')
        order_field = sort_by if order == 'asc' else f'-{sort_by}'
        queryset = queryset.order_by(order_field)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)




class SongDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SongSerializer

    def get_queryset(self):
        # Prefetch tags for efficiency
        return Song.objects.all().prefetch_related(
            'tag_relations__tag'
        )

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        # Comments
        comments = UserSongComment.objects.filter(song=instance)
        comment_serializer = UserSongCommentSerializer(comments, many=True)

        # Tags (with visual metadata)
        tag_relations = instance.tag_relations.select_related('tag')
        tags_data = [
            {
                'name': rel.tag.name,
                'slug': rel.tag.slug,
                'color': rel.tag.color,
                'icon': rel.tag.lucide_icon,
                'category': rel.tag.category,
            }
            for rel in tag_relations
        ]

        data = serializer.data
        data['comments'] = comment_serializer.data
        data['tags'] = tags_data

        return Response(data)
    
class SongTimelineView(APIView):
    """
    API view to get the chart timeline for a song by ID or slug.
    """

    def get(self, request, *args, **kwargs):
        # Support lookup by ID or slug
        song_id = kwargs.get('pk')
        song_slug = kwargs.get('slug')

        if song_id:
            song = get_object_or_404(Song, pk=song_id)
        elif song_slug:
            song = get_object_or_404(Song, slug=song_slug)
        else:
            return Response({'detail': 'Song identifier (id or slug) required.'}, status=status.HTTP_400_BAD_REQUEST)

        timeline_qs = SongTimeline.objects.filter(song=song).order_by('chart_date')
        serializer = SongTimelineSerializer(timeline_qs, many=True)

        return Response({
            'song': {
            'id': song.id,
            'title': song.title,
            'artist': str(song.artist),  # safer string representation
            'slug': song.slug,
        },
            'timeline': serializer.data,
        })


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
    authentication_classes = []
    permission_classes = [IsInternalServer]
    serializer_class = SongSerializer

    def get(self, request, *args, **kwargs):
        max_id = Song.objects.aggregate(max_id=Max("id"))["max_id"]
        if not max_id:
            return Response({"detail": "No songs"}, status=404)

        for _ in range(5):
            pk = randint(1, max_id)
            song = Song.objects.filter(pk=pk).first()
            if song:
                serializer = self.serializer_class(song)
                return Response(serializer.data)

        return Response({"detail": "No songs"}, status=404)


class SongsWithImagesView(generics.ListAPIView):
    serializer_class = SongSerializer

    def get_queryset(self):
        return Song.objects.exclude(image_upload='').exclude(image_upload__isnull=True)


@api_view(['GET'])
def random_song_by_artist(request):
    """Get a random song by artist slug - optimized for huge tables"""
    artist_slug = request.query_params.get('artist_slug')
    if not artist_slug:
        return Response({'error': 'artist_slug required'}, status=400)

    # Get the min and max IDs for this artist
    qs = Song.objects.filter(artist_fk__slug=artist_slug)
    min_max = qs.aggregate(min_id=Min('id'), max_id=Max('id'))
    if not min_max['min_id']:
        return Response({'detail': 'Not found'}, status=404)

    # Try random IDs until we find one (handles gaps in IDs)
    for _ in range(10):  # up to 10 attempts
        random_id = random.randint(min_max['min_id'], min_max['max_id'])
        song = qs.filter(id__gte=random_id).values(
            'id', 'title', 'year', 'peak_rank', 'weeks_on_chart',
            'average_user_score', 'slug', 'artist_slug', 'is_original_recording'
        ).first()
        if song:
            return Response(song)

    # Fallback: pick the first song if random attempts fail
    song = qs.values(
        'id', 'title', 'year', 'peak_rank', 'weeks_on_chart',
        'average_user_score', 'slug', 'artist_slug', 'is_original_recording'
    ).first()
    return Response(song)