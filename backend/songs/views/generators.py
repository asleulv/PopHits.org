from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
import random

from ..models import Song
from ..serializers import SongSerializer


class PlaylistGeneratorView(APIView):
    """
    API View to generate a playlist of random songs based on the number of songs,
    hit level (1 for top hits, 10 for more obscure hits), and selected decades.
    """

    def get(self, request):
        try:
            num_songs = int(request.GET.get('number_of_songs', 10))
            hit_level = int(request.GET.get('hit_size', 1))
            decades = request.GET.getlist('decades', [])

            rank_cutoffs = {
                1: 1, 2: 3, 3: 5, 4: 10, 5: 20,
                6: 30, 7: 50, 8: 60, 9: 80, 10: 100
            }
            max_peak_rank = rank_cutoffs.get(hit_level, 100)

            filtered_songs = Song.objects.filter(
                peak_rank__lte=max_peak_rank,
                spotify_url__isnull=False
            ).exclude(spotify_url='')

            if not decades:
                return Response({'detail': 'Decades parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

            decade_filters = Q()
            for decade in decades:
                try:
                    start_year = int(decade)
                    end_year = start_year + 9
                    decade_filters |= Q(year__gte=start_year, year__lte=end_year)
                except ValueError:
                    return Response({'detail': 'Invalid decade format.'}, status=status.HTTP_400_BAD_REQUEST)

            filtered_songs = filtered_songs.filter(decade_filters)

            if len(filtered_songs) == 0:
                return Response({'detail': 'No songs match the criteria.'}, status=status.HTTP_404_NOT_FOUND)

            song_list = random.sample(list(filtered_songs), min(num_songs, len(filtered_songs)))

            serializer = SongSerializer(song_list, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'detail': 'An error occurred while processing your request.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class QuizGeneratorView(APIView):
    """
    API View to generate quiz questions based on the number of songs,
    hit level (1 for top hits, 10 for more obscure hits), and selected decades.
    Each question asks for the artist of a song.
    """

    def get(self, request):
        try:
            num_songs = int(request.GET.get('number_of_songs', 10))
            hit_level = int(request.GET.get('hit_size', 1))
            decades = request.GET.getlist('decades', [])

            rank_cutoffs = {
                1: 1, 2: 3, 3: 5, 4: 10, 5: 20,
                6: 30, 7: 50, 8: 60, 9: 80, 10: 100
            }
            max_peak_rank = rank_cutoffs.get(hit_level, 100)

            filtered_songs = Song.objects.filter(
                peak_rank__lte=max_peak_rank,
                spotify_url__isnull=False
            ).exclude(spotify_url='')

            if not decades:
                return Response({'detail': 'Decades parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

            decade_filters = Q()
            for decade in decades:
                try:
                    start_year = int(decade)
                    end_year = start_year + 9
                    decade_filters |= Q(year__gte=start_year, year__lte=end_year)
                except ValueError:
                    return Response({'detail': 'Invalid decade format.'}, status=status.HTTP_400_BAD_REQUEST)

            filtered_songs = filtered_songs.filter(decade_filters)

            if len(filtered_songs) == 0:
                return Response({'detail': 'No songs match the criteria.'}, status=status.HTTP_404_NOT_FOUND)

            song_list = random.sample(list(filtered_songs), min(num_songs, len(filtered_songs)))

            quiz_questions = [
                {
                    "question": f"Who had a hit with '{song.title}' in {song.year} peaking at #{song.peak_rank}?",
                    "answer": song.artist
                }
                for song in song_list
            ]

            return Response(quiz_questions, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'detail': 'An error occurred while processing your request.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
