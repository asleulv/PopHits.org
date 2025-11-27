from django.db import models
from django.utils.text import slugify


class Composition(models.Model):
    title = models.CharField(max_length=200)
    original_writer = models.CharField(max_length=200, blank=True)
    original_artist = models.CharField(max_length=200, blank=True, null=True)
    original_year = models.IntegerField(blank=True, null=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    
    # Tracking fields
    is_traditional = models.BooleanField(default=False)
    musicbrainz_work_id = models.CharField(max_length=36, blank=True, null=True)
    verified_source = models.CharField(max_length=50, blank=True)
    
    # Statistics (auto-calculated)
    total_versions = models.IntegerField(default=0)
    most_successful_version = models.ForeignKey(
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
