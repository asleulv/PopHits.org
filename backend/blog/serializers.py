from rest_framework import serializers
from .models import BlogPost
from songs.serializers import SongSerializer

class BlogPostListSerializer(serializers.ModelSerializer):
    """Serializer for listing blog posts with minimal information"""
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'meta_description', 'featured_image', 'published_date']

class BlogPostDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed blog post information including related songs"""
    related_songs = SongSerializer(many=True, read_only=True)
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 
            'title', 
            'slug', 
            'content', 
            'featured_image', 
            'meta_description', 
            'published_date', 
            'updated_date',
            'related_songs'
        ]
