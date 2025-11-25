from django.http import JsonResponse
from django.contrib.auth import get_user_model
from ..models import Song, SongTimeline, UserSongRating, UserSongComment, Bookmark

def website_stats(request):
    # Total unique songs
    song_count = Song.objects.count()

    # Total unique artists (adjust if you have a dedicated Artist model)
    if hasattr(Song, 'artist'):
        artist_count = Song.objects.values("artist").distinct().count()
    else:
        # Replace with Artist.objects.count() if available
        artist_count = None

    # Total distinct historic charts by week
    chart_count = SongTimeline.objects.values("chart_date").distinct().count()

    # User engagement stats
    user_rating_count = UserSongRating.objects.count()
    user_comment_count = UserSongComment.objects.count()
    bookmark_count = Bookmark.objects.count()

    # Get newest member username (excluding staff and superusers)
    User = get_user_model()
    newest_user = User.objects.filter(is_staff=False, is_superuser=False).order_by('-date_joined').first()
    newest_username = newest_user.username if newest_user else None

    return JsonResponse({
        "song_count": song_count,
        "artist_count": artist_count,
        "chart_count": chart_count,
        "user_rating_count": user_rating_count,
        "user_comment_count": user_comment_count,
        "bookmark_count": bookmark_count,
        "newest_username": newest_username,
    })
