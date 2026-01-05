from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile
from django.utils import timezone
from datetime import timedelta

def update_user_points(user):
    from songs.models import UserSongRating, UserSongComment
    profile, _ = UserProfile.objects.get_or_create(user=user)
    
    # 1. Count only the 'Public' contributions
    r_all = UserSongRating.objects.filter(user=user).exclude(score=0).count()
    c_all = UserSongComment.objects.filter(user=user).count()
    
    # 2. Points formula (No Bookmarks)
    profile.points = (r_all * 10) + (c_all * 25)
    
    # 3. Monthly (No Bookmarks)
    last_month = timezone.now() - timedelta(days=31)
    r_m = UserSongRating.objects.filter(user=user, created_at__gte=last_month).exclude(score=0).count()
    c_m = UserSongComment.objects.filter(user=user, created_at__gte=last_month).count()
    
    profile.points_monthly = (r_m * 10) + (c_m * 25)
    
    profile.save()

# Listens for Ratings, Comments, AND Bookmarks
@receiver([post_save, post_delete], sender='songs.UserSongRating')
@receiver([post_save, post_delete], sender='songs.UserSongComment')
def trigger_point_update(sender, instance, **kwargs):
    update_user_points(instance.user)