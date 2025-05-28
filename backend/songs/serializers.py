# songs/serializers.py
from rest_framework import serializers
from .models import Song, UserSongComment, UserSongRating, CurrentHot100


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

class SongSerializer(serializers.ModelSerializer):
    comments = UserSongCommentSerializer(many=True, read_only=True)

    class Meta:
        model = Song
        fields = '__all__'

class CurrentHot100Serializer(serializers.ModelSerializer):
    class Meta:
        model = CurrentHot100
        fields = '__all__'
