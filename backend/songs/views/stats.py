from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Count, Avg, Sum

from ..models import Song, Artist


class ArtistStatsView(APIView):
    """Get artist statistics (decade breakdown, peak distribution, etc.)"""

    def get_object(self):
        slug = self.kwargs.get('slug')
        return get_object_or_404(Artist, slug=slug)

    def get(self, request, slug):
        artist = get_object_or_404(Artist, slug=slug)
        stats_type = request.GET.get('type')

        if stats_type == 'peaks':
            return self.get_peak_distribution(artist)
        elif stats_type == 'decades':
            return self.get_decade_breakdown(artist)
        else:
            return Response({'detail': 'Invalid stats type. Use "peaks" or "decades"'}, status=400)

    def get_peak_distribution(self, artist):
        """Get breakdown: #1s, top 5, top 10, etc."""
        songs = Song.objects.filter(artist_fk=artist)

        distribution = {
            '#1': songs.filter(peak_rank=1).count(),
            'top_5': songs.filter(peak_rank__lte=5).count(),
            'top_10': songs.filter(peak_rank__lte=10).count(),
            'top_50': songs.filter(peak_rank__lte=50).count(),
            'lower': songs.filter(peak_rank__gt=50).count(),
        }
        return Response(distribution)

    def get_decade_breakdown(self, artist):
        """Get hits by decade with stats"""
        songs = Song.objects.filter(artist_fk=artist)

        decades = {}
        for decade_start in range(1950, 2030, 10):
            decade_end = decade_start + 9
            decade_key = f"{decade_start}s"

            decade_songs = songs.filter(year__gte=decade_start, year__lte=decade_end)
            count = decade_songs.count()

            if count > 0:
                total_weeks = decade_songs.aggregate(Sum('weeks_on_chart'))['weeks_on_chart__sum'] or 0
                avg_peak = decade_songs.aggregate(Avg('peak_rank'))['peak_rank__avg'] or 0

                decades[decade_key] = {
                    'hits': count,
                    'total_weeks': total_weeks,
                    'avg_peak': round(avg_peak, 2)
                }

        return Response(decades)
