# users/serializers.py
from rest_framework import serializers
from songs.models import UserSongRating

class UserSongRatingSerializer(serializers.ModelSerializer):
    song_title = serializers.ReadOnlyField(source='song.title')
    song_artist = serializers.ReadOnlyField(source='song.artist')
    song_slug = serializers.SerializerMethodField()
    spotify_url = serializers.ReadOnlyField(source='song.spotify_url')  # New field
    date = serializers.ReadOnlyField(source='created_at')

    class Meta:
        model = UserSongRating
        fields = ['song_title', 'song_artist', 'song_slug', 'spotify_url', 'score', 'date']

    def get_song_slug(self, obj):
        return obj.song.slug
    

