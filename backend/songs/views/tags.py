# songs/views/tags.py
from rest_framework import generics
from rest_framework.authentication import TokenAuthentication
from ..models.tag import SongTag
from ..serializers import TagDetailSerializer
# Import your custom permissions
from ..permissions import IsInternalServerWithOptionalAuth 

class TagDetailView(generics.RetrieveAPIView):
    queryset = SongTag.objects.all()
    serializer_class = TagDetailSerializer
    lookup_field = 'slug'

    # Match your Song security pattern:
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsInternalServerWithOptionalAuth]

class TagListView(generics.ListAPIView):
    # We use order_by to prioritize featured tags first, then alphabetically
    queryset = SongTag.objects.all().order_by('-is_featured', 'name')
    serializer_class = TagDetailSerializer
    pagination_class = None