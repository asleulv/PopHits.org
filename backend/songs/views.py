from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.db.models.functions import Random
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from django.db.models import Q, Count
from django.core.cache import cache
from .models import Song, UserSongRating, UserSongComment, Bookmark, NumberOneSong, CurrentHot100, Artist
from .serializers import SongSerializer, UserSongCommentSerializer, CurrentHot100Serializer, ArtistDetailSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view
from random import randint, random
import random
import datetime

class CustomPagination(PageNumberPagination):
    page_size = 100  # Set the number of records per page
    page_size_query_param = 'page_size'
    max_page_size = 1000  # Set the maximum number of records per page

class ArtistDetailView(generics.RetrieveAPIView):
    """
    API endpoint to get detailed artist information by slug
    Returns artist bio, tags, members, billboard stats, etc.
    """
    queryset = Artist.objects.all()
    serializer_class = ArtistDetailSerializer
    lookup_field = 'slug'

# API VIEW: songlist
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
                # Invalid peak_rank_filter value
                pass
        
        # Apply unrated filter - only show songs the user hasn't rated yet
        unrated_only = self.request.GET.get('unrated_only', 'false').lower() == 'true'
        if unrated_only and self.request.user.is_authenticated:
            # Get the IDs of songs the user has already rated
            rated_song_ids = UserSongRating.objects.filter(
                user=self.request.user
            ).values_list('song_id', flat=True)
            
            # Exclude those songs from the queryset
            queryset = queryset.exclude(id__in=rated_song_ids)
        
        # Apply decade filter
        decade = self.request.GET.get('decade')
        if decade:
            try:
                decade_start = int(decade)
                decade_end = decade_start + 9
                queryset = queryset.filter(year__gte=decade_start, year__lte=decade_end)
            except ValueError:
                # Invalid decade value
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
    
class ArtistListView(APIView):
    """List all artists with their hit count"""
    
    def get(self, request):
        # Get all artists with their hit count
        artists = Artist.objects.annotate(
            total_hits=Count('songs', distinct=True)  # ← CHANGE 'song' to 'songs'
        ).filter(
            total_hits__gt=0  # Only include artists with at least one hit
        ).order_by('name')
        
        artists_data = []
        for artist in artists:
            artists_data.append({
                'id': artist.id,
                'name': artist.name,
                'slug': artist.slug,
                'image': f'/media/{artist.image}' if artist.image else None,
                'total_hits': artist.total_hits,
                'nationality': artist.nationality,
                'artist_type': artist.artist_type,
            })
        
        return Response(artists_data)


# API VIEW: song detail by id
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

# API VIEW: song detail by slug (for urls)
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

        # Construct description
        description = f"{instance.title} entered the Hot 100 in {instance.year} spending {instance.weeks_on_chart} weeks on the charts with #{instance.peak_rank} being its highest position."

        # Add description to serializer data
        data = serializer.data
        data['description'] = description
        data['comments'] = comment_serializer.data

        return Response(data)

# API view to get a random song
class RandomSongView(APIView):
    serializer_class = SongSerializer

    def get(self, request, *args, **kwargs):
        # Get a count of all songs
        song_count = Song.objects.count()

        # Generate a random index within the range of song_count
        random_index = randint(0, song_count - 1)

        # Retrieve a random song using the random index
        random_song = Song.objects.all()[random_index]

        # Serialize the random song
        serializer = self.serializer_class(random_song)

        # Return the serialized random song
        return Response(serializer.data)


##################################################
## Allow authenticated users to comment or rate ##
##################################################

class UserSongCommentCreateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        song = get_object_or_404(Song, pk=pk)
        comment_text = request.data.get('comment_text', None)
        rating_value = request.data.get('rating', None)  # Retrieve the rating value from request data

        if comment_text:
            user = request.user
            user_song_comment = UserSongComment(user=user, song=song, text=comment_text)
            user_song_comment.save()

            # Check if the rating value is provided and save it
            if rating_value is not None:
                UserSongRating.objects.create(user=user, song=song, score=rating_value)

            serializer = UserSongCommentSerializer(user_song_comment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({'detail': 'Comment text is required.'}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        comment = get_object_or_404(UserSongComment, pk=pk)
        # Check if the user is the owner of the comment
        if request.user == comment.user:
            comment.delete()
            return Response({'detail': 'Comment deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'detail': 'You do not have permission to delete this comment.'}, status=status.HTTP_403_FORBIDDEN)

class UserSongCommentUpdateView(APIView):
    def patch(self, request, song_pk, comment_pk):
        comment = get_object_or_404(UserSongComment, pk=comment_pk)
        if request.user == comment.user:
            serializer = UserSongCommentSerializer(comment, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'You do not have permission to edit this comment.'}, status=status.HTTP_403_FORBIDDEN)

class UserSongRatingCreateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        song = get_object_or_404(Song, pk=pk)
        rating_value = request.data.get('rating', None)

        if rating_value is not None:
            # Get the authenticated user
            user = request.user

            # Check if the user has already rated the song
            user_rating = UserSongRating.objects.filter(user=user, song=song).first()

            if user_rating:
                # Update the existing rating
                user_rating.score = rating_value
                user_rating.save()
            else:
                # Create a new rating
                UserSongRating.objects.create(user=user, song=song, score=rating_value)

            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response({'detail': 'Rating is required.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_user_rating_for_song(request, song_id, user_id):
    try:
        rating = UserSongRating.objects.get(song_id=song_id, user_id=user_id)
        return Response(rating.score, status=status.HTTP_200_OK)
    except UserSongRating.DoesNotExist:
        # Return a default value (e.g., 0) instead of a 404 error
        return Response(0, status=status.HTTP_200_OK)


class UserBookmarkView(APIView):
    def post(self, request, song_id):
        song = get_object_or_404(Song, id=song_id)
        bookmark, created = Bookmark.objects.get_or_create(user=request.user)

        if created:
            bookmark.songs.add(song)
            message = 'Song bookmarked successfully.'
            is_bookmarked = True
        else:
            if song in bookmark.songs.all():
                bookmark.songs.remove(song)
                message = 'Bookmark removed successfully.'
                is_bookmarked = False
            else:
                bookmark.songs.add(song)
                message = 'Song bookmarked successfully.'
                is_bookmarked = True

        return Response({'success': True, 'message': message, 'is_bookmarked': is_bookmarked}, status=status.HTTP_200_OK)


class UserBookmarkedSongsView(APIView):
    def get(self, request):
        user_bookmarks = Bookmark.objects.filter(user=request.user)
        bookmarked_songs = [bookmark.songs.all() for bookmark in user_bookmarks]
        songs = [song for songs_queryset in bookmarked_songs for song in songs_queryset]
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)

    def delete(self, request):
        user_bookmarks = Bookmark.objects.filter(user=request.user)
        user_bookmarks.delete()  # Delete all bookmarks associated with the current user
        return Response(status=status.HTTP_204_NO_CONTENT)

class BookmarkStatusView(APIView):
    def get(self, request, song_id):
        song = get_object_or_404(Song, id=song_id)
        bookmark = Bookmark.objects.filter(user=request.user).first()
        is_bookmarked = bookmark.songs.filter(id=song_id).exists() if bookmark else False
        return Response({'is_bookmarked': is_bookmarked}, status=status.HTTP_200_OK)

class CommentStatusView(APIView):
    def get(self, request, song_id):
        song = get_object_or_404(Song, id=song_id)
        if request.user.is_authenticated:
            user_comment = UserSongComment.objects.filter(user=request.user, song=song).first()
            has_commented = user_comment is not None
        else:
            has_commented = False
        return Response({'has_commented': has_commented}, status=status.HTTP_200_OK)
    
# New view to get songs with the highest average user score

class TopRatedSongsView(APIView):
    def get(self, request):
        # Get the limit parameter from the request, default to 10
        limit = int(request.GET.get('limit', 10))
        
        # Ensure limit is within a reasonable range (1-100)
        limit = max(1, min(limit, 100))
        
        # Fetch songs ordered by their average user score, in descending order
        top_rated_songs = Song.objects.filter(average_user_score__gt=0).order_by('-average_user_score')[:limit]
        
        # Serialize the songs
        serializer = SongSerializer(top_rated_songs, many=True)
        
        # Return the serialized data
        return Response(serializer.data)

# New view to get random songs by decade
class RandomSongsByDecadeView(APIView):
    serializer_class = SongSerializer

    def get(self, request, *args, **kwargs):
        current_year = datetime.datetime.now().year
        decades = [(year, year + 9) for year in range(1950, current_year, 10)]

        random_songs_by_decade = []
        for start_year, end_year in decades:
            sample_size = 100  # Adjust sample size based on performance
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
    
    @method_decorator(cache_page(24 * 3600))  # Cache for 24 hours since data is static
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
class SongsWithImagesView(generics.ListAPIView):
    serializer_class = SongSerializer

    def get_queryset(self):
        return Song.objects.exclude(image_upload='').exclude(image_upload__isnull=True)
    
@api_view(['GET'])
def featured_artists(request):
    """Get random artists with images for homepage"""
    # Get all artists with images
    artists_with_images = Artist.objects.exclude(image='')
    
    # Convert to list with formatted image paths
    artists_list = []
    for artist in artists_with_images:
        # Build full URL for images
        image_url = None
        if artist.image:
            image_url = request.build_absolute_uri(artist.image.url)
        
        artists_list.append({
            'id': artist.id,
            'name': artist.name,
            'slug': artist.slug,
            'image': image_url
        })
    
    # Shuffle and return up to 25
    random.shuffle(artists_list)
    
    return Response(artists_list[:25])

    
class CurrentHot100View(generics.ListAPIView):
    serializer_class = CurrentHot100Serializer
    
    def get_queryset(self):
        return CurrentHot100.objects.all().order_by('current_position')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Get the most recent chart date
        latest_chart = queryset.first()
        chart_date = latest_chart.chart_date if latest_chart else None
        
        # Serialize the queryset
        serializer = self.get_serializer(queryset, many=True)
        
        # Return the data with the chart date
        return Response({
            'chart_date': chart_date,
            'songs': serializer.data
        })

class PlaylistGeneratorView(APIView):
    """
    API View to generate a playlist of random songs based on the number of songs,
    hit level (1 for top hits, 10 for more obscure hits), and selected decades.
    """

    def get(self, request):
        try:
            # Get parameters from the request
            num_songs = int(request.GET.get('number_of_songs', 10))
            hit_level = int(request.GET.get('hit_size', 1))
            decades = request.GET.getlist('decades', [])  # Decades to include

            # Define the peak rank cutoff logic based on hit level
            rank_cutoffs = {
                1: 1,
                2: 3,
                3: 5,
                4: 10,
                5: 20,
                6: 30,
                7: 50,
                8: 60,
                9: 80,
                10: 100
            }
            max_peak_rank = rank_cutoffs.get(hit_level, 100)

            # Filter songs by peak_rank and selected decades
            filtered_songs = Song.objects.filter(
                peak_rank__lte=max_peak_rank,
                spotify_url__isnull=False
            ).exclude(spotify_url='')

            # If no decades are provided, exclude all songs
            if not decades:
                return Response({'detail': 'Decades parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

            # Apply decade filtering if provided
            if decades:
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

            # Randomly select the required number of songs
            song_list = random.sample(list(filtered_songs), min(num_songs, len(filtered_songs)))

            # Serialize the result
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
            # Get parameters from the request
            num_songs = int(request.GET.get('number_of_songs', 10))
            hit_level = int(request.GET.get('hit_size', 1))
            decades = request.GET.getlist('decades', [])  # Decades to include

            # Define the peak rank cutoff logic based on hit level
            rank_cutoffs = {
                1: 1,
                2: 3,
                3: 5,
                4: 10,
                5: 20,
                6: 30,
                7: 50,
                8: 60,
                9: 80,
                10: 100
            }
            max_peak_rank = rank_cutoffs.get(hit_level, 100)

            # Filter songs by peak_rank and selected decades
            filtered_songs = Song.objects.filter(
                peak_rank__lte=max_peak_rank,
                spotify_url__isnull=False
            ).exclude(spotify_url='')

            # If no decades are provided, return an error
            if not decades:
                return Response({'detail': 'Decades parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

            # Apply decade filtering if provided
            if decades:
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

            # Randomly select the required number of songs
            song_list = random.sample(list(filtered_songs), min(num_songs, len(filtered_songs)))

            # Generate quiz questions (artist as the answer)
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
