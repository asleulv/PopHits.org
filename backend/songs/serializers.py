# songs/serializers.py
from rest_framework import serializers
from .models import Song, UserSongComment, UserSongRating, CurrentHot100, Artist, ArtistRelationship, ArtistTagRelation, SongTimeline
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
        """Get artist genre tags - uses prefetched data"""
        tag_relations = [
            rel for rel in obj.artisttagrelation_set.all()
        ][:5]
        
        return [{
            'name': tag_rel.tag.name,
            'category': tag_rel.tag.category,
        } for tag_rel in tag_relations]
    
    def get_members(self, obj):
        """Get band members - uses prefetched data"""
        members = [
            rel for rel in obj.relationships_to.all()
            if rel.relationship_type == 'member_of'
        ]
        
        return ArtistRelationshipSerializer(
            members, 
            many=True,
            context={'relationship_direction': 'from'}
        ).data
    
    def get_member_of(self, obj):
        """Get bands this artist is a member of - uses prefetched data"""
        bands = [
            rel for rel in obj.relationships_from.all()
            if rel.relationship_type == 'member_of'
        ]
        
        return ArtistRelationshipSerializer(
            bands, 
            many=True,
            context={'relationship_direction': 'to'}
        ).data
    
    def get_collaborations(self, obj):
        """Get collaboration artists - uses prefetched data"""
        collabs = [
            rel for rel in obj.relationships_to.all()
            if rel.relationship_type == 'collaboration'
        ]
        
        return [{
            'name': rel.from_artist.name,
            'slug': rel.from_artist.slug
        } for rel in collabs]
    
    def get_participating_artists(self, obj):
        """For collaboration artists - uses prefetched data"""
        participants = [
            rel for rel in obj.relationships_from.all()
            if rel.relationship_type == 'collaboration'
        ]
        
        return [{
            'name': rel.to_artist.name,
            'slug': rel.to_artist.slug
        } for rel in participants]
    
    def get_billboard_stats(self, obj):
        """Get Billboard Hot 100 statistics - uses prefetched songs"""
        songs = [s for s in obj.songs.all()]
        
        if not songs:
            return None
        
        # Calculate stats in Python from prefetched data
        total_hits = len(songs)
        highest_peak = min(s.peak_rank for s in songs)
        total_weeks = sum(s.weeks_on_chart for s in songs)
        first_hit_year = min(s.year for s in songs)
        last_hit_year = max(s.year for s in songs)
        number_one_hits = sum(1 for s in songs if s.peak_rank == 1)
        
        return {
            'total_hits': total_hits,
            'highest_peak': highest_peak,
            'number_one_hits': number_one_hits,
            'total_weeks': total_weeks,
            'first_hit_year': first_hit_year,
            'last_hit_year': last_hit_year
        }



class SongSerializer(serializers.ModelSerializer):
    comments = UserSongCommentSerializer(many=True, read_only=True)
    artist_data = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()

    latest_score = serializers.IntegerField(read_only=True)
    latest_rater = serializers.CharField(read_only=True)
    latest_time = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Song
        fields = '__all__'

    def get_artist_data(self, obj):
        # Check if artist_fk exists (for NumberOneSong compatibility)
        if hasattr(obj, 'artist_fk') and obj.artist_fk and obj.artist_fk.musicbrainz_id:
            return ArtistDetailSerializer(obj.artist_fk).data
        return None

    def get_tags(self, obj):
        if not hasattr(obj, "tag_relations"):
            return []

        # Use prefetched data instead of select_related
        return [
            {
                "name": rel.tag.name,
                "slug": rel.tag.slug,
                "color": rel.tag.color,
                "icon": rel.tag.lucide_icon,
                "category": rel.tag.category,
            }
            for rel in obj.tag_relations.all()
        ]

        
class SongTimelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = SongTimeline
        fields = ['chart_date', 'rank', 'peak_rank', 'weeks_on_chart']

class CurrentHot100Serializer(serializers.ModelSerializer):
    class Meta:
        model = CurrentHot100
        fields = '__all__'
