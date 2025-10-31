from rest_framework import generics
from rest_framework.response import Response
from django.http import JsonResponse
from datetime import datetime, timedelta

from ..models import CurrentHot100, SongTimeline
from ..serializers import CurrentHot100Serializer


class CurrentHot100View(generics.ListAPIView):
    serializer_class = CurrentHot100Serializer

    def get_queryset(self):
        return CurrentHot100.objects.all().order_by('current_position')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        latest_chart = queryset.first()
        chart_date = latest_chart.chart_date if latest_chart else None

        serializer = self.get_serializer(queryset, many=True)

        return Response({
            'chart_date': chart_date,
            'songs': serializer.data
        })
    
def historic_chart(request, date_str):
    """API endpoint: Get Billboard Hot 100 for a specific week with movement data"""
    
    try:
        # Parse the date string (format: YYYY-MM-DD)
        chart_date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return JsonResponse({'error': 'Invalid date format'}, status=400)
    
    # Try the exact date first
    chart_entries = SongTimeline.objects.filter(
        chart_date=chart_date_obj
    ).select_related('song').order_by('rank')[:100]
    
    # If no chart for this date, find the most recent chart before this date
    if not chart_entries.exists():
        closest_chart = SongTimeline.objects.filter(
            chart_date__lte=chart_date_obj
        ).values_list('chart_date', flat=True).distinct().order_by('-chart_date').first()
        
        if closest_chart:
            chart_entries = SongTimeline.objects.filter(
                chart_date=closest_chart
            ).select_related('song').order_by('rank')[:100]
            chart_date_obj = closest_chart
    
    if not chart_entries.exists():
        return JsonResponse({'error': 'No chart found'}, status=404)
    
    # Get previous week's chart for comparison
    previous_week_date = chart_date_obj - timedelta(days=7)
    previous_entries = {
        entry.song_id: entry.rank 
        for entry in SongTimeline.objects.filter(chart_date=previous_week_date)
    }
    
    # Serialize the data with movement info
    entries_data = []
    for entry in chart_entries:
        previous_rank = previous_entries.get(entry.song_id)
        
        # Determine if new or calculate movement
        if previous_rank is None:
            movement = None
            is_new = True
        else:
            movement = previous_rank - entry.rank  # Positive = moved up
            is_new = False
        
        entries_data.append({
            'position': entry.rank,
            'title': entry.song.title,
            'artist': entry.song.artist,
            'slug': entry.song.slug,
            'peak_rank': entry.song.peak_rank,
            'weeks_on_chart': entry.song.weeks_on_chart,
            'year': entry.song.year,
            'previous_rank': previous_rank,
            'movement': movement,
            'is_new': is_new,
        })
    
    data = {
        'chart_date': str(chart_date_obj),
        'requested_date': date_str,
        'entries': entries_data
    }
    
    return JsonResponse(data)

def chart_dates(request):
    """API endpoint: Get all unique chart dates"""
    dates = SongTimeline.objects.values_list('chart_date', flat=True).distinct().order_by('chart_date')
    
    # Convert to list of strings
    date_list = [str(date) for date in dates]
    
    return JsonResponse({'dates': date_list})