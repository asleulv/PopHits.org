from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from ckeditor.fields import RichTextField

class Composition(models.Model):
    title = models.CharField(max_length=200)
    original_writer = models.CharField(max_length=200, blank=True)
    original_artist = models.CharField(max_length=200, blank=True, null=True)  # NEW: First recorded version
    original_year = models.IntegerField(blank=True, null=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    
    # Tracking fields
    is_traditional = models.BooleanField(default=False)
    musicbrainz_work_id = models.CharField(max_length=36, blank=True, null=True)
    verified_source = models.CharField(max_length=50, blank=True)
    
    # Statistics (auto-calculated)
    total_versions = models.IntegerField(default=0)  # NEW: Count of versions
    most_successful_version = models.ForeignKey(  # NEW: Highest charting version
        'Song', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='most_successful_for'
    )
    
    def save(self, *args, **kwargs):
        if not self.slug:
            if self.original_writer and not self.is_traditional:
                self.slug = slugify(f"{self.title}-{self.original_writer}")
            else:
                self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def update_statistics(self):
        """Update calculated fields"""
        versions = self.versions.all()
        self.total_versions = versions.count()
        
        # Find most successful version (lowest peak rank = most successful)
        if versions.exists():
            self.most_successful_version = versions.order_by('peak_rank').first()
            self.save()
    
    def get_original_song(self):
        """Get the original recording in our database"""
        return self.versions.filter(is_original_recording=True).first()
    
    def get_covers(self):
        """Get all cover versions in our database"""
        return self.versions.filter(is_original_recording=False)
    
    def get_version_timeline(self):
        """Get versions sorted chronologically"""
        return self.versions.all().order_by('year')
    
    def __str__(self):
        if self.is_traditional:
            return f"{self.title} (Traditional)"
        elif self.original_artist and self.original_writer != self.original_artist:
            return f"{self.title} - {self.original_writer} (orig: {self.original_artist})"
        elif self.original_writer:
            return f"{self.title} - {self.original_writer}"
        return self.title



class Artist(models.Model):
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    
    # AI-enriched metadata
    nationality = models.CharField(max_length=100, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    death_date = models.DateField(blank=True, null=True)
    bio = models.TextField(blank=True)

    image = models.ImageField(
        upload_to='artist_images/',
        blank=True,
        null=True,
        help_text='Public domain artist photo'
    )
    image_credit = models.CharField(
        max_length=500,
        blank=True,
        help_text='Image source/credit (e.g., "Wikimedia Commons")'
    )
    
    # Artist type and relationships
    artist_type = models.CharField(max_length=20, choices=[
        ('person', 'Person'),
        ('group', 'Group'),
        ('duo', 'Duo'),
        ('collective', 'Collective'),
    ], default='person')
    
    is_active = models.BooleanField(default=True)
    
    # External IDs for data enrichment
    musicbrainz_id = models.CharField(max_length=36, blank=True, null=True)
    spotify_id = models.CharField(max_length=22, blank=True, null=True)
    
    # Images and media
    image = models.ImageField(upload_to='artist_images/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name

class ArtistTag(models.Model):
    """Tags for genres, moods, styles, etc."""
    name = models.CharField(max_length=50, unique=True)
    category = models.CharField(max_length=20, choices=[
        ('genre', 'Genre'),
        ('mood', 'Mood'),
        ('style', 'Style'),
        ('instrument', 'Instrument'),
        ('era', 'Era'),
    ])
    
    def __str__(self):
        return f"{self.name} ({self.category})"

class ArtistTagRelation(models.Model):
    """Many-to-many relationship with confidence scores"""
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    tag = models.ForeignKey(ArtistTag, on_delete=models.CASCADE)
    confidence = models.FloatField(default=1.0)  # AI confidence score
    source = models.CharField(max_length=50)  # 'ai', 'user', 'lastfm', etc.
    
    class Meta:
        unique_together = ('artist', 'tag')

class ArtistRelationship(models.Model):
    """Links related artists together"""
    from_artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='relationships_from')
    to_artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='relationships_to')
    relationship_type = models.CharField(max_length=20, choices=[
        ('member_of', 'Member of'),
        ('solo_from', 'Solo artist from'),
        ('collaboration', 'Collaboration'),
        ('side_project', 'Side project'),
        ('similar', 'Similar artist'),
    ])
    confidence = models.FloatField(default=1.0)
    
    class Meta:
        unique_together = ('from_artist', 'to_artist', 'relationship_type')

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
    
    # Add these methods to your Song class
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
            return self.peak_rank < original.peak_rank  # Lower rank = more successful
        return False


    def __str__(self):
        return f"{self.title} by {self.artist}, Year: {self.year}, Peak Rank: {self.peak_rank}"
    
class SongTimeline(models.Model):
    song = models.ForeignKey('Song', on_delete=models.CASCADE, related_name='chart_entries')
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
        unique_together = ('song', 'chart_date')  # One entry per song per date

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

class UserSongRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    song = models.ForeignKey('Song', on_delete=models.CASCADE)
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
            song.average_user_score = round(average_score, 1)  # Round to one decimal place
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
    songs = models.ManyToManyField('Song', related_name='bookmarks')

    def __str__(self):
        return f"Bookmarks for {self.user.username}"
    
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
    chart_date = models.DateField()  # Store the date of the chart

    class Meta:
        ordering = ['current_position']
        indexes = [
            models.Index(fields=['current_position']),
            models.Index(fields=['artist']),
        ]
        
    def __str__(self):
        return f"#{self.current_position}: {self.title} by {self.artist}"
