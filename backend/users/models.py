from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    points = models.PositiveIntegerField(default=0)
    points_monthly = models.PositiveIntegerField(default=0)

    @property
    def historian_title(self):
        p = self.points
        if p >= 50000: return "Grand Archivist of the Ages"
        if p >= 30000: return "Chief Musicologist"
        if p >= 20000: return "Archive Commander"
        if p >= 10000: return "Legendary Archivist"
        if p >= 5000:  return "Master of the Decades"
        if p >= 2500:  return "Senior Musicologist"
        if p >= 1000:  return "Archive Specialist"
        if p >= 500:   return "Cultural Curator"
        if p >= 200:   return "Lead Historian"
        if p >= 50:    return "Sonic Researcher"
        return "Archive Scout"
    
    @property
    def next_rank_data(self):
        # Updated to include your new elite tiers
        thresholds = [
            (50, "Sonic Researcher"),
            (200, "Lead Historian"),
            (500, "Cultural Curator"),
            (1000, "Archive Specialist"),
            (2500, "Senior Musicologist"),
            (5000, "Master of the Decades"),
            (10000, "Legendary Archivist"),
            (20000, "Archive Commander"),
            (30000, "Chief Musicologist"),
            (50000, "Grand Archivist of the Ages"),
        ]
        for pts, title in thresholds:
            if pts > self.points:
                idx = thresholds.index((pts, title))
                lower_bound = thresholds[idx-1][0] if idx > 0 else 0
                
                progress = 0
                if pts > lower_bound:
                    progress = ((self.points - lower_bound) / (pts - lower_bound)) * 100

                return {
                    "next_title": title,
                    "next_pts": pts,
                    "remaining": pts - self.points,
                    "percent": round(progress, 1)
                }
        return None

    def __str__(self):
        return f"{self.user.username}: {self.historian_title} ({self.points} pts)"