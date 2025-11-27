from django.db import models
from django.contrib.auth.models import User
from .song import Song


class UserSongRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    score = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 11)])

    class Meta:
        unique_together = ('user', 'song',)

    def get_song_slug(self):
        song = self.song
        return song.slug

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.update_song_average_score()

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        self.update_song_average_score()

    def update_song_average_score(self):
        song = self.song
        total_ratings = UserSongRating.objects.filter(song=song, score__gt=0).count()
        sum_ratings = UserSongRating.objects.filter(song=song).aggregate(models.Sum('score'))['score__sum']

        if total_ratings > 0:
            song.total_ratings = total_ratings
            average_score = sum_ratings / total_ratings
            song.average_user_score = round(average_score, 1)
        else:
            song.total_ratings = 0
            song.average_user_score = 0.0

        song.save()


class UserSongComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    text = models.TextField()
    rating = models.ForeignKey(UserSongRating, on_delete=models.SET_NULL, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.song.title}"


class Bookmark(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    songs = models.ManyToManyField(Song, related_name='bookmarks')

    def __str__(self):
        return f"Bookmarks for {self.user.username}"
