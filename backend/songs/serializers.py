# songs/serializers.py
from rest_framework import serializers
from .models import Song, UserSongComment, UserSongRating, CurrentHot100, Artist, ArtistRelationship, ArtistTagRelation
from django.db.models import Min, Max, Sum, Count


class UserSongCommentSerializer(serializers.ModelSerializer):
    user_id = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    user_rating = serializers.SerializerMethodField()

    class Meta:
        model = UserSongComment
        fields = ['id', 'user_id', 'song', 'text', 'created_at', 'username', 'user_rating']

    def get_user_id(self, obj):
        return obj.user.id

    def get_username(self, obj):
        return obj.user.username
    
    def get_user_rating(self, obj):
        # Assuming UserSongRating has a ForeignKey relationship with UserSongComment
        # Get the user rating associated with the comment
        user_rating_instance = UserSongRating.objects.filter(user=obj.user, song=obj.song).first()
        if user_rating_instance:
            return user_rating_instance.score
        else:
            return None

class ArtistRelationshipSerializer(serializers.ModelSerializer):
    """Serializer for artist relationships (members, collaborations)"""
    artist_name = serializers.SerializerMethodField()
    artist_slug = serializers.SerializerMethodField()
    
    class Meta:
        model = ArtistRelationship
        fields = ['artist_name', 'artist_slug', 'relationship_type']
    
    def get_artist_name(self, obj):
        # For members: get the person's name (from_artist)
        # For member_of: get the band's name (to_artist)
        # The context will tell us which direction to use
        context_type = self.context.get('relationship_direction', 'to')
        if context_type == 'from':
            return obj.from_artist.name
        return obj.to_artist.name
    
    def get_artist_slug(self, obj):
        context_type = self.context.get('relationship_direction', 'to')
        if context_type == 'from':
            return obj.from_artist.slug
        return obj.to_artist.slug


class ArtistDetailSerializer(serializers.ModelSerializer):
    """Serializer for enriched artist data"""
    members = serializers.SerializerMethodField()
    member_of = serializers.SerializerMethodField()
    collaborations = serializers.SerializerMethodField()
    participating_artists = serializers.SerializerMethodField()
    billboard_stats = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    
    class Meta:
        model = Artist
        fields = [
            'id', 'name', 'slug', 'nationality', 'birth_date', 'image', 'image_credit',
            'death_date', 'artist_type', 'bio', 'musicbrainz_id',
            'members', 'member_of', 'collaborations', 'participating_artists', 'billboard_stats', 'tags'
        ]

    def get_tags(self, obj):
        """Get artist genre tags"""
        tag_relations = ArtistTagRelation.objects.filter(
            artist=obj
        ).select_related('tag').order_by('-confidence')[:5]
        
        return [{
            'name': tag_rel.tag.name,
            'category': tag_rel.tag.category,
        } for tag_rel in tag_relations]
    
    def get_members(self, obj):
        """Get band members (people who are members of this band)"""
        members = ArtistRelationship.objects.filter(
            to_artist=obj,
            relationship_type='member_of'
        ).select_related('from_artist')
        
        # Pass context to tell serializer to use 'from_artist'
        return ArtistRelationshipSerializer(
            members, 
            many=True,
            context={'relationship_direction': 'from'}
        ).data
    
    def get_member_of(self, obj):
        """Get bands this artist is a member of"""
        bands = ArtistRelationship.objects.filter(
            from_artist=obj,
            relationship_type='member_of'
        ).select_related('to_artist')
        
        # Pass context to tell serializer to use 'to_artist'
        return ArtistRelationshipSerializer(
            bands, 
            many=True,
            context={'relationship_direction': 'to'}
        ).data
    
    def get_collaborations(self, obj):
        """Get collaboration artists pointing to this main artist"""
        collabs = ArtistRelationship.objects.filter(
            to_artist=obj,
            relationship_type='collaboration'
        ).select_related('from_artist')
        
        # Return the collaboration artist names
        return [{
            'name': rel.from_artist.name,
            'slug': rel.from_artist.slug
        } for rel in collabs]
    
    def get_participating_artists(self, obj):
        """For collaboration artists, return the individual artists they link to"""
        # Get all main artists that this collaboration points to
        participants = ArtistRelationship.objects.filter(
            from_artist=obj,
            relationship_type='collaboration'
        ).select_related('to_artist')
        
        return [{
            'name': rel.to_artist.name,
            'slug': rel.to_artist.slug
        } for rel in participants]
    
    def get_billboard_stats(self, obj):
        """Get Billboard Hot 100 statistics for this artist"""
        # Use the foreign key relationship instead of string matching
        songs = Song.objects.filter(artist_fk=obj)
        
        if not songs.exists():
            return None
        
        stats = songs.aggregate(
            total_hits=Count('id'),
            highest_peak=Min('peak_rank'),
            total_weeks=Sum('weeks_on_chart'),
            first_hit_year=Min('year'),
            last_hit_year=Max('year')
        )
        
        # Count number of #1 hits
        number_one_hits = songs.filter(peak_rank=1).count()
        
        return {
            'total_hits': stats['total_hits'],
            'highest_peak': stats['highest_peak'],
            'number_one_hits': number_one_hits,  # ← NEW
            'total_weeks': stats['total_weeks'],
            'first_hit_year': stats['first_hit_year'],
            'last_hit_year': stats['last_hit_year']
        }




class SongSerializer(serializers.ModelSerializer):
    comments = UserSongCommentSerializer(many=True, read_only=True)
    artist_data = serializers.SerializerMethodField()
    
    class Meta:
        model = Song
        fields = '__all__'
    
    def get_artist_data(self, obj):
        """Get enriched artist data if available"""
        try:
            # Get the main artist object
            artist = Artist.objects.get(name=obj.artist)
            
            # Only return enriched data if the artist has a MusicBrainz ID
            if artist.musicbrainz_id:
                return ArtistDetailSerializer(artist).data
            return None
        except Artist.DoesNotExist:
            return None

class CurrentHot100Serializer(serializers.ModelSerializer):
    class Meta:
        model = CurrentHot100
        fields = '__all__'
