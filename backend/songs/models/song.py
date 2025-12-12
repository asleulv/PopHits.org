from django.db import models
from django.utils.text import slugify
from ckeditor.fields import RichTextField
from .composition import Composition
from .artist import Artist


class Song(models.Model):
    title = models.CharField(max_length=100)
    artist = models.CharField(max_length=100)
    year = models.IntegerField()
    peak_rank = models.IntegerField()
    weeks_on_chart = models.IntegerField()

    # New fields for the rating system
    average_user_score = models.FloatField(default=0.0)
    total_ratings = models.IntegerField(default=0)

    review = RichTextField(blank=False, null=False, default='')
    image_upload = models.ImageField(upload_to='song_images/', blank=True, null=True)
    spotify_url = models.URLField(blank=True, null=True)
    youtube_url = models.URLField(blank=True, null=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    artist_slug = models.SlugField(max_length=255, blank=True, null=True)

    composition = models.ForeignKey(Composition, on_delete=models.CASCADE, 
                                   null=True, blank=True, 
                                   related_name='versions')
    is_original_recording = models.BooleanField(default=False)

    artist_fk = models.ForeignKey(Artist, on_delete=models.CASCADE, 
                                  null=True, blank=True, related_name='songs')
    
    tags = models.ManyToManyField(
        'SongTag',
        through='SongTagRelation',
        related_name='songs',
        blank=True
    )

    class Meta:
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['artist']),
            models.Index(fields=['artist_slug']),
            models.Index(fields=['year']),
            models.Index(fields=['peak_rank']),
        ]

    def save(self, *args, **kwargs):
        # Generate a slug when saving the object
        self.slug = slugify(f"{self.artist} {self.title}")
        self.artist_slug = slugify(self.artist)
        super().save(*args, **kwargs)

    def get_artist_image(self):
        """Get the first available image from any other song by this artist (using artist_slug)"""
        artist_song_with_image = Song.objects.filter(
            artist_slug=self.artist_slug,
            image_upload__isnull=False
        ).exclude(id=self.id).first()
        
        return artist_song_with_image.image_upload if artist_song_with_image else None

    def get_display_image(self):
        """Get image for display - prioritize song image, fall back to artist image"""
        return self.image_upload or self.get_artist_image()

    def get_all_artist_songs(self):
        """Get all songs by this artist excluding current song"""
        return Song.objects.filter(artist_slug=self.artist_slug).exclude(id=self.id)
    
    def get_other_versions(self):
        """Get all other versions of this composition"""
        if self.composition:
            return self.composition.versions.exclude(id=self.id).order_by('year')
        return Song.objects.none()

    def get_original_version(self):
        """Get the original recording of this composition"""
        if self.composition:
            return self.composition.versions.filter(is_original_recording=True).first()
        return None

    def is_cover_more_successful(self):
        """Check if this cover was more successful than the original"""
        if not self.composition or self.is_original_recording:
            return False
        
        original = self.get_original_version()
        if original:
            return self.peak_rank < original.peak_rank
        return False

    def __str__(self):
        return f"{self.title} by {self.artist}, Year: {self.year}, Peak Rank: {self.peak_rank}"


class SongTimeline(models.Model):
    song = models.ForeignKey(Song, on_delete=models.CASCADE, related_name='chart_entries')
    chart_date = models.DateField(db_index=True)
    rank = models.PositiveIntegerField()
    peak_rank = models.PositiveIntegerField(null=True, blank=True)
    weeks_on_chart = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ['chart_date']
        indexes = [
            models.Index(fields=['chart_date']),
            models.Index(fields=['rank']),
        ]
        unique_together = ('song', 'chart_date')

    def __str__(self):
        return f"{self.song} on {self.chart_date}: Rank {self.rank}"


class NumberOneSong(models.Model):
    title = models.CharField(max_length=100)
    artist = models.CharField(max_length=100)
    year = models.IntegerField()
    peak_rank = models.IntegerField()
    weeks_on_chart = models.IntegerField()
    average_user_score = models.FloatField(default=0.0)
    total_ratings = models.IntegerField(default=0)
    spotify_url = models.URLField(blank=True, null=True)
    youtube_url = models.URLField(blank=True, null=True)
    slug = models.SlugField(max_length=255, unique=True)
    artist_slug = models.SlugField(max_length=255, blank=True, null=True)

    class Meta:
        ordering = ['-year']
        indexes = [
            models.Index(fields=['-year']),
            models.Index(fields=['artist']),
        ]


class CurrentHot100(models.Model):
    title = models.CharField(max_length=100)
    artist = models.CharField(max_length=100)
    year = models.IntegerField()
    peak_rank = models.IntegerField()
    weeks_on_chart = models.IntegerField()
    current_position = models.IntegerField()
    last_week_position = models.IntegerField(null=True, blank=True)
    position_change = models.IntegerField(null=True, blank=True)
    average_user_score = models.FloatField(default=0.0)
    total_ratings = models.IntegerField(default=0)
    spotify_url = models.URLField(blank=True, null=True)
    youtube_url = models.URLField(blank=True, null=True)
    slug = models.SlugField(max_length=255)
    artist_slug = models.SlugField(max_length=255, blank=True, null=True)
    chart_date = models.DateField()

    class Meta:
        ordering = ['current_position']
        indexes = [
            models.Index(fields=['current_position']),
            models.Index(fields=['artist']),
        ]
        
    def __str__(self):
        return f"#{self.current_position}: {self.title} by {self.artist}"
