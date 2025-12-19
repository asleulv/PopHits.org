from rest_framework import serializers
from .models import BlogPost
from songs.serializers import SongSerializer

class BlogPostListSerializer(serializers.ModelSerializer):
    """Serializer for listing blog posts with minimal information"""
    # Use MethodField to force the correct URL
    featured_image = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'meta_description', 'featured_image', 'published_date']

    def get_featured_image(self, obj):
        if obj.featured_image:
            # This forces the public domain regardless of how the API is called
            return f"https://pophits.org{obj.featured_image.url}"
        return None

class BlogPostDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed blog post information including related songs"""
    related_songs = SongSerializer(many=True, read_only=True)
    featured_image = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()
    
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

    def get_featured_image(self, obj):
        if obj.featured_image:
            return f"https://pophits.org{obj.featured_image.url}"
        return None

    def get_content(self, obj):
        if obj.content:
            # This fixes the images INSIDE the blog body that point to 8080
            return obj.content.replace('http://127.0.0.1:8080', 'https://pophits.org')
        return obj.content