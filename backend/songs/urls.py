from django.urls import path
from .views import (
    SongListCreateView, SongDetailView, SongDetailBySlugView, UserSongCommentCreateView,
    UserSongRatingCreateView, UserSongCommentUpdateView, get_user_rating_for_song, 
    UserBookmarkView, UserBookmarkedSongsView, BookmarkStatusView, CommentStatusView,
    RandomSongView, TopRatedSongsView, RandomSongsByDecadeView, NumberOneSongsView,
    SongsWithImagesView, PlaylistGeneratorView, QuizGeneratorView, CurrentHot100View, featured_artists, random_song_by_artist
)

urlpatterns = [
    path('', SongListCreateView.as_view(), name='song-list-create'),
    path('<int:pk>/', SongDetailView.as_view(), name='song-detail'),
    path('bookmarked-songs/', UserBookmarkedSongsView.as_view(), name='get_bookmarked_songs'),
    path('<int:song_id>/bookmark-status/', BookmarkStatusView.as_view()),
    path('<int:song_id>/comment-status/', CommentStatusView.as_view()),
    path('random-song/', RandomSongView.as_view(), name='random-song'),
    path('top-rated-songs/', TopRatedSongsView.as_view(), name='top-rated-songs'),
    path('number-one-songs/', NumberOneSongsView.as_view(), name='number-one-songs'),
    path('songs-with-images/', SongsWithImagesView.as_view(), name='songs-with-images'), 
    path('featured-artists/', featured_artists, name='featured-artists'),
    path('random-songs-by-decade/', RandomSongsByDecadeView.as_view(), name='random-songs-by-decade'),
    path('random-by-artist/', random_song_by_artist, name='random-by-artist'),
    path('generate-playlist/', PlaylistGeneratorView.as_view(), name='generate-playlist'),
    path('generate-quiz/', QuizGeneratorView.as_view(), name='generate-quiz'),
    path('current-hot100/', CurrentHot100View.as_view(), name='current-hot100'),
    path('<slug:slug>/', SongDetailBySlugView.as_view(), name='song-detail-slug'),
    path('<int:pk>/comment/', UserSongCommentCreateView.as_view(), name='user-song-comment-create'),
    path('<int:song_pk>/comment/<int:comment_pk>/', UserSongCommentUpdateView.as_view(), name='user-song-comment-update'),
    path('<int:pk>/rate/', UserSongRatingCreateView.as_view(), name='user-song-rating-create'),
    path('ratings/<int:song_id>/user/<int:user_id>/', get_user_rating_for_song),
    path('<int:song_id>/bookmark/', UserBookmarkView.as_view()),
    ]
