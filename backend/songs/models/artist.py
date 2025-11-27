from django.db import models
from django.utils.text import slugify


class Artist(models.Model):
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    
    # AI-enriched metadata
    nationality = models.CharField(max_length=100, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    death_date = models.DateField(blank=True, null=True)
    bio = models.TextField(blank=True)

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
    confidence = models.FloatField(default=1.0)
    source = models.CharField(max_length=50)
    
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
