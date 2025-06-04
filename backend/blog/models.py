from django.db import models
from django.utils.text import slugify
from ckeditor.fields import RichTextField
from songs.models import Song

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=200)
    content = RichTextField()
    featured_image = models.ImageField(upload_to='blog_images/', null=True, blank=True)
    meta_description = models.CharField(max_length=160, help_text="A brief description for SEO purposes (max 160 characters)")
    published_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=False)
    related_songs = models.ManyToManyField(Song, blank=True, related_name='blog_posts', help_text="Select songs that are related to this blog post")
    
    class Meta:
        ordering = ['-published_date']
        verbose_name = "Blog Post"
        verbose_name_plural = "Blog Posts"
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # Generate slug from title if not provided
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
