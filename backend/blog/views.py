from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import BlogPost
from .serializers import BlogPostListSerializer, BlogPostDetailSerializer

class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for blog posts
    list: Returns a list of all published blog posts
    retrieve: Returns a specific blog post by slug
    """
    queryset = BlogPost.objects.filter(is_published=True).order_by('-published_date')
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'content']
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BlogPostListSerializer
        return BlogPostDetailSerializer
    
    def retrieve(self, request, slug=None):
        queryset = BlogPost.objects.filter(is_published=True)
        blog_post = get_object_or_404(queryset, slug=slug)
        serializer = self.get_serializer(blog_post)
        return Response(serializer.data)
