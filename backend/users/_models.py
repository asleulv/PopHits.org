""" # users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode


class UserProfile(AbstractUser):
    email = models.EmailField(unique=True)
    
    # Add related_name to resolve clashes
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="user_profiles",
        blank=True,
        help_text="The groups this user belongs to.",
    )
    
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="user_profiles",
        blank=True,
        help_text="Specific permissions for this user.",
    )

    def __str__(self):
        return self.username
    
class PasswordReset(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    token = models.CharField(max_length=100, unique=True)
    timestamp = models.DateTimeField(auto_now_add=True)
 """