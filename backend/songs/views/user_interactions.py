from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404

from ..models import Song, UserSongRating, UserSongComment, Bookmark
from ..serializers import UserSongCommentSerializer, SongSerializer


class UserSongCommentCreateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        song = get_object_or_404(Song, pk=pk)
        comment_text = request.data.get('comment_text', None)
        rating_value = request.data.get('rating', None)

        if comment_text:
            user = request.user
            user_song_comment = UserSongComment(user=user, song=song, text=comment_text)
            user_song_comment.save()

            if rating_value is not None:
                UserSongRating.objects.create(user=user, song=song, score=rating_value)

            serializer = UserSongCommentSerializer(user_song_comment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({'detail': 'Comment text is required.'}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        comment = get_object_or_404(UserSongComment, pk=pk)
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
            user = request.user
            user_rating = UserSongRating.objects.filter(user=user, song=song).first()

            if user_rating:
                user_rating.score = rating_value
                user_rating.save()
            else:
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
        user_bookmarks.delete()
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
