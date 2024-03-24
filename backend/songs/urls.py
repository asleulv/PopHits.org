from django.urls import path
from .views import SongListCreateView, SongDetailView, SongDetailBySlugView, UserSongCommentCreateView, UserSongRatingCreateView, UserSongCommentUpdateView, get_user_rating_for_song, UserBookmarkView, UserBookmarkedSongsView, BookmarkStatusView, CommentStatusView

urlpatterns = [
    path('', SongListCreateView.as_view(), name='song-list-create'),
    path('<int:pk>/', SongDetailView.as_view(), name='song-detail'),
    path('bookmarked-songs/', UserBookmarkedSongsView.as_view(), name='get_bookmarked_songs'),
    path('<int:song_id>/bookmark-status/', BookmarkStatusView.as_view()),
    path('<int:song_id>/comment-status/', CommentStatusView.as_view()),
    path('<slug:slug>/', SongDetailBySlugView.as_view(), name='song-detail-slug'),
    path('<int:pk>/comment/', UserSongCommentCreateView.as_view(), name='user-song-comment-create'),
    path('<int:song_pk>/comment/<int:comment_pk>/', UserSongCommentUpdateView.as_view(), name='user-song-comment-update'),
    path('<int:pk>/rate/', UserSongRatingCreateView.as_view(), name='user-song-rating-create'),
    path('ratings/<int:song_id>/user/<int:user_id>/', get_user_rating_for_song),
    path('<int:song_id>/bookmark/', UserBookmarkView.as_view()),
    ]
