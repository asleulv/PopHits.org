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