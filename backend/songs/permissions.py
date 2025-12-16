from rest_framework.permissions import BasePermission
from django.conf import settings
import os 

# Note: We use settings.INTERNAL_API_KEY which we loaded in settings.py
# and we use the X-Internal-Key header name.

class IsInternalServer(BasePermission):
    """
    Custom permission to allow access only to requests containing the correct internal API key 
    in the X-Internal-Key header.
    """
    def has_permission(self, request, view):
        # 1. Get the expected secret from settings
        # This assumes INTERNAL_API_KEY is correctly set in your core/settings.py
        expected_key = settings.INTERNAL_API_KEY
        
        # 2. Get the key sent in the request header
        # Django converts HTTP_X_INTERNAL_KEY to HTTP_X_INTERNAL_KEY in request.META
        # request.META.get() is the standard way to retrieve non-standard headers
        sent_key = request.META.get('HTTP_X_INTERNAL_KEY')

        # 3. Securely check if the key exists in the request and matches the expected key
        # We use short-circuiting logic: 
        # - Must have an expected_key
        # - The sent_key must match the expected_key
        return expected_key and (sent_key == expected_key)