from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
import datetime

from ..models import Song, NumberOneSong
from ..serializers import SongSerializer


from django.db.models import F, FloatField
from django.db.models.functions import Cast
from rest_framework.views import APIView
from rest_framework.response import Response

class TopRatedSongsView(APIView):
    def get(self, request):
        limit = int(request.GET.get('limit', 10))
        limit = max(1, min(limit, 100))

        # TUNING CONSTANTS
        # m = The 'confidence' factor. 
        # Increase this to make it harder for songs with few votes to reach the top.
        m = 2.0 
        
        # C = The "Global Average". 
        # If your site is mostly positive, use 7.0. If you are strict, use 5.0.
        C = 7.0

        top_rated_songs = Song.objects.filter(total_ratings__gt=0).annotate(
            # Bayesian Weighted Rating Formula
            weighted_score=(
                (F('total_ratings') * F('average_user_score')) + (m * C)
            ) / (F('total_ratings') + m)
        ).order_by('-weighted_score')[:limit]

        serializer = SongSerializer(top_rated_songs, many=True)
        return Response(serializer.data)


class RandomSongsByDecadeView(APIView):
    serializer_class = SongSerializer

    def get(self, request, *args, **kwargs):
        current_year = datetime.datetime.now().year
        decades = [(year, year + 9) for year in range(1950, current_year, 10)]

        random_songs_by_decade = []
        for start_year, end_year in decades:
            sample_size = 100
            sample_songs = Song.objects.filter(
                year__gte=start_year,
                year__lte=end_year,
                spotify_url__isnull=False
            ).exclude(spotify_url='').values('id').order_by('?')[:sample_size]

            random_song_ids = [song['id'] for song in sample_songs]
            if random_song_ids:
                random_song = Song.objects.filter(id__in=random_song_ids).order_by('?').first()
                random_songs_by_decade.append(random_song)

        serializer = self.serializer_class(random_songs_by_decade, many=True)
        return Response(serializer.data)


class NumberOneSongsView(generics.ListAPIView):
    queryset = NumberOneSong.objects.all()
    serializer_class = SongSerializer

    @method_decorator(cache_page(24 * 3600))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
