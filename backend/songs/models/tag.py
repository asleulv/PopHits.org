from django.db import models
from django.utils.text import slugify


class SongTag(models.Model):
    """Tags for categorizing songs (seasonal, novelty, themes, etc.)"""
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=60, unique=True, blank=True)
    
    # Visual elements - fully editable in admin
    color = models.CharField(
        max_length=7, 
        default='#3b82f6',
        help_text='Hex color code (e.g., #dc2626 for red)'
    )
    lucide_icon = models.CharField(
        max_length=50,
        blank=True,
        help_text='Lucide icon name (e.g., snowflake, ghost, heart)'
    )
    
    # Optional categorization
    category = models.CharField(
        max_length=30,
        blank=True,
        help_text='Optional: seasonal, theme, novelty, etc.'
    )
    
    description = models.TextField(
        blank=True,
        help_text='Description for SEO and tag pages'
    )
    
    # Display settings
    is_featured = models.BooleanField(
        default=False,
        help_text='Feature this tag on homepage'
    )
    show_in_actions = models.BooleanField(
        default=False,
        help_text='Show this tag in bulk action menu'
    )
    display_order = models.IntegerField(
        default=0,
        help_text='Lower numbers appear first'
    )
    
    # Auto-calculated
    song_count = models.IntegerField(default=0, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['display_order', 'name']
        verbose_name = 'Song Tag'
        verbose_name_plural = 'Song Tags'
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def update_song_count(self):
        self.song_count = self.songs.count()
        self.save(update_fields=['song_count'])
    
    def __str__(self):
        return self.name


class SongTagRelation(models.Model):
    """Many-to-many with metadata"""
    song = models.ForeignKey('Song', on_delete=models.CASCADE, related_name='tag_relations')
    tag = models.ForeignKey(SongTag, on_delete=models.CASCADE, related_name='song_relations')
    
    # Optional: track how tag was added
    source = models.CharField(
        max_length=20,
        choices=[
            ('manual', 'Manual'),
            ('ai', 'AI Detection'),
            ('import', 'Data Import'),
        ],
        default='manual'
    )
    added_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('song', 'tag')
        ordering = ['tag__display_order']
    
    def __str__(self):
        return f"{self.song.title} - {self.tag.name}"
