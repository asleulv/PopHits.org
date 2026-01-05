from rest_framework import serializers
from songs.models import UserSongRating

class UserSongRatingSerializer(serializers.ModelSerializer):
    song_title = serializers.ReadOnlyField(source='song.title')
    song_artist = serializers.ReadOnlyField(source='song.artist')
    song_slug = serializers.SerializerMethodField()
    artist_slug = serializers.ReadOnlyField(source='song.artist_slug')
    artist_tags = serializers.SerializerMethodField() 
    spotify_url = serializers.ReadOnlyField(source='song.spotify_url')
    song_year = serializers.ReadOnlyField(source='song.year')
    date = serializers.ReadOnlyField(source='created_at')

    class Meta:
        model = UserSongRating
        # 2. Add 'artist_tags' to this list
        fields = [
            'song_title', 'song_artist', 'song_slug', 'artist_slug', 
            'artist_tags', 'spotify_url', 'score', 'song_year', 'date'
        ]

    def get_song_slug(self, obj):
        return obj.song.slug
    
    def get_artist_tags(self, obj):
        tag_names = set()
        try:
            if obj.song:
                # 1. Pull tags from the Song (if any exist)
                if hasattr(obj.song, 'tags'):
                    s_tags = obj.song.tags.filter(
                        category__in=['genre', 'style']
                    ).values_list('name', flat=True)
                    tag_names.update(s_tags)

                # 2. Pull tags from the Artist (via the new ManyToMany link)
                if obj.song.artist_fk:
                    # Now that 'tags' is on Artist, this works perfectly!
                    a_tags = obj.song.artist_fk.tags.filter(
                        category__in=['genre', 'style']
                    ).values_list('name', flat=True)
                    tag_names.update(a_tags)
                    
        except Exception as e:
            print(f"Tag Serializer Error: {e}")
            
        return list(tag_names)