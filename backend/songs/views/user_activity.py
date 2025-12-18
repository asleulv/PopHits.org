from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Max, F, Case, When
from ..models.song import Song
from ..serializers import SongSerializer

class TrendingArchiveView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        limit = int(request.query_params.get('limit', 100))
        
        # 1. Calculate the latest activity first
        # We find the Max rating ID for each song that meets our 7.0 "Hit" criteria
        trending_data = Song.objects.annotate(
            latest_rating_id=Max('usersongrating__id')
        ).filter(
            latest_rating_id__isnull=False,
            average_user_score__gte=7.0
        ).annotate(
            latest_score_val=F('usersongrating__score'),
            latest_rater_val=F('usersongrating__user__username'),
            latest_time_val=F('usersongrating__created_at')
        ).order_by('-latest_time_val').values(
            'id', 'latest_score_val', 'latest_rater_val', 'latest_time_val'
        )[:limit]
        
        # 2. Map the data so we can attach it to the Song objects later
        song_ids = [item['id'] for item in trending_data]
        activity_map = {
            item['id']: {
                'score': item['latest_score_val'],
                'rater': item['latest_rater_val'],
                'time': item['latest_time_val']
            } for item in trending_data
        }
        
        # 3. Fetch the actual Song objects in the correct trending order
        preserved = Case(*[When(pk=pk, then=pos) for pos, pk in enumerate(song_ids)])
        final_qs = Song.objects.filter(id__in=song_ids).order_by(preserved)
        
        # 4. Attach the activity data back to each Song object
        for song in final_qs:
            data = activity_map.get(song.id, {})
            song.latest_score = data.get('score')
            song.latest_rater = data.get('rater')
            song.latest_time = data.get('time')
        
        serializer = SongSerializer(final_qs, many=True)
        return Response(serializer.data)